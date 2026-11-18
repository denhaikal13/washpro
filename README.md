# WashPro - Sistem Manajemen Laundry & Kurir Penjemputan Terintegrasi

Aplikasi web prototipe fungsional (MVP) untuk mengelola operasional laundry kiloan & satuan dengan integrasi antar-jemput kurir, POS kasir, alokasi rak penyimpanan, dan dashboard analitik admin.

---

## 🚀 Fitur Utama & Modul Sistem

### 1. 👤 Modul Pelanggan (Customer Web Portal / PWA)
- **Form Pemesanan Antar-Jemput (Pickup Order):**
  - Input nama, WhatsApp, dan alamat dengan simulasi **Auto-detect GPS**.
  - Pilihan slot waktu penjemputan (Pagi, Siang, Sore, Besok).
  - Pilihan paket layanan (Kiloan Reguler 2 Hari, Express 24 Jam, Kilat 6 Jam, Bedcover, Setrika).
  - Input catatan sensitif pakaian.
- **Pelacakan Status Real-Time (Live Stepper):**
  - Stepper 8 tahap: `Pickup Scheduled` $\rightarrow$ `Picked Up` $\rightarrow$ `Weighing` $\rightarrow$ `Washing / Drying` $\rightarrow$ `Ironing` $\rightarrow$ `Ready for Delivery` (Nomor Rak) $\rightarrow$ `Out for Delivery` $\rightarrow$ `Completed`.
- **Riwayat Transaksi & Nota Digital:**
  - Pratinjau nota digital & cetak thermal.
  - Tombol kirim ringkasan nota ke WhatsApp otomatis.

### 2. 🛵 Modul Kurir (Driver Interface - Mobile First)
- **Daftar Tugas Penjemputan & Pengantaran:** Filter tugas penjemputan baru dan pengantaran laundry selesai.
- **Navigasi Langsung:** Tombol buka Google Maps rute GPS ke alamat pelanggan dengan 1 klik.
- **Konfirmasi Penjemputan:** Ambil foto barang & input taksiran kantong laundry.
- **Bukti Serah Terima Pengantaran (Proof of Delivery):**
  - Kanvas **Tanda Tangan Digital (Digital Signature Pad)** langsung di layar smartphone / layar sentuh.
  - Upload foto serah terima & konfirmasi status pembayaran tunai / COD.

### 3. 🏪 Modul POS Kasir & Workshop Outlet
- **Penerimaan & Penimbangan (Weighing Queue):**
  - Input berat riil timbangan (Kg) dengan presisi desimal.
  - Perhitungan otomatis subtotal harga berdasarkan tarif paket.
- **Manajemen Rak Simpan (Storage Rack System):**
  - Alokasi nomor rak simpan (`Rak A-01`, `Rak B-02`, dll.) untuk pakaian selesai disetrika.
- **Cetak Struk Kasir Thermal (ESC/POS 58mm / 80mm):**
  - Pratinjau struk thermal dengan layout kasir asli (monospace, nomor order, barcode, tanggal, rincian biaya, nomor rak).
  - Terintegrasi dialog cetak browser (`window.print()`) yang terformat khusus untuk printer thermal kasir.

### 4. 📊 Modul Dashboard Admin (Management & Analytics)
- **Ringkasan Metrik Bisnis:** Total omset (Rp), volume pakaian tercuci (Kg), pesanan aktif, kurir siap jalan.
- **Smart Dispatching Kurir:** Pengalihan dan penugasan order ke kurir tertentu.
- **Katalog Layanan & Tarif Outlet:** Daftar harga per kg dan durasi pengerjaan.
- **Laporan Transaksi & Keuangan:** Fitur **Export Laporan ke format CSV** untuk pembukuan Excel.

---

## 🛠️ Cara Menjalankan Aplikasi

Aplikasi ini dibangun menggunakan arsitektur Node.js mandiri tanpa ketergantungan library eksternal yang berat, sehingga dapat dijalankan seketika.

### Menjalankan Server Lokal:
```bash
# Masuk ke direktori proyek
cd C:\Users\user\.gemini\antigravity\scratch\washpro

# Jalankan server
npm start
# atau
node server.js
```

Buka peramban (browser) di alamat:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🗂️ Struktur File Proyek

```
washpro/
├── data.json           # Database JSON lokal (auto-sync transaksi)
├── package.json        # Konfigurasi proyek & script run
├── server.js           # REST API Server & static web server
├── README.md           # Panduan & dokumentasi teknis
└── public/
    └── index.html      # Single Page Application (UI Pelanggan, Kurir, Kasir, Admin)
```

---

## 🌐 Dokumentasi Endpoint REST API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/orders` | Mengambil seluruh daftar pesanan laundry |
| `POST` | `/api/orders` | Membuat pesanan penjemputan baru oleh pelanggan |
| `PATCH` | `/api/orders/:id` | Memperbarui status pesanan, berat aktual, nomor rak, kurir, dan tanda tangan |
| `GET` | `/api/services` | Mengambil daftar katalog layanan & tarif per kg |
| `GET` | `/api/couriers` | Mengambil daftar kurir bertugas |
| `GET` | `/api/racks` | Mengambil daftar nomor rak penyimpanan outlet |
| `GET` | `/api/stats` | Mengambil ringkasan statistik KPI operasional untuk admin |
| `POST` | `/api/reset` | Mereset database simulasi ke seed data awal |

---

## 📌 Rekomendasi Migrasi ke Production Multi-Outlet
Untuk pengembangan ke fase skala penuh (*Production Phase*):
1. Mengintegrasikan **WhatsApp Gateway API** (Fonnte / Wablas) dengan webhook status otomatis.
2. Mengintegrasikan **Payment Gateway Midtrans Snap** untuk auto-generate kode QRIS dinamis & Virtual Account.
3. Migrasi database ke **PostgreSQL / Supabase** dengan ORM Prisma/Drizzle.
4. Menambahkan modul *Multi-Outlet Branching* untuk manajemen lebih dari 1 cabang laundry.
