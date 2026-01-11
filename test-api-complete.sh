#!/bin/bash

# Script untuk testing API endpoint semua platform
# Jalankan dengan: bash test-api-complete.sh

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          DRAMA INAJA - Complete API Testing Script              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function untuk test endpoint
test_endpoint() {
    local name=$1
    local endpoint=$2
    local method=$3
    
    echo -e "${BLUE}Testing ${name}...${NC}"
    echo "📍 Endpoint: $endpoint"
    
    if [ -z "$method" ]; then
        method="GET"
    fi
    
    response=$(curl -s -w "\n%{http_code}" "$endpoint")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ Status: $http_code (Success)${NC}"
        echo "📊 Response (first 200 chars):"
        echo "$body" | head -c 200
        echo -e "\n"
    else
        echo -e "${RED}❌ Status: $http_code (Error)${NC}"
        echo "📋 Response:"
        echo "$body" | head -c 200
        echo -e "\n"
    fi
}

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 PLATFORM TESTING - HOME ENDPOINTS                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# RADREEL
test_endpoint "RADREEL HOME" \
    "https://dramabos.asia/api/radreel/api/v1/home?lang=id&tab=17&page=1&limit=20"

# FLICKREELS
test_endpoint "FLICKREELS HOME" \
    "https://dramabos.asia/api/flick/home?lang=6&page=1&limit=20"

# DOTDRAMA
test_endpoint "DOTDRAMA HOME" \
    "https://dramabos.asia/api/dotdrama/api/v1/home?page=1&limit=20"

# NETSHORT
test_endpoint "NETSHORT DISCOVER" \
    "https://dramabos.asia/api/netshort/api/v1/discover?page=1&limit=20"

# SHORTMAX
test_endpoint "SHORTMAX HOME" \
    "https://dramabos.asia/api/shortmax/api/v1/home?page=1&limit=20"

# STARSHORT
test_endpoint "STARSHORT HOME" \
    "https://dramabos.asia/api/starshort/api/v1/home?page=1&limit=20"

# STARDUSTTV
test_endpoint "STARDUSTTV HOME" \
    "https://dramabos.asia/api/stardusttv/api/v1/home?page=1&limit=20"

# DRAMADASH
test_endpoint "DRAMADASH HOME" \
    "https://dramabos.asia/api/dramadash/api/v1/home?page=1&limit=20"

# DRAMAWAVE
test_endpoint "DRAMAWAVE HOME" \
    "https://dramabos.asia/api/dramawave/api/v1/home?page=1&limit=20"

# DRAMABOX
test_endpoint "DRAMABOX FORYOU" \
    "https://dramabos.asia/api/dramabox/api/v1/foryou?page=1&limit=20"

# VIGLO
test_endpoint "VIGLO HOME" \
    "https://dramabos.asia/api/viglo/api/v1/home?page=1&limit=20"

# MICRO
test_endpoint "MICRO LIST" \
    "https://dramabos.asia/api/micro/api/v1/list?page=1&limit=20"

# MELOLO
test_endpoint "MELOLO HOME" \
    "https://dramabos.asia/api/melolo/api/v1/home?page=1&limit=20"

# MELOSHORT
test_endpoint "MELOSHORT HOME" \
    "https://dramabos.asia/api/meloshort/api/v1/home?page=1&limit=20"

# REELIFE
test_endpoint "REELIFE HOME" \
    "https://dramabos.asia/api/reelife/api/v1/home?page=1&limit=20"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 DRAMA DETAIL TESTING                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Test RADREEL drama detail dengan ID yang ada dari hasil home
echo -e "${YELLOW}Note: Drama detail testing menggunakan sample ID${NC}"
echo ""

test_endpoint "RADREEL DRAMA DETAIL" \
    "https://dramabos.asia/api/radreel/api/v1/drama/3435"

test_endpoint "FLICKREELS DRAMA DETAIL" \
    "https://dramabos.asia/api/flick/drama/3108"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    TEST COMPLETE                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Testing selesai. Cek hasil di atas untuk melihat status setiap endpoint.${NC}"
echo ""
echo "💡 Tips:"
echo "   - Jika status 200, endpoint berfungsi dengan baik"
echo "   - Jika status 404 atau error lain, ada masalah dengan endpoint"
echo "   - Untuk testing lebih detail, gunakan curl dengan jq"
echo ""
