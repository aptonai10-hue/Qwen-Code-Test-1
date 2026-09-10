export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        data,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
    
    const exportedKey = await crypto.subtle.exportKey('raw', key);
    const hashBuffer = new Uint8Array(exportedKey);
    
    // Combine salt and hash
    const combined = new Uint8Array(salt.length + hashBuffer.length);
    combined.set(salt);
    combined.set(hashBuffer, salt.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        const combined = Uint8Array.from(atob(hash), c => c.charCodeAt(0));
        const salt = combined.slice(0, 16);
        const storedHash = combined.slice(16);
        
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            data,
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );
        
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
        
        const exportedKey = await crypto.subtle.exportKey('raw', key);
        const computedHash = new Uint8Array(exportedKey);
        
        // Constant-time comparison
        if (computedHash.length !== storedHash.length) return false;
        let result = 0;
        for (let i = 0; i < computedHash.length; i++) {
            result |= computedHash[i] ^ storedHash[i];
        }
        return result === 0;
    } catch {
        return false;
    }
}

export function randomToken(length: number): string {
    const array = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function escapeHtml(str: string): string {
    const div = { value: '' };
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, m => map[m as keyof typeof map]);
}

export function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

export function formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return '';
    return `K${value.toLocaleString('en-ZM', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function daysUntil(dateStr: string | null): number | null {
    if (!dateStr) return null;
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

export function encodeUrlComponent(str: string): string {
    return encodeURIComponent(str);
}
