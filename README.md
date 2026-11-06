# Sistem Manajemen Operasional & Perhitungan HPP Benang DTY
> **Proyek Rekayasa & Manufaktur Tekstil (Unit Pilot Plant DTY)**  
> Author: **Keisya Febri Sabila** ([@keisyafs](https://github.com/keisyafs))  
> 🌐 **Live Demo Sistem:** [https://keisyafs.github.io/dty-cost-system/](https://keisyafs.github.io/dty-cost-system/)

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

## 👥 Role-Based Access Control (4 Role Pengguna)
* **Operator**: Input log shift harian (jam run, downtime, timbangan POY/DTY/bettes) dan perbaikan data revisi.
* **Supervisor**: Audit trail verifikasi lapangan (menyetujui atau menolak catatan shift dengan catatan revisi).
* **Finance**: Pengaturan parameter biaya acuan (harga POY bulanan, tarif PLN triwulanan, upah & BOP tahunan).
* **Plant Manager**: Pemantauan KPI eksekutif, analisis varians biaya, dan pengelolaan akun pengguna (*user management*).

---

## 🚀 Cara Menjalankan Secara Lokal
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
