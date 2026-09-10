export interface Env {
    DB: D1Database;
    GEMINI_API_KEY: string;
    OPENROUTER_KEY?: string;
    TWILIO_ACCOUNT_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
    OCDS_URL: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
}

export interface User {
    id: number;
    email: string;
    password_hash: string;
    role: string;
    created_at: string;
}

export interface Contractor {
    id: number;
    user_id: number | null;
    name: string;
    ncc_classes: string | null;
    ncc_grade: string | null;
    regions: string | null;
    keywords: string | null;
    phone_whatsapp: string | null;
    ncc_expiry: string | null;
    eiz_expiry: string | null;
    pacra_expiry: string | null;
    zra_expiry: string | null;
    created_at: string;
}

export interface Tender {
    id: number;
    source: string;
    source_id: string | null;
    title: string;
    description: string | null;
    procuring_entity: string | null;
    region: string | null;
    categories: string | null;
    value_kwacha: number | null;
    closing_date: string | null;
    published_date: string | null;
    raw_json: any;
    created_at: string;
}

export interface Match {
    id: number;
    tender_id: number;
    contractor_id: number;
    score: number;
    reasons: string | null;
    created_at: string;
    tender_title?: string;
    procuring_entity?: string;
    contractor_name?: string;
}

export interface Alert {
    id: number;
    contractor_id: number;
    match_id: number | null;
    kind: 'tender' | 'compliance';
    status: 'queued' | 'sent' | 'failed' | 'manual';
    body: string;
    wa_link: string | null;
    sent_at: string | null;
    created_at: string;
    contractor_name?: string;
}

export interface BidPack {
    id: number;
    contractor_id: number;
    tender_id: number;
    status: 'draft' | 'approved';
    content_md: string;
    created_at: string;
    updated_at: string;
    tender_title?: string;
    contractor_name?: string;
}

export interface IngestLog {
    id: number;
    ran_at: string;
    source: string;
    fetched: number;
    inserted: number;
    error: string | null;
}

export interface NotificationResult {
    success: boolean;
    error?: string;
    messageId?: string;
}

export interface NotificationProvider {
    send(phone: string, body: string): Promise<NotificationResult>;
}
