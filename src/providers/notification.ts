import type { Env, NotificationProvider, NotificationResult } from '../types';

export class TwilioWhatsAppProvider implements NotificationProvider {
    private accountSid: string;
    private authToken: string;
    private fromNumber: string = 'whatsapp:+14155238886';

    constructor(env: Env) {
        this.accountSid = env.TWILIO_ACCOUNT_SID || '';
        this.authToken = env.TWILIO_AUTH_TOKEN || '';
    }

    async send(phone: string, body: string): Promise<NotificationResult> {
        if (!this.accountSid || !this.authToken) {
            return { success: false, error: 'Twilio credentials not configured' };
        }

        // Ensure phone number format
        const toNumber = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
        
        try {
            const authHeader = btoa(`${this.accountSid}:${this.authToken}`);
            const response = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${authHeader}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        From: this.fromNumber,
                        To: toNumber,
                        Body: body
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { 
                    success: false, 
                    error: errorData.message || `HTTP ${response.status}` 
                };
            }

            const data = await response.json();
            return { success: true, messageId: data.sid };
        } catch (error: any) {
            return { success: false, error: error.message || 'Unknown error' };
        }
    }
}

export class WaMeOutboxProvider implements NotificationProvider {
    async send(phone: string, body: string): Promise<NotificationResult> {
        // This provider doesn't actually send - it creates a wa.me link for manual sending
        const cleanPhone = phone.replace(/^whatsapp:/, '').replace(/[^0-9+]/g, '');
        const encodedBody = encodeURIComponent(body);
        const waLink = `https://wa.me/${cleanPhone}?text=${encodedBody}`;
        
        // Return the link as messageId so caller can store it
        return { success: true, messageId: waLink };
    }
}

export function createNotificationProvider(env: Env): NotificationProvider {
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
        return new TwilioWhatsAppProvider(env);
    }
    return new WaMeOutboxProvider();
}
