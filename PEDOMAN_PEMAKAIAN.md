# 📖 PEDOMAN PEMAKAIAN APLIKASI & CATATAN AKUN (PROJECT UAS)

> **Mata Kuliah:** Rekayasa & Manufaktur Tekstil / Sistem Informasi Industri  
> **Topik:** Sistem Manajemen Operasional & Perhitungan HPP Benang DTY (Drawn Textured Yarn)  
> **Unit Acuan:** Pilot Plant DTY PT Indorama Synthetics Tbk  
> **Author:** Keisya Febri Sabila ([@keisyafs](https://github.com/keisyafs))  
> 🌐 **Live Demo Website:** [https://keisyafs.github.io/dty-cost-system/](https://keisyafs.github.io/dty-cost-system/)

---

## 1. 👥 Daftar Akun Pengguna (Username & Password)

Sistem menerapkan **Role-Based Access Control (RBAC)** dengan 4 peran kerja berbeda sesuai SOP pabrik tekstil:

| No | Peran (Role) | Nama Pengguna | Username | Password | Wewenang & Hak Akses |
|:--:|:---|:---|:---:|:---:|:---|
| **1** | **Operator** | Rian Hidayat | `operator1` | `operator123` | • Input catatan shift harian (jam run, downtime, kg POY/DTY/bettes)<br/>• Memperbaiki data shift yang ditolak supervisor |
| **2** | **Operator** | Dedi Kurniawan | `operator2` | `operator123` | • Input catatan shift harian alternatif |
| **3** | **Supervisor** | M. Faisal | `supervisor` | `spv123` | • Memeriksa dan memvalidasi log shift operator<br/>• Menyetujui shift (`✓ Setujui`)<br/>• Menolak shift (`✕ Tolak` + wajib isi catatan revisi) |
| **4** | **Finance** | Siti Rahmawati, S.E. | `finance` | `finance123` | • Konfigurasi harga POY, coning oil, tarif listrik PLN (LWBP/WBP)<br/>• Mengatur alokasi overhead pabrik (BOP) & depresiasi 10 thn<br/>• Mengunci batch (Finalisasi HPP) |
| **5** | **Plant Manager** | Ir. Hendra Wijaya | `manager` | `manager123` | • **Akses Penuh (100% Fitur)**<br/>• Monitoring KPI eksekutif (Yield, Waste, SEC kWh/kg)<br/>• Analisis varians biaya vs target<br/>• Mengelola & menambah akun pengguna baru |

> 💡 **Cara Ganti Akun di Web Demo:**  
> Pada aplikasi live, Anda dapat berpindah akun secara instan dengan mengklik tombol role di **Top Bar (bagian atas layar)** atau melalui menu dropdown akun.

---

## 2. 🗄️ Panduan Import Database (`database.sql`)

Repositori ini menyertakan file database relasional [database.sql](file:///C:/Users/keisy/.gemini/antigravity/scratch/dty-cost-system/database.sql) yang siap di-import ke MySQL / MariaDB (melalui phpMyAdmin / XAMPP):

1. Nyalakan service **Apache** dan **MySQL** di control panel XAMPP / Laragon.
2. Buka browser dan akses **`http://localhost/phpmyadmin/`**.
3. Buat database baru bernama: **`dty_cost_system`**.
4. Klik tab **Import** pada menu navigasi atas.
5. Klik **Choose File** dan pilih file **`database.sql`**.
6. Klik tombol **Go / Kirim** di bagian bawah.
7. Seluruh 5 tabel utama (`users`, `master_cost_parameters`, `production_batches`, `shift_logs`, `batch_hpp_recap`) beserta data inisial realistis akan langsung terbentuk.

---

## 3. 💻 Panduan Menjalankan Project Secara Lokal

Jika ingin menjalankan aplikasi langsung dari komputer lokal:

```bash
# 1. Clone repositori dari GitHub
git clone https://github.com/keisyafs/dty-cost-system.git

# 2. Masuk ke direktori proyek
cd dty-cost-system

# 3. Install seluruh pustaka yang dibutuhkan
npm install

# 4. Jalankan server lokal Vite
npm run dev
```

Buka browser Anda dan akses alamat: **`http://localhost:5173/`**.

---

## 4. 🔄 Alur Skenario Pengujian / Demonstrasi Sistem

Urutan pengujian yang paling logis untuk mempresentasikan sistem ini:

1. **Langkah 1 (Finance):**  
   Pilih role **Finance**. Buka menu *Master Parameter Biaya* untuk meninjau harga POY, tarif PLN industri jam murah/puncak, dan menu *Overhead & Depresiasi* untuk mengecek tarif depresiasi garis lurus mesin DTY 10 tahun (Rp 30.000/jam).
2. **Langkah 2 (Operator):**  
   Ganti ke role **Operator**. Buka menu *Log Shift Operasional*, lalu klik `+ Catat Log Shift Baru`. Masukkan angka timbangan dan klik simpan. Status awal shift otomatis menjadi `PENDING`.
3. **Langkah 3 (Supervisor):**  
   Ganti ke role **Supervisor**. Buka menu *Log Shift Operasional*, coba klik tombol merah `✕ Tolak` dan isi alasan (contoh: *"Timbangan belum potong tara bobbin"*). Lalu ganti ke Operator untuk klik `✏️ Perbaiki Data` dan kirim ulang. Kembali ke Supervisor dan klik tombol hijau `✓ Setujui`.
4. **Langkah 4 (Plant Manager / Finance):**  
   Ganti ke role **Plant Manager**. Buka menu *Kalkulasi HPP Batch* untuk melihat laporan resmi perhitungan 4 pilar biaya (BBBL, BTKL, BLM, BOP). Anda dapat mengklik tombol `Cetak / Ekspor PDF Laporan` untuk mencetak lembar HPP resmi.
5. **Langkah 5 (Kelola User):**  
   Masih di role **Plant Manager**, klik tombol `Kelola User` di pojok kanan atas untuk melihat form penambahan akun karyawan baru.
