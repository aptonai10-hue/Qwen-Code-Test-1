import type { Env, User } from './types';
import { ensureAdmin, getSession, deleteSession } from './lib/db';
import { fetchOcds, importTenders } from './lib/ingest';
import { runMatching, runComplianceCheck } from './lib/matching';
import { GeminiProvider } from './providers/llm';
import { createNotificationProvider } from './providers/notification';
import * as db from './lib/db';
import { escapeHtml, formatDate, formatCurrency } from './lib/crypto';


export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // Ensure admin user exists
        await ensureAdmin(env.DB, env);
        
        // Check auth for protected routes
        const sessionCookie = request.headers.get('Cookie')?.match(/session=([^;]+)/)?.[1];
        let user: User | null = null;
        if (sessionCookie) {
            user = await getSession(env.DB, sessionCookie);
        }
        
        const isProtected = path.startsWith('/dash') || path.startsWith('/admin') || path.startsWith('/packs');
        if (isProtected && !user && path !== '/login' && !path.startsWith('/api/')) {
            return Response.redirect(url.origin + '/login', 302);
        }

        try {
            // Static assets
            if (path === '/style.css') {
                return new Response(await readAsset('./public/style.css', ctx), {
                    headers: { 'Content-Type': 'text/css' }
                });
            }

            // Root - redirect to login or dash
            if (path === '/') {
                if (user) return Response.redirect(url.origin + '/dash', 302);
                return new Response(renderLoginPage(), { headers: { 'Content-Type': 'text/html' } });
            }

            // Login POST
            if (path === '/login' && request.method === 'POST') {
                return handleLogin(request, env, url);
            }

            // Logout
            if (path === '/logout') {
                return handleLogout(sessionCookie, url);
            }

            // Dashboard
            if (path === '/dash') {
                const stats = await getDashboardStats(env.DB);
                return new Response(renderDashboard(stats, user!), { headers: { 'Content-Type': 'text/html' } });
            }

            // Tenders page
            if (path === '/dash/tenders') {
                const search = url.searchParams.get('q') || '';
                const result = await db.getTenders(env.DB, 100, 0, search);
                return new Response(renderTenders(result.tenders, result.total, search, user!), { headers: { 'Content-Type': 'text/html' } });
            }

            // Matches page
            if (path === '/dash/matches') {
                const matches = await db.getMatches(env.DB);
                return new Response(renderMatches(matches, user!), { headers: { 'Content-Type': 'text/html' } });
            }

            // Outbox page
            if (path === '/dash/outbox') {
                const alerts = await db.getAlerts(env.DB);
                const hasTwilio = !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN);
                return new Response(renderOutbox(alerts, hasTwilio, user!), { headers: { 'Content-Type': 'text/html' } });
            }

            // Contractors pages
            if (path === '/dash/contractors') {
                const contractors = await db.getContractors(env.DB);
                return new Response(renderContractors(contractors, user!), { headers: { 'Content-Type': 'text/html' } });
            }

            if (path === '/dash/contractors/new') {
                return new Response(renderContractorForm(undefined, user!), { headers: { 'Content-Type': 'text/html' } });
            }

            if (path.match(/^\/dash\/contractors\/\d+$/)) {
                const id = parseInt(path.split('/').pop()!);
                const contractor = await db.getContractor(env.DB, id);
                if (!contractor) return new Response('Not found', { status: 404 });
                return new Response(renderContractorForm(contractor, user!), { headers: { 'Content-Type': 'text/html' } });
            }

            if (path === '/dash/contractors/new' && request.method === 'POST') {
                const formData = await request.formData();
                await db.createContractor(env.DB, formDataToObject(formData));
                return new Response(null, { status: 302, headers: { 'Location': '/dash/contractors' } });
            }

            if (path.match(/^\/dash\/contractors\/\d+$/) && request.method === 'POST') {
                const id = parseInt(path.split('/').pop()!);
                const formData = await request.formData();
                await db.updateContractor(env.DB, id, formDataToObject(formData));
                return new Response(null, { status: 302, headers: { 'Location': '/dash/contractors' } });
            }

            // Bid packs pages
            if (path === '/dash/packs') {
                const packs = await db.getBidPacks(env.DB);
                return new Response(renderPacks(packs, user!), { headers: { 'Content-Type': 'text/html' } });
            }

            if (path.match(/^\/dash\/packs\/\d+$/)) {
                const id = parseInt(path.split('/').pop()!);
                const pack = await db.getBidPack(env.DB, id);
                if (!pack) return new Response('Not found', { status: 404 });
                const tender = await db.getTender(env.DB, pack.tender_id);
                const contractor = await db.getContractor(env.DB, pack.contractor_id);
                return new Response(renderPackEdit(pack, tender, contractor, user!), { headers: { 'Content-Type': 'text/html' } });
            }

            // API routes
            if (path === '/api/tenders') {
                const result = await db.getTenders(env.DB, 100, 0);
                return jsonResponse(result.tenders);
            }

            if (path === '/api/matches') {
                const contractorId = url.searchParams.get('contractor_id');
                const matches = await db.getMatches(env.DB, contractorId ? parseInt(contractorId) : undefined);
                return jsonResponse(matches);
            }

            if (path === '/admin/ingest' && request.method === 'POST') {
                const result = await fetchOcds(env);
                return jsonResponse(result);
            }

            if (path === '/admin/import' && request.method === 'POST') {
                return handleImport(request, env);
            }

            if (path.match(/^\/packs\/\d+\/draft$/) && request.method === 'POST') {
                const id = parseInt(path.split('/')[2]);
                const result = await draftBidPack(env, id);
                return jsonResponse(result);
            }

            if (path.match(/^\/packs\/\d+$/) && request.method === 'POST') {
                const id = parseInt(path.split('/')[2]);
                const formData = await request.formData();
                const contentMd = formData.get('content_md') as string;
                await db.updateBidPack(env.DB, id, contentMd);
                return new Response(null, { status: 302, headers: { 'Location': `/dash/packs/${id}` } });
            }

            if (path.match(/^\/packs\/\d+\/approve$/) && request.method === 'POST') {
                const id = parseInt(path.split('/')[2]);
                await db.updateBidPack(env.DB, id, '', 'approved');
                return new Response(null, { status: 302, headers: { 'Location': '/dash/packs' } });
            }

            if (path.match(/^\/packs\/\d+\/copy$/)) {
                return handleCopyPack(env, parseInt(path.split('/')[2]));
            }

            if (path.match(/^\/packs\/\d+\/download$/)) {
                return handleDownloadPack(env, parseInt(path.split('/')[2]));
            }

            if (path.match(/^\/alerts\/\d+\/sent$/) && request.method === 'POST') {
                return handleSendAlert(env, parseInt(path.split('/')[2]));
            }

            // Cron handler
            if (request.headers.get('X-Scheduled-Task') || path === '/cron') {
                await runCronJobs(env);
                return new Response('Cron completed');
            }

            return new Response('Not Found', { status: 404 });
        } catch (error: any) {
            console.error('Request error:', error);
            return new Response(`Error: ${error.message}`, { status: 500 });
        }
    }
};
