import type { Env, Tender } from '../types';
import { upsertTender, logIngest } from '../lib/db';

export async function fetchOcds(env: Env): Promise<{ fetched: number; inserted: number; error?: string }> {
    try {
        const response = await fetch(env.OCDS_URL);
        if (!response.ok) {
            throw new Error(`OCDS fetch failed: ${response.status}`);
        }

        const data = await response.json();
        let releases = data.releases || data.records || [];
        
        // Handle OCDS record format
        if (data.records) {
            releases = data.records.flatMap((r: any) => r.releases || []);
        }

        let inserted = 0;
        let fetched = releases.length;

        for (const release of releases) {
            try {
                const tender = parseOcdsRelease(release);
                if (tender && tender.title) {
                    await upsertTender(env.DB, tender);
                    inserted++;
                }
            } catch (parseError: any) {
                console.error('Failed to parse release:', parseError.message);
            }
        }

        await logIngest(env.DB, 'ocds', fetched, inserted);
        return { fetched, inserted };
    } catch (error: any) {
        const errorMsg = error.message || 'Unknown OCDS error';
        await logIngest(env.DB, 'ocds', 0, 0, errorMsg);
        return { fetched: 0, inserted: 0, error: errorMsg };
    }
}

function parseOcdsRelease(release: any): Partial<Tender> | null {
    if (!release || !release.tender) {
        return null;
    }

    const tender = release.tender;
    
    // Extract categories/classifications
    const categories = tender.classifications?.map((c: any) => c.id || c.description).join(', ') 
        || tender.mainContactPoint?.name 
        || '';

    // Extract region from tender address or items
    const region = tender.address?.region || tender.items?.[0]?.deliveryLocation?.[0]?.address?.region || '';

    // Get closing date
    const closingDate = tender.tenderPeriod?.endDate ? tender.tenderPeriod.endDate.slice(0, 10) : null;
    
    // Get published date
    const publishedDate = release.date ? release.date.slice(0, 10) : null;

    // Get value
    const value = tender.value?.amount || null;

    return {
        source: 'ocds',
        source_id: release.id || release.ocid,
        title: tender.title || '',
        description: tender.description || '',
        procuring_entity: tender.procuringEntity?.name || '',
        region: region,
        categories: categories,
        value_kwacha: value,
        closing_date: closingDate,
        published_date: publishedDate,
        raw_json: release
    };
}

export async function importTenders(db: D1Database, tenders: Partial<Tender>[]): Promise<{ inserted: number; error?: string }> {
    try {
        let inserted = 0;
        for (const tenderData of tenders) {
            try {
                // Generate source_id if not provided
                if (!tenderData.source_id) {
                    tenderData.source_id = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                }
                tenderData.source = 'manual';
                await upsertTender(db, tenderData);
                inserted++;
            } catch (insertError: any) {
                console.error('Failed to insert tender:', insertError.message);
            }
        }
        await logIngest(db, 'manual_import', tenders.length, inserted);
        return { inserted };
    } catch (error: any) {
        return { inserted: 0, error: error.message };
    }
}
