# Integration & Testing Guide - Step by Step

## 🎯 Objective

Memastikan semua 15 platform terintegrasi dengan baik:
1. Menampilkan data di home page
2. Detail drama bisa dibuka
3. Semua API endpoint bekerja

---

## 📊 Platform Status

| # | Platform | Status | Home Endpoint | Detail Endpoint |
|----|----------|--------|---------------|-----------------|
| 1 | RadReel | ✅ | `/home?lang=id&tab=17` | `/drama/{id}` |
| 2 | FlickReels | ✅ | `/home?lang=6` | `/drama/{id}` |
| 3 | DotDrama | 🔧 | `/home` | `/drama/{id}` |
| 4 | NetShort | 🔧 | `/discover` | `/drama/{id}` |
| 5 | ShortMax | 🔧 | `/home` | `/drama/{id}` |
| 6 | StarShort | 🔧 | `/home` | `/drama/{id}` |
| 7 | StardustTV | 🔧 | `/home` | `/drama/{id}` |
| 8 | DramaDash | 🔧 | `/home` | `/drama/{id}` |
| 9 | DramaWave | 🔧 | `/home` | `/drama/{id}` |
| 10 | DramaBox | 🔧 | `/foryou` | `/drama/{id}` |
| 11 | Viglo | 🔧 | `/home` | `/drama/{id}` |
| 12 | Micro | 🔧 | `/list` | `/drama/{id}` |
| 13 | Melolo | 🔧 | `/home` | `/drama/{id}` |
| 14 | MeloShort | 🔧 | `/home` | `/drama/{id}` |
| 15 | Reelife | 🔧 | `/home` | `/drama/{id}` |

---

## 🚀 Quick Start Testing

### Step 1: Test All Endpoints (5 menit)

```bash
# Masuk ke directory project
cd /workspaces/dramainaja

# Jalankan script testing
bash test-api-complete.sh
```

**Expected Output:**
- Setiap platform menampilkan HTTP 200
- Response JSON yang valid
- Data drama dalam response

### Step 2: Setup Development Environment (10 menit)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

**Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 3: Test di Browser (15 menit)

1. **Home Page Testing:**
   - Open `http://localhost:5173`
   - Click "Browse" button
   - Select RadReel dari platform selector
   - Verify data ditampilkan dengan benar
   - Check browser console untuk error

2. **Platform Switching:**
   - Click platform selector
   - Switch ke FlickReels
   - Verify data updated
   - Repeat untuk semua platform

3. **Drama Detail Testing:**
   - Click satu drama card
   - Verify route change ke `/drama/{id}`
   - Verify detail page tampil
   - Verify all info displayed correctly
   - Click back button
   - Verify navigasi bekerja

---

## 🔍 Detailed Testing Guide

### Test 1: RadReel Platform

**Home:**
```bash
curl -s "https://dramabos.asia/api/radreel/api/v1/home?lang=id&tab=17&page=1&limit=20" | jq '.[] | {compilationsId, title, episodes: .uploadOfEpisodes}'
```

Expected output:
```json
{
  "compilationsId": 3435,
  "title": "Dendam Sang Phoenix",
  "episodes": 41
}
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/radreel/api/v1/drama/3435" | jq '.'
```

**Test Result:** ✅ Should return 200 dengan data detail

---

### Test 2: FlickReels Platform

**Home:**
```bash
curl -s "https://dramabos.asia/api/flick/home?lang=6&page=1&limit=20" | jq '.data[0].list[] | {playlet_id, title, episodes: .upload_num}'
```

**Drama Detail:**
```bash
curl -s "https://dramabos.asia/api/flick/drama/3108" | jq '.data | {playlet_id, title, list: (.list | length)}'
```

**Test Result:** ✅ Should return 200 dengan episodes list

---

### Test 3: Other Platforms (DotDrama - Reelife)

**Template untuk testing:**
```bash
# Replace {PLATFORM}, {ENDPOINT}, {ENDPOINT_DETAIL} dengan nilai yang sesuai

# Test Home
curl -s "https://dramabos.asia/api/{PLATFORM}/api/v1{ENDPOINT}?page=1&limit=20" | jq '.data // .list // . | .[0] | {id, title}'

# Test Detail
curl -s "https://dramabos.asia/api/{PLATFORM}/api/v1{ENDPOINT_DETAIL}/1" | jq '.data // . | {id, title, description}'
```

**Example untuk DotDrama:**
```bash
curl -s "https://dramabos.asia/api/dotdrama/api/v1/home?page=1&limit=20" | jq '.'
curl -s "https://dramabos.asia/api/dotdrama/api/v1/drama/1" | jq '.'
```

---

## 🛠️ Troubleshooting

### Issue 1: 404 - Cannot GET /home

**Penyebab:** Endpoint path tidak lengkap atau salah

**Solution:**
1. Check [src/core/config/platforms.ts](src/core/config/platforms.ts)
2. Verify `baseUrl` mencakup `/api/v1`
3. Verify endpoint path sesuai dengan API docs

**Contoh Fix:**
```typescript
// ❌ BEFORE
baseUrl: 'https://dramabos.asia/api/dotdrama',

// ✅ AFTER
baseUrl: 'https://dramabos.asia/api/dotdrama/api/v1',
```

---

### Issue 2: Data tidak muncul di home page

**Penyebab:** API response format berbeda dengan expected

**Solution:**
1. Test dengan curl terlebih dahulu
2. Check response structure
3. Update normalizer di [src/core/api/platform-api.ts](src/core/api/platform-api.ts)
4. Add custom parser untuk platform jika perlu

**Debug Steps:**
```bash
# 1. Test endpoint
curl -s "https://dramabos.asia/api/{platform}/api/v1{endpoint}" > response.json

# 2. Check structure
jq 'keys' response.json

# 3. Check first item
jq '.[0]' response.json

# 4. Check nested data
jq '.data // .list // .' response.json
```

---

### Issue 3: 500 Server Error

**Penyebab:** API server error atau timeout

**Solution:**
1. Wait beberapa saat dan retry
2. Check server status
3. Try dengan shorter timeout
4. Check CORS headers

```bash
# Test dengan timeout
curl -s --max-time 10 "URL"

# Check headers
curl -i "URL"
```

---

### Issue 4: CORS Error (di browser)

**Penyebab:** Browser blocking request dari different origin

**Solution:** This is expected, API proxy sudah disetup di backend

**Normal response:**
```
Access to XMLHttpRequest blocked by CORS policy
```

Not a problem - backend sudah handle ini.

---

### Issue 5: Drama detail 404

**Penyebab:** Route tidak benar atau DramaDetailPage tidak import dengan benar

**Solution:**
1. Check [src/App.tsx](src/App.tsx) - verify route ada
2. Check [src/pages/DramaDetailPage.tsx](src/pages/DramaDetailPage.tsx) exists
3. Check console untuk error
4. Verify drama ID valid

```bash
# Test drama detail endpoint
curl -s "https://dramabos.asia/api/radreel/api/v1/drama/3435" | jq '.code // .msg'
```

---

## 📋 Testing Checklist

- [ ] Run `bash test-api-complete.sh` - semua platform 200 OK
- [ ] Install dependencies - `npm install` no error
- [ ] Start dev server - `npm run dev` running
- [ ] Home page load - data visible
- [ ] Switch platform - data change correctly
- [ ] Click drama card - navigate to detail page
- [ ] Detail page load - all info displayed
- [ ] Back button work - navigate back correctly
- [ ] Search work - results shown
- [ ] No console errors - clean console

---

## 🎯 Expected Results

### After Testing

✅ All platforms showing data
✅ Can click drama and open detail page
✅ Detail page showing complete information
✅ Back navigation working
✅ Responsive on mobile
✅ No console errors
✅ Loading states working
✅ Error handling working

---

## 📞 Debug Commands

### Check if port 5173 available
```bash
lsof -i :5173
```

### Kill process on port
```bash
kill -9 $(lsof -t -i :5173)
```

### Clear node modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check TypeScript errors
```bash
npm run lint
```

### Test build
```bash
npm run build
```

---

## 🔗 API Reference

### Base URLs
- RadReel: `https://dramabos.asia/api/radreel/api/v1`
- FlickReels: `https://dramabos.asia/api/flick`
- Others: `https://dramabos.asia/api/{platform}/api/v1`

### Common Endpoints
- Home: GET `/home?page=1&limit=20`
- Detail: GET `/drama/{id}`
- Search: GET `/search?q={query}`

### Response Format

**Success:**
```json
{
  "status_code": 1,
  "msg": "success",
  "data": []
}
```

**Error:**
```json
{
  "code": "error-code",
  "msg": "Error message"
}
```

---

## 📈 Performance Tips

1. **Test dengan limit kecil terlebih dahulu**
   ```bash
   curl "...?page=1&limit=5"
   ```

2. **Use jq untuk filter data yang besar**
   ```bash
   curl "URL" | jq '.data[] | {id, title}'
   ```

3. **Monitor response time**
   ```bash
   curl -w "Time: %{time_total}s\n" "URL"
   ```

4. **Test di staging sebelum production**

---

## ✅ Completion Criteria

Project sudah sukses jika:

1. ✅ Semua 15 platform menampilkan data di home
2. ✅ Bisa click drama dan buka detail page
3. ✅ Detail page menampilkan semua informasi
4. ✅ Back navigation bekerja
5. ✅ Responsive design
6. ✅ No console errors
7. ✅ All tests passing

---

## 🎉 Success!

Jika semua checklist sudah completed, berarti project sudah integration-ready! 

Next step: Deploy ke production atau add more features seperti video player, bookmarks, etc.
