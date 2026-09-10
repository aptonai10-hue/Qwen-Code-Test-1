import { hashPassword, verifyPassword, randomToken } from './crypto';
import type { Env, Contractor, Tender, Match, Alert, BidPack, User } from '../types';

export async function ensureAdmin(db: D1Database, env: Env): Promise<void> {
    const existing = await db.prepare('SELECT id FROM users LIMIT 1').first();
    if (!existing) {
        const passwordHash = await hashPassword(env.ADMIN_PASSWORD || 'changeme123');
        await db.prepare(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)'
        ).bind(env.ADMIN_EMAIL || 'admin@tenderbrain.co.zm', passwordHash, 'admin').run();
    }
}

export async function getSession(db: D1Database, token: string): Promise<User | null> {
    const session = await db.prepare(`
        SELECT u.id, u.email, u.role, u.created_at
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first() as User | null;
    return session;
}

export async function createSession(db: D1Database, userId: number): Promise<string> {
    const token = randomToken(32);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19);
    await db.prepare(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)'
    ).bind(userId, token, expiresAt).run();
    return token;
}

export async function deleteSession(db: D1Database, token: string): Promise<void> {
    await db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
}

export async function authenticateUser(db: D1Database, email: string, password: string): Promise<User | null> {
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first() as User | null;
    if (!user) return null;
    
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) return null;
    
    return user;
}

// Contractor helpers
export async function getContractors(db: D1Database): Promise<Contractor[]> {
    const result = await db.prepare('SELECT * FROM contractors ORDER BY created_at DESC').all();
    return result.results as Contractor[];
}

export async function getContractor(db: D1Database, id: number): Promise<Contractor | null> {
    return await db.prepare('SELECT * FROM contractors WHERE id = ?').bind(id).first() as Contractor | null;
}

export async function createContractor(db: D1Database, data: Partial<Contractor>): Promise<number> {
    const result = await db.prepare(`
        INSERT INTO contractors (user_id, name, ncc_classes, ncc_grade, regions, keywords, phone_whatsapp, ncc_expiry, eiz_expiry, pacra_expiry, zra_expiry)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        data.user_id || null,
        data.name || '',
        data.ncc_classes || '',
        data.ncc_grade || '',
        data.regions || '',
        data.keywords || '',
        data.phone_whatsapp || '',
        data.ncc_expiry || null,
        data.eiz_expiry || null,
        data.pacra_expiry || null,
        data.zra_expiry || null
    ).run();
    return result.meta!.last_row_id as number;
}

export async function updateContractor(db: D1Database, id: number, data: Partial<Contractor>): Promise<void> {
    await db.prepare(`
        UPDATE contractors SET
            name = COALESCE(?, name),
            ncc_classes = COALESCE(?, ncc_classes),
            ncc_grade = COALESCE(?, ncc_grade),
            regions = COALESCE(?, regions),
            keywords = COALESCE(?, keywords),
            phone_whatsapp = COALESCE(?, phone_whatsapp),
            ncc_expiry = COALESCE(?, ncc_expiry),
            eiz_expiry = COALESCE(?, eiz_expiry),
            pacra_expiry = COALESCE(?, pacra_expiry),
            zra_expiry = COALESCE(?, zra_expiry)
        WHERE id = ?
    `).bind(
        data.name,
        data.ncc_classes,
        data.ncc_grade,
        data.regions,
        data.keywords,
        data.phone_whatsapp,
        data.ncc_expiry,
        data.eiz_expiry,
        data.pacra_expiry,
        data.zra_expiry,
        id
    ).run();
}

// Tender helpers
export async function getTenders(db: D1Database, limit = 100, offset = 0, search = ''): Promise<{ tenders: Tender[], total: number }> {
    let countQuery = 'SELECT COUNT(*) as count FROM tenders';
    let dataQuery = 'SELECT * FROM tenders';
    const params: any[] = [];
    
    if (search) {
        countQuery += ' WHERE title LIKE ? OR procuring_entity LIKE ?';
        dataQuery += ' WHERE title LIKE ? OR procuring_entity LIKE ?';
        params.push(`%${search}%`, `%${search}%`);
    }
    
    countQuery += ' ORDER BY created_at DESC';
    dataQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    
    const totalResult = await db.prepare(countQuery).bind(...params).first() as { count: number };
    params.push(limit, offset);
    const tendersResult = await db.prepare(dataQuery).bind(...params).all();
    
    return { tenders: tendersResult.results as Tender[], total: totalResult.count };
}

export async function getTender(db: D1Database, id: number): Promise<Tender | null> {
    return await db.prepare('SELECT * FROM tenders WHERE id = ?').bind(id).first() as Tender | null;
}

export async function upsertTender(db: D1Database, tender: Partial<Tender>): Promise<number> {
    const result = await db.prepare(`
        INSERT INTO tenders (source, source_id, title, description, procuring_entity, region, categories, value_kwacha, closing_date, published_date, raw_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(source_id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            procuring_entity = excluded.procuring_entity,
            region = excluded.region,
            categories = excluded.categories,
            value_kwacha = excluded.value_kwacha,
            closing_date = excluded.closing_date,
            published_date = excluded.published_date,
            raw_json = excluded.raw_json
    `).bind(
        tender.source || 'ocds',
        tender.source_id || null,
        tender.title || '',
        tender.description || '',
        tender.procuring_entity || '',
        tender.region || '',
        tender.categories || '',
        tender.value_kwacha || null,
        tender.closing_date || null,
        tender.published_date || null,
        tender.raw_json ? JSON.stringify(tender.raw_json) : null
    ).run();
    
    if (result.meta!.changes > 0 && !tender.id) {
        // It was an update, get the existing ID
        const existing = await db.prepare('SELECT id FROM tenders WHERE source_id = ?').bind(tender.source_id).first() as { id: number };
        return existing.id;
    }
    return result.meta!.last_row_id as number;
}

// Match helpers
export async function getMatches(db: D1Database, contractorId?: number): Promise<Match[]> {
    let query = 'SELECT m.*, t.title as tender_title, t.procuring_entity, c.name as contractor_name FROM matches m JOIN tenders t ON m.tender_id = t.id JOIN contractors c ON m.contractor_id = c.id';
    if (contractorId) {
        query += ' WHERE m.contractor_id = ?';
        return (await db.prepare(query + ' ORDER BY m.created_at DESC').bind(contractorId).all()).results as Match[];
    }
    return (await db.prepare(query + ' ORDER BY m.created_at DESC').all()).results as Match[];
}

export async function createMatch(db: D1Database, tenderId: number, contractorId: number, score: number, reasons: string): Promise<number> {
    const result = await db.prepare(`
        INSERT OR IGNORE INTO matches (tender_id, contractor_id, score, reasons)
        VALUES (?, ?, ?, ?)
    `).bind(tenderId, contractorId, score, reasons).run();
    
    if (result.meta!.changes === 0) {
        // Update existing
        await db.prepare('UPDATE matches SET score = ?, reasons = ? WHERE tender_id = ? AND contractor_id = ?')
            .bind(score, reasons, tenderId, contractorId).run();
    }
    
    const match = await db.prepare('SELECT id FROM matches WHERE tender_id = ? AND contractor_id = ?')
        .bind(tenderId, contractorId).first() as { id: number };
    return match.id;
}

// Alert helpers
export async function getAlerts(db: D1Database, status?: string): Promise<Alert[]> {
    let query = 'SELECT a.*, c.name as contractor_name FROM alerts a JOIN contractors c ON a.contractor_id = c.id';
    if (status) {
        query += ' WHERE a.status = ?';
        return (await db.prepare(query + ' ORDER BY a.created_at DESC').bind(status).all()).results as Alert[];
    }
    return (await db.prepare(query + ' ORDER BY a.created_at DESC').all()).results as Alert[];
}

export async function createAlert(db: D1Database, alert: Partial<Alert>): Promise<number> {
    const result = await db.prepare(`
        INSERT INTO alerts (contractor_id, match_id, kind, status, body, wa_link)
        VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
        alert.contractor_id!,
        alert.match_id || null,
        alert.kind!,
        alert.status || 'queued',
        alert.body!,
        alert.wa_link || null
    ).run();
    return result.meta!.last_row_id as number;
}

export async function updateAlertStatus(db: D1Database, id: number, status: string): Promise<void> {
    const sentAt = status === 'sent' ? new Date().toISOString().slice(0, 19) : null;
    await db.prepare(`
        UPDATE alerts SET status = ?, sent_at = COALESCE(?, sent_at) WHERE id = ?
    `).bind(status, sentAt, id).run();
}

// Bid pack helpers
export async function getBidPacks(db: D1Database, contractorId?: number): Promise<BidPack[]> {
    let query = 'SELECT b.*, t.title as tender_title, c.name as contractor_name FROM bid_packs b JOIN tenders t ON b.tender_id = t.id JOIN contractors c ON b.contractor_id = c.id';
    if (contractorId) {
        query += ' WHERE b.contractor_id = ?';
    }
    return (await db.prepare(query + ' ORDER BY b.created_at DESC').bind(contractorId || null).all()).results as BidPack[];
}

export async function getBidPack(db: D1Database, id: number): Promise<BidPack | null> {
    return await db.prepare('SELECT * FROM bid_packs WHERE id = ?').bind(id).first() as BidPack | null;
}

export async function createBidPack(db: D1Database, contractorId: number, tenderId: number, contentMd: string): Promise<number> {
    const result = await db.prepare(`
        INSERT INTO bid_packs (contractor_id, tender_id, content_md)
        VALUES (?, ?, ?)
    `).bind(contractorId, tenderId, contentMd).run();
    return result.meta!.last_row_id as number;
}

export async function updateBidPack(db: D1Database, id: number, contentMd: string, status?: string): Promise<void> {
    const params: any[] = [contentMd];
    let sql = 'UPDATE bid_packs SET content_md = ?, updated_at = CURRENT_TIMESTAMP';
    if (status) {
        sql += ', status = ?';
        params.push(status);
    }
    sql += ' WHERE id = ?';
    params.push(id);
    await db.prepare(sql).bind(...params).run();
}

// Stats helpers
export async function getStats(db: D1Database): Promise<any> {
    const tenderCount = await db.prepare('SELECT COUNT(*) as count FROM tenders').first() as { count: number };
    const matchCount = await db.prepare('SELECT COUNT(*) as count FROM matches').first() as { count: number };
    const queuedAlerts = await db.prepare("SELECT COUNT(*) as count FROM alerts WHERE status IN ('queued', 'manual')").first() as { count: number };
    const contractorCount = await db.prepare('SELECT COUNT(*) as count FROM contractors').first() as { count: number };
    
    const upcomingExpiries = await db.prepare(`
        SELECT name, 'NCC' as doc_type, ncc_expiry as expiry_date FROM contractors WHERE ncc_expiry IS NOT NULL AND ncc_expiry >= date('now')
        UNION ALL
        SELECT name, 'EIZ' as doc_type, eiz_expiry as expiry_date FROM contractors WHERE eiz_expiry IS NOT NULL AND eiz_expiry >= date('now')
        UNION ALL
        SELECT name, 'PACRA' as doc_type, pacra_expiry as expiry_date FROM contractors WHERE pacra_expiry IS NOT NULL AND pacra_expiry >= date('now')
        UNION ALL
        SELECT name, 'ZRA' as doc_type, zra_expiry as expiry_date FROM contractors WHERE zra_expiry IS NOT NULL AND zra_expiry >= date('now')
        ORDER BY expiry_date ASC LIMIT 5
    `).all();
    
    const latestMatches = await db.prepare(`
        SELECT m.score, m.reasons, t.title as tender_title, c.name as contractor_name, m.created_at
        FROM matches m
        JOIN tenders t ON m.tender_id = t.id
        JOIN contractors c ON m.contractor_id = c.id
        ORDER BY m.created_at DESC LIMIT 5
    `).all();
    
    return {
        tenderCount: tenderCount.count,
        matchCount: matchCount.count,
        queuedAlerts: queuedAlerts.count,
        contractorCount: contractorCount.count,
        upcomingExpiries: upcomingExpiries.results,
        latestMatches: latestMatches.results
    };
}

// Ingest log helpers
export async function logIngest(db: D1Database, source: string, fetched: number, inserted: number, error?: string): Promise<void> {
    await db.prepare('INSERT INTO ingest_log (source, fetched, inserted, error) VALUES (?, ?, ?, ?)')
        .bind(source, fetched, inserted, error || null).run();
}
