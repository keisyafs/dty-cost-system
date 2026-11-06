# Sistem Manajemen Operasional & Perhitungan HPP Benang DTY
> **Proyek Rekayasa & Manufaktur Tekstil (Unit Pilot Plant DTY)**  
> Author: **Keisya Febri Sabila** ([@keisyafs](https://github.com/keisyafs))  
> 🌐 **Live Demo Website:** [https://keisyafs.github.io/dty-cost-system/](https://keisyafs.github.io/dty-cost-system/)  
> 📁 **Repositori GitHub:** [https://github.com/keisyafs/dty-cost-system](https://github.com/keisyafs/dty-cost-system)

---

## 📦 Kelengkapan Berkas Pengumpulan UAS
Sesuai instruksi ketentuan pengumpulan, repositori ini memuat:
1. ✅ **Folder Project Web:** Seluruh source code aplikasi web interaktif berbasis React, Vite, dan Tailwind CSS.
2. ✅ **File Database Format `.sql`:** [`database.sql`](./database.sql) (Struktur tabel MySQL InnoDB dan data relasional inisial).
3. ✅ **Notes Pedoman Pemakaian & Akun:** [`NOTES.txt`](./NOTES.txt) dan [`PEDOMAN_PEMAKAIAN.md`](./PEDOMAN_PEMAKAIAN.md) (Memuat daftar user, password, wewenang, dan alur pengujian).

---

## 👥 Daftar Akun Pengguna (User & Password)
Sistem menerapkan **Role-Based Access Control (RBAC)** dengan 4 peran kerja:

| No | Peran (Role) | Nama Pengguna | Username | Password | Wewenang & Hak Akses |
|:--:|:---|:---|:---:|:---:|:---|
| 1 | **Operator** | Rian Hidayat | `operator1` | `operator123` | Input shift operasional, perbaikan catatan revisi |
| 2 | **Operator** | Dedi Kurniawan | `operator2` | `operator123` | Input shift operasional alternatif |
| 3 | **Supervisor** | M. Faisal | `supervisor` | `spv123` | Verifikasi shift (Setujui / Tolak + catatan revisi) |
| 4 | **Finance** | Siti Rahmawati, S.E. | `finance` | `finance123` | Atur harga POY, tarif PLN, BOP, kunci finalisasi HPP |
| 5 | **Plant Manager** | Ir. Hendra Wijaya | `manager` | `manager123` | Akses penuh (100%), Dashboard KPI, kelola akun pengguna |

*(Pada website live demo, akun dapat diganti secara instan melalui Role Switcher di bar bagian atas).*

---

## 📌 Ringkasan Sistem
Sistem informasi manufaktur tekstil terintegrasi untuk mengonversi data operasional lantai produksi (*shop floor*) benang filamen sintetis **Drawn Textured Yarn (DTY)** menjadi **Harga Pokok Produksi (HPP) per kilogram** berbasis standar industri nyata (mengacu pada model operasional PT Indorama Synthetics Tbk).

Sistem ini menerapkan metode **Job-Order Batch Costing**, di mana 1 siklus batch (target 5.000 kg benang DTY) diselesaikan dalam **3 Shift Operasional (24 Jam Non-Stop)** pada mesin texturing 216 spindel.

---

## ⚙️ 4 Pilar Komponen Biaya (HPP)
1. **Pilar 1: BBBL (Biaya Bahan Baku Langsung)**
   * Bahan baku benang POY (*Partially Oriented Yarn*).
   * Bahan pembantu pelumas *Coning Oil* (standar *Oil Pick-Up* 1,8%).
   * Faktor pengurang: penjualan limbah kusut/putus (*scrap waste bettes credit*).
2. **Pilar 2: BTKL (Biaya Tenaga Kerja Langsung)**
   * Upah operasional langsung per jam kerja efektif operator (*man-hours*).
3. **Pilar 3: BLM (Biaya Langsung Mesin & Energi)**
   * Pemakaian listrik riil heater (58 kW) & motor (28,5 kW) dengan *Load Factor* 0,70.
   * Tarif PLN Industri Golongan I-3/TM (LWBP Rp 1.180/kWh, WBP Rp 1.720/kWh, Rata-rata Rp 1.250/kWh).
   * Biaya keausan suku cadang langsung (*friction disc* karet/keramik).
4. **Pilar 4: BOP (Biaya Overhead Pabrik / Biaya Tidak Langsung)**
   * Depresiasi mesin DTY metode garis lurus 10 tahun (*Machine Hour Rate* Rp 30.000/jam).
   * Utilitas fasilitas penunjang (chiller pendingin ruangan DTY & kompresor udara).
   * Pemeliharaan preventif mesin (*preventive maintenance*).

---

## 🗄️ Cara Import Database (`database.sql`)
1. Buka **phpMyAdmin** melalui browser (`http://localhost/phpmyadmin/`).
2. Buat database baru bernama: `dty_cost_system`.
3. Pilih tab **Import**, pilih file [`database.sql`](./database.sql), lalu klik tombol **Go / Kirim**.

---

## 🚀 Cara Menjalankan Project Secara Lokal
```bash
# Clone repositori
git clone https://github.com/keisyafs/dty-cost-system.git

# Masuk ke direktori
cd dty-cost-system

# Install dependencies
npm install

# Jalankan server development
npm run dev
```
Buka browser pada alamat `http://localhost:5173/`.
