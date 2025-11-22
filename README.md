# frontend-sarpras

Static frontend for Sistem Peminjaman Sarpras — HTML + Tailwind (CDN) + native JavaScript.

This folder is intended to be deployed as a static site (GitHub Pages).

## Struktur singkat

- `index.html` — halaman login
- `sarpras.html`, `mahasiswa.html`, `security.html` — dashboard (contoh)
- `assets/js/config.js` — konfigurasi `API_BASE_URL`
- `assets/js/api.js` — helper fetch + auth
- `assets/js/auth.js` — login handler

## Konfigurasi sebelum deploy

1. Update `assets/js/config.js`:
   - Set `API_BASE_URL` ke URL produksi backend Anda (harus HTTPS), mis. `https://api.sarpras.example.com/api`.
   - Atau atur `window.API_BASE_URL` di halaman HTML sebelum memuat bundle JS.

2. Pastikan backend menerima permintaan dari origin GitHub Pages Anda:
   - Jika site GitHub Pages berada di `https://<username>.github.io` atau `https://<username>.github.io/<repo>`
     set env var `CORS_ALLOWED_ORIGIN=https://<username>.github.io` pada backend.

3. Pastikan backend tersedia via HTTPS (GitHub Pages memakai HTTPS; mixed-content tidak diizinkan).

## Publish ke GitHub Pages (singkat)

1. Inisialisasi git di folder ini (jika belum):

```powershell
Set-Location -Path "d:\Kuliah\Proyek 2\proyek-2-golang\frontend-sarpras"
git init
git checkout -b main
git remote add origin https://github.com/<username>/frontend-sarpras.git
git add .
git commit -m "chore: initial frontend-sarpras"
git push -u origin main
```

2. Di GitHub: buka repo → Settings → Pages → Source: `main` branch, folder `/ (root)` → Save.
   - URL akan menjadi `https://<username>.github.io/frontend-sarpras/` (atau `https://<username>.github.io/` untuk user page)

3. Setelah deploy, buka URL dan uji login / network tab.

## Troubleshooting cepat

- CORS error: periksa header `Access-Control-Allow-Origin` dari backend.
- Mixed content: pastikan backend HTTPS.
- 401 Unauthorized: pastikan token disimpan di `localStorage` dan header `Authorization: Bearer <token>` dikirim.

## Optional: Automate with GitHub Actions

Jika Anda ingin deploy otomatis, tambahkan workflow untuk push ke `gh-pages` atau gunakan Pages from `main`.

Jika Anda ingin, saya bisa membuatkan file GitHub Actions deploy otomatis.
