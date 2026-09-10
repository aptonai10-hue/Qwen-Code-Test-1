# TenderBrain ZM

MVP SaaS for Zambian contractors that monitors ZPPA tenders, matches them to contractor NCC profiles, sends WhatsApp alerts, tracks compliance expiry dates, and drafts bid packs with AI.

## Quick Start

```bash
# Install dependencies
npm install

# Create D1 database
wrangler d1 create tenderbrain-db
# Note the database_id from output, update wrangler.toml

# Run migrations
wrangler d1 execute tenderbrain-db --file=migrations/001_initial.sql

# Copy environment variables
cp .env.example .dev.vars
# Edit .dev.vars with your GEMINI_API_KEY

# Run locally
npm run dev

# Deploy
npm run deploy
```

## Environment Variables

Required:
- `GEMINI_API_KEY` - Google Gemini API key for AI bid pack generation

Optional:
- `OPENROUTER_KEY` - Fallback LLM provider if Gemini fails
- `TWILIO_ACCOUNT_SID` - For automatic WhatsApp sending (uses WaMeOutboxProvider if absent)
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `OCDS_URL` - OCDS feed URL (default: Zambia ZPPA)
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password

## Features

### Tender Ingestion
- Daily cron at 04:30 UTC (06:30 CAT) fetches from OCDS ZPPA feed
- Manual import via POST /admin/import (JSON array or CSV)
- Fallback ingestion ensures system works even if OCDS is unreachable

### Matching Algorithm
Simple explainable scoring (no embeddings):
- 40 pts: NCC class overlap with tender categories
- 25 pts: Region match
- 20 pts: Keyword hits in tender text
- 15 pts: Closing date bonus (if still open)
- Threshold: score >= 50 creates match + queues alert

### Alerts
- **Tender alerts**: "TenderBrain: <title> — <entity>. Region: <region>. Closes: <date>. Est value: K<value>. Matches your <classes> Grade <grade>. Reply PACK for AI-drafted bid pack."
- **Compliance clock**: Alerts at 30, 14, 7, 0 days before NCC/EIZ/PACRA/ZRA expiry
- **Notification providers**:
  - TwilioWhatsAppProvider: Auto-sends via Twilio WhatsApp sandbox
  - WaMeOutboxProvider (default): Creates wa.me links for manual sending

### Bid Pack Drafter
POST /packs/:id/draft generates markdown with:
1. Cover letter
2. Company profile section
3. Methodology outline
4. Compliance checklist (NCC, EIZ, PACRA, ZRA statuses)
5. Draft BOQ placeholder table

Dashboard allows edit, approve, copy, download as .doc

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Login page |
| POST | /login | Email+password auth |
| GET | /dash | Dashboard with stats |
| GET | /dash/tenders | Tenders list + search |
| GET | /dash/matches | Matches with scores |
| GET | /dash/outbox | Alert outbox |
| GET | /dash/contractors | Contractor management |
| GET | /dash/packs | Bid packs list |
| GET | /api/tenders | JSON tenders |
| GET | /api/matches?contractor_id= | JSON matches |
| POST | /admin/ingest | Trigger OCDS ingest |
| POST | /admin/import | Import tenders (JSON/CSV) |
| POST | /packs/:id/draft | Generate AI bid pack |
| POST | /packs/:id/approve | Approve pack |
| POST | /alerts/:id/sent | Mark alert sent |

## Database Schema

See `migrations/001_initial.sql`:
- users, sessions (auth)
- contractors (NCC profiles, expiry dates)
- tenders (from OCDS or manual import)
- matches (tender-contractor pairs with scores)
- alerts (queued/sent/manual status)
- bid_packs (AI-generated content)
- ingest_log (audit trail)

## Cron Schedule

Daily at 04:30 UTC (06:30 CAT):
1. Fetch OCDS tenders
2. Run matching algorithm
3. Check compliance expiries
4. Send queued alerts

## Deployment

```bash
# Update wrangler.toml with your D1 database_id
# Set environment variables in Cloudflare dashboard or wrangler.toml

npm run deploy
```

## GitHub Push

```bash
git init
git add .
git commit -m "Initial commit: TenderBrain ZM MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tenderbrain-zm.git
git push -u origin main
```

## PHASE 2 MAKEUP (TODO)

- [ ] Loader animations
- [ ] Pricing page
- [ ] Landing page with branding
- [ ] Custom CSS theme/logos
- [ ] Meta WhatsApp Cloud API integration
- [ ] Email notifications
- [ ] Multi-user contractor assignments
- [ ] Advanced filtering/search
- [ ] Export reports (PDF)
- [ ] Tender history tracking
- [ ] User onboarding flow

## License

MIT
