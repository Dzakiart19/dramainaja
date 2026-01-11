#!/bin/bash

# Script untuk testing API endpoint semua platform

echo "=== Testing API Endpoints ==="
echo ""

# RADREEL
echo "🔴 RADREEL - HOME"
curl -s "https://dramabos.asia/api/radreel/api/v1/home?lang=id&tab=17&page=1&limit=20" | jq '.' | head -50

echo ""
echo "🔴 RADREEL - DRAMA DETAIL (sample ID)"
curl -s "https://dramabos.asia/api/radreel/api/v1/drama/1" | jq '.' | head -50

echo ""
echo "=== FLICKREELS - HOME ==="
curl -s "https://dramabos.asia/api/flick/home?lang=6&page=1&limit=20" | jq '.' | head -50

echo ""
echo "🔵 FLICKREELS - DRAMA DETAIL (sample ID)"
curl -s "https://dramabos.asia/api/flick/drama/1" | jq '.' | head -50

echo ""
echo "=== DOTDRAMA - HOME ==="
curl -s "https://dramabos.asia/api/dotdrama/home?page=1&limit=20" | jq '.' | head -50

echo ""
echo "=== NETSHORT - HOME ==="
curl -s "https://dramabos.asia/api/netshort/discover?page=1&limit=20" | jq '.' | head -50

echo ""
echo "=== SHORTMAX - HOME ==="
curl -s "https://dramabos.asia/api/shortmax/home?page=1&limit=20" | jq '.' | head -50

echo ""
echo "=== STARSHORT - HOME ==="
curl -s "https://dramabos.asia/api/starshort/home?page=1&limit=20" | jq '.' | head -50

echo ""
echo "✅ Testing complete"
