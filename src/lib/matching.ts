import type { Tender, Contractor } from '../types';
import { createMatch, createAlert } from './db';

export function calculateMatchScore(tender: Tender, contractor: Contractor): { score: number; reasons: string[] } {
    const reasons: string[] = [];
    let score = 0;

    // 1. NCC Class overlap (40 points max)
    const classScore = calculateClassOverlap(tender, contractor);
    if (classScore > 0) {
        reasons.push(`NCC classes match: ${classScore.matches}`);
        score += classScore.score;
    }

    // 2. Region match (25 points)
    const regionScore = calculateRegionMatch(tender, contractor);
    if (regionScore) {
        reasons.push(`Region match: ${tender.region}`);
        score += 25;
    }

    // 3. Keyword hits (20 points max)
    const keywordScore = calculateKeywordHits(tender, contractor);
    if (keywordScore > 0) {
        reasons.push(`Keywords matched: ${keywordScore.hits}`);
        score += keywordScore.score;
    }

    // 4. Closing date bonus (15 points if still open)
    if (tender.closing_date) {
        const closingDate = new Date(tender.closing_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (closingDate >= today) {
            reasons.push('Tender is still open');
            score += 15;
        } else {
            reasons.push('Tender may be closed');
        }
    }

    return { score, reasons };
}

function calculateClassOverlap(tender: Tender, contractor: Contractor): { score: number; matches: string } {
    const tenderCategories = (tender.categories || '').toLowerCase().split(/[,;]/).map(s => s.trim()).filter(Boolean);
    const contractorClasses = (contractor.ncc_classes || '').toLowerCase().split(/[,;]/).map(s => s.trim()).filter(Boolean);
    
    if (tenderCategories.length === 0 || contractorClasses.length === 0) {
        return { score: 0, matches: 'none' };
    }

    const matches: string[] = [];
    for (const cat of tenderCategories) {
        for (const cls of contractorClasses) {
            // Simple substring match - could be enhanced later
            if (cat.includes(cls) || cls.includes(cat)) {
                matches.push(cls);
            }
        }
    }

    if (matches.length === 0) {
        return { score: 0, matches: 'none' };
    }

    // Score based on percentage of contractor classes that match
    const percentage = matches.length / Math.max(contractorClasses.length, 1);
    const score = Math.round(40 * percentage);
    
    return { score, matches: [...new Set(matches)].join(', ') };
}

function calculateRegionMatch(tender: Tender, contractor: Contractor): boolean {
    if (!tender.region || !contractor.regions) {
        return false;
    }

    const tenderRegion = tender.region.toLowerCase().trim();
    const contractorRegions = contractor.regions.toLowerCase().split(/[,;]/).map(s => s.trim());
    
    // Check for exact match or if contractor covers "all" regions
    return contractorRegions.includes(tenderRegion) || contractorRegions.includes('all') || contractorRegions.includes('nationwide');
}

function calculateKeywordHits(tender: Tender, contractor: Contractor): { score: number; hits: number } {
    const keywords = (contractor.keywords || '').toLowerCase().split(/[,;]/).map(s => s.trim()).filter(Boolean);
    if (keywords.length === 0) {
        return { score: 0, hits: 0 };
    }

    const tenderText = `${tender.title} ${tender.description} ${tender.categories}`.toLowerCase();
    
    let hits = 0;
    for (const keyword of keywords) {
        if (tenderText.includes(keyword)) {
            hits++;
        }
    }

    if (hits === 0) {
        return { score: 0, hits: 0 };
    }

    // Normalize to 20 points max
    const score = Math.min(20, Math.round((hits / keywords.length) * 20));
    return { score, hits };
}

export async function runMatching(db: D1Database): Promise<{ matched: number }> {
    // Get all tenders and contractors
    const tendersResult = await db.prepare('SELECT * FROM tenders').all();
    const contractorsResult = await db.prepare('SELECT * FROM contractors').all();
    
    const tenders = tendersResult.results as Tender[];
    const contractors = contractorsResult.results as Contractor[];
    
    let matched = 0;

    for (const tender of tenders) {
        for (const contractor of contractors) {
            const { score, reasons } = calculateMatchScore(tender, contractor);
            
            if (score >= 50) {
                // Create or update match
                const matchId = await createMatch(db, tender.id, contractor.id, score, reasons.join('; '));
                
                // Check if alert already exists for this match
                const existingAlert = await db.prepare(
                    'SELECT id FROM alerts WHERE match_id = ? AND kind = ?'
                ).bind(matchId, 'tender').first();

                if (!existingAlert) {
                    // Queue tender alert
                    const alertBody = formatTenderAlert(tender, contractor);
                    await createAlert(db, {
                        contractor_id: contractor.id,
                        match_id: matchId,
                        kind: 'tender',
                        status: 'queued',
                        body: alertBody
                    });
                }
                
                matched++;
            }
        }
    }

    return { matched };
}

function formatTenderAlert(tender: Tender, contractor: Contractor): string {
    const valueStr = tender.value_kwacha ? `K${tender.value_kwacha.toLocaleString()}` : 'Not specified';
    const closingStr = tender.closing_date ? new Date(tender.closing_date).toLocaleDateString('en-GB') : 'Not specified';
    
    return `TenderBrain: ${tender.title} — ${tender.procuring_entity || 'Unknown entity'}. Region: ${tender.region || 'Not specified'}. Closes: ${closingStr}. Est value: ${valueStr}. Matches your ${contractor.ncc_classes || 'registered'} Grade ${contractor.ncc_grade || ''}. Reply PACK for an AI-drafted bid pack.`;
}

export async function runComplianceCheck(db: D1Database): Promise<{ alertsQueued: number }> {
    const contractors = (await db.prepare('SELECT * FROM contractors').all()).results as Contractor[];
    const expiryFields = [
        { field: 'ncc_expiry', name: 'NCC registration' },
        { field: 'eiz_expiry', name: 'EIZ registration' },
        { field: 'pacra_expiry', name: 'PACRA registration' },
        { field: 'zra_expiry', name: 'ZRA registration' }
    ];
    
    const thresholdDays = [30, 14, 7, 0];
    let alertsQueued = 0;

    for (const contractor of contractors) {
        for (const { field, name } of expiryFields) {
            const expiryDate = (contractor as any)[field] as string | null;
            if (!expiryDate) continue;

            const daysLeft = daysUntilDate(expiryDate);
            if (daysLeft === null) continue;

            if (thresholdDays.includes(daysLeft)) {
                // Check if alert already exists for this expiry
                const existingAlert = await db.prepare(`
                    SELECT id FROM alerts 
                    WHERE contractor_id = ? AND kind = 'compliance' AND body LIKE ? AND status IN ('queued', 'manual')
                `).bind(contractor.id, `%${name}%`).first();

                if (!existingAlert) {
                    const alertBody = `Your ${name} expires in ${daysLeft} days. Renew now to keep bidding. — TenderBrain ZM`;
                    await createAlert(db, {
                        contractor_id: contractor.id,
                        kind: 'compliance',
                        status: 'queued',
                        body: alertBody
                    });
                    alertsQueued++;
                }
            }
        }
    }

    return { alertsQueued };
}

function daysUntilDate(dateStr: string): number | null {
    try {
        const target = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        const diff = target.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch {
        return null;
    }
}
