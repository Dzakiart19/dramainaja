# API Testing Guide - Drama Inaja

## Quick Start

Untuk testing semua API endpoint sekaligus:

```bash
cd /workspaces/dramainaja
bash test-api-complete.sh
```

---

## Manual Testing dengan Curl

### 1. RADREEL (✅ Sudah Bekerja)

**Home:**
```bash
curl -s "https://dramabos.asia/api/radreel/api/v1/home?lang=id&tab=17&page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/radreel/api/v1/drama/3435" | jq '.'
```

**Search:**
```bash
curl -s "https://dramabos.asia/api/radreel/api/v1/search?lang=id&q=drama&page=1" | jq '.'
```

---

### 2. FLICKREELS (✅ Sudah Bekerja)

**Home:**
```bash
curl -s "https://dramabos.asia/api/flick/home?lang=6&page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/flick/drama/3108" | jq '.'
```

**Search:**
```bash
curl -s "https://dramabos.asia/api/flick/search?lang=6&q=drama&page=1" | jq '.'
```

---

### 3. DOTDRAMA

**Home:**
```bash
curl -s "https://dramabos.asia/api/dotdrama/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/dotdrama/api/v1/drama/1" | jq '.'
```

**Search:**
```bash
curl -s "https://dramabos.asia/api/dotdrama/api/v1/search?q=drama&page=1" | jq '.'
```

---

### 4. NETSHORT

**Discover:**
```bash
curl -s "https://dramabos.asia/api/netshort/api/v1/discover?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/netshort/api/v1/drama/1" | jq '.'
```

**Search:**
```bash
curl -s "https://dramabos.asia/api/netshort/api/v1/search?q=drama&page=1" | jq '.'
```

---

### 5. SHORTMAX

**Home:**
```bash
curl -s "https://dramabos.asia/api/shortmax/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/shortmax/api/v1/drama/1" | jq '.'
```

---

### 6. STARSHORT

**Home:**
```bash
curl -s "https://dramabos.asia/api/starshort/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/starshort/api/v1/drama/1" | jq '.'
```

---

### 7. STARDUSTTV

**Home:**
```bash
curl -s "https://dramabos.asia/api/stardusttv/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/stardusttv/api/v1/drama/1" | jq '.'
```

---

### 8. DRAMADASH

**Home:**
```bash
curl -s "https://dramabos.asia/api/dramadash/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/dramadash/api/v1/drama/1" | jq '.'
```

---

### 9. DRAMAWAVE

**Home:**
```bash
curl -s "https://dramabos.asia/api/dramawave/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/dramawave/api/v1/drama/1" | jq '.'
```

---

### 10. DRAMABOX

**ForYou:**
```bash
curl -s "https://dramabos.asia/api/dramabox/api/v1/foryou?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/dramabox/api/v1/drama/1" | jq '.'
```

---

### 11. VIGLO

**Home:**
```bash
curl -s "https://dramabos.asia/api/viglo/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/viglo/api/v1/drama/1" | jq '.'
```

---

### 12. MICRO

**List:**
```bash
curl -s "https://dramabos.asia/api/micro/api/v1/list?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/micro/api/v1/drama/1" | jq '.'
```

---

### 13. MELOLO

**Home:**
```bash
curl -s "https://dramabos.asia/api/melolo/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/melolo/api/v1/drama/1" | jq '.'
```

---

### 14. MELOSHORT

**Home:**
```bash
curl -s "https://dramabos.asia/api/meloshort/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/meloshort/api/v1/drama/1" | jq '.'
```

---

### 15. REELIFE

**Home:**
```bash
curl -s "https://dramabos.asia/api/reelife/api/v1/home?page=1&limit=20" | jq '.'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/reelife/api/v1/drama/1" | jq '.'
```

---

## Useful Curl Tips

### Gunakan jq untuk format output
```bash
# Pretty print JSON
curl -s "URL" | jq '.'

# Ambil field spesifik
curl -s "URL" | jq '.data'
curl -s "URL" | jq '.data[0]'

# Filter array
curl -s "URL" | jq '.data[] | {id, title, cover}'
```

### Save response ke file
```bash
curl -s "URL" > response.json
```

### Check HTTP status code
```bash
curl -s -o /dev/null -w "%{http_code}\n" "URL"
```

### Add timeout
```bash
curl -s --max-time 10 "URL"
```

### Show response headers
```bash
curl -i "URL"
```

---

## Installation

Jika belum terinstall:

### Install jq (untuk format JSON)
```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq
```

### Install curl
```bash
# Ubuntu/Debian
sudo apt-get install curl

# macOS
brew install curl
```

---

## API Response Structure

### Successful Response
```json
{
  "status_code": 1,
  "msg": "success",
  "data": [
    {
      "id": "1",
      "title": "Drama Title",
      "cover": "https://...",
      "episodes": 50
    }
  ]
}
```

### Error Response
```json
{
  "code": "error-code",
  "msg": "Error message"
}
```

---

## Testing Checklist

Untuk memastikan semua platform terintegrasi dengan baik:

- [ ] Home endpoint mengembalikan 200 dan data
- [ ] Drama detail endpoint mengembalikan 200 dan data
- [ ] Search endpoint bekerja
- [ ] Semua field (title, cover, episodes, etc.) ada di response
- [ ] Cover image URL valid dan dapat diakses
- [ ] Episodes count adalah angka > 0

---

## Troubleshooting

### 404 - Endpoint not found
- Pastikan URL base dan endpoint path sudah benar
- Cek di [src/core/config/platforms.ts](src/core/config/platforms.ts)

### Timeout
- Increase timeout: `curl --max-time 30 "URL"`
- Server mungkin overloaded

### Invalid JSON
- Check response: `curl "URL"` tanpa jq dulu
- Mungkin mengembalikan HTML error page

### CORS Error (di browser)
- Normal untuk development, API proxy sudah disetup di backend

---

## Next Steps

1. Jalankan `bash test-api-complete.sh` untuk test semua endpoint
2. Fix platform yang belum bekerja
3. Test di aplikasi dengan switch antar platform
4. Klik drama untuk membuka halaman detail
5. Verifikasi semua data ditampilkan dengan benar

