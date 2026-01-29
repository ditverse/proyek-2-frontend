# Frontend Sistem Peminjaman Sarana Prasarana

Repository ini berisi kode sumber antarmuka pengguna (Frontend) untuk Sistem Informasi Peminjaman Sarana dan Prasarana Kampus. Aplikasi ini dibangun menggunakan HTML5, JavaScript (Native/Vanilla), dan CSS Framework (Tailwind CSS via CDN).

## 📋 Daftar Isi
- [Struktur Halaman](#struktur-halaman)
- [Teknologi](#teknologi)
- [Konfigurasi](#konfigurasi)
- [Panduan Pengembangan](#panduan-pengembangan)
- [Deployment](#deployment)

---

## Struktur Halaman

Aplikasi terdiri dari beberapa halaman utama yang dikelompokkan berdasarkan fungsi dan role pengguna.

### 🔐 Autentikasi
- **`index.html`**: Halaman Login utama. Role pengguna dideteksi otomatis setelah login.
- **`register.html`**: Pendaftaran akun baru (Biasanya diakses oleh Admin/Sarpras).

### 🎓 Mahasiswa
- **`dashboard-mahasiswa.html`**: Halaman utama mahasiswa. Menampilkan jadwal hari ini.
- **`jadwal-ruangan.html`**: Kalender ketersediaan ruangan.
- **`pengajuan-peminjaman.html`**: Form untuk mengajukan peminjaman baru.
- **`riwayat-peminjaman.html`**: Daftar status pengajuan (Pending, Approved, Rejected).
- **`detail-laporan-peminjaman.html`**: Detail lengkap dari satu item peminjaman.

### 🛠 Staff Sarpras
- **`sarpras.html`**: Dashboard utama Sarpras. Ringkasan pengajuan waiting list.
- **`verifikasi-peminjaman.html`**: Daftar pengajuan yang perlu diverifikasi (Approve/Reject).
- **`kelola-ruangan.html`**: CRUD Data Ruangan.
- **`kelola-barang.html`**: CRUD Data Barang.
- **`laporan-peminjaman.html`**: Rekapitulasi data peminjaman.

### 🛡️ Security
- **`dashboard-security.html`**: Dashboard operasional security.
- **`riwayat-kehadiran.html`**: Log kehadiran peminjam yang sudah diverifikasi.

### 👤 Guest / Umum
- **`dashboard-guest.html`**: Halaman publik untuk melihat jadwal ruangan tanpa login.

---

## Teknologi

- **Core**: HTML5, Vanilla JavaScript (ES6+)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (menggunakan CDN script, tidak perlu build process).
- **Icons**: FontAwesome / SVG.
- **HTTP Client**: `fetch` API native browser.
- **Alerts**: [SweetAlert2](https://sweetalert2.github.io/) untuk popup notifikasi yang cantik.

---

## Konfigurasi

Sebelum menjalankan aplikasi, pastikan konfigurasi API Backend sudah sesuai.

1. Buka file `assets/js/config.js` (jika ada) atau periksa bagian `<script>` global.
2. Pastikan `API_BASE_URL` mengarah ke backend yang berjalan.
   - Development: `http://localhost:8000/api`
   - Production: `https://api.yourdomain.com/api`

### Setup Localhost (Live Server)
Disarankan menggunakan ekstensi **Live Server** di VS Code untuk menghindari masalah CORS pada file lokal.
1. Install ekstensi "Live Server".
2. Klik kanan pada `index.html` -> "Open with Live Server".
3. Aplikasi akan berjalan di `http://127.0.0.1:5500`.

---

## Panduan Pengembangan

### Menambah Halaman Baru
1. Copy template dari salah satu file dashboard (misal `dashboard-mahasiswa.html`) untuk mempertahankan struktur Sidebar dan Navbar.
2. Sesuaikan konten di dalam tag `<main>`.
3. Tambahkan logika JavaScript di bagian bawah body atau di file terpisah dalam `assets/js/`.

### Struktur Script
Hampir setiap halaman memiliki struktur script standar:
1. **Auth Check**: Memeriksa token di `localStorage`. Jika tidak ada, redirect ke login.
2. **Role Check**: Memastikan user memiliki hak akses ke halaman tersebut.
3. **Load Data**: Mengambil data dari API saat halaman dimuat (`DOMContentLoaded`).
4. **Event Listeners**: Menangani klik tombol (Submit, Approve, dll).

---

## Deployment

Aplikasi ini bersifat **Static Site**, sehingga dapat di-deploy dengan sangat mudah di:
- **GitHub Pages** (Rekomendasi)
- **Netlify**
- **Vercel**
- **Apache/Nginx Web Server**

### Cara Deploy ke GitHub Pages
1. Push kode ke repository GitHub.
2. Masuk ke **Settings** > **Pages**.
3. Pilih source branch (misal `main`) dan folder root (`/`).
4. Website akan aktif dalam beberapa menit.

> **PENTING**: Karena ini adalah Frontend terpisah, pastikan Backend Anda mengizinkan CORS dari domain frontend Anda.
