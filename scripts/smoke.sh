#!/bin/bash
# Smoke test script for TenderBrain ZM
set -e

BASE_URL="${BASE_URL:-http://localhost:8787}"
echo "Testing against $BASE_URL"

# Test 1: Login page loads
echo "Test 1: Login page..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$RESPONSE" = "200" ]; then echo "✓ Login page loads"; else echo "✗ Login page failed ($RESPONSE)"; fi

# Test 2: Admin ingest endpoint (will fail without OCDS, but should return something)
echo "Test 2: Ingest endpoint..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/admin/ingest")
echo "Ingest returned: $RESPONSE"

# Test 3: Import sample tender
echo "Test 3: Import sample tender..."
curl -s -X POST "$BASE_URL/admin/import" \
  -H "Content-Type: application/json" \
  -d '[{"title":"Test Tender ZM","procuring_entity":"ZPPA","region":"Lusaka","categories":"Building Construction","value_kwacha":500000,"closing_date":"2025-12-31"}]'
echo "✓ Import completed"

# Test 4: Get tenders API
echo "Test 4: Get tenders API..."
TENDERS=$(curl -s "$BASE_URL/api/tenders")
echo "Tenders: $TENDERS"

echo ""
echo "Smoke tests completed!"
echo "Note: Full testing requires:"
echo "  - Running worker: npm run dev"
echo "  - GEMINI_API_KEY set for bid pack drafting"
echo "  - TWILIO credentials for WhatsApp sending"
