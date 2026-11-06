-- ====================================================================
-- SISTEM MANAJEMEN OPERASIONAL & PERHITUNGAN HPP BENANG DTY
-- (Drawn Textured Yarn - Pilot Plant PT Indorama Synthetics Tbk)
-- Database Name: dty_cost_system
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `dty_cost_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dty_cost_system`;

-- --------------------------------------------------------------------
-- 1. TABEL: users (Manajemen Pengguna & RBAC 4 Role)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` ENUM('operator', 'supervisor', 'finance', 'manager') NOT NULL,
  `role_title` VARCHAR(100) NOT NULL,
  `status` ENUM('AKTIF', 'NONAKTIF') NOT NULL DEFAULT 'AKTIF',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `role`, `role_title`, `status`) VALUES
('usr-1', 'operator1', 'operator123', 'Rian Hidayat', 'rian.h@indorama.com', 'operator', 'Operator Produksi DTY', 'AKTIF'),
('usr-2', 'operator2', 'operator123', 'Dedi Kurniawan', 'dedi.k@indorama.com', 'operator', 'Operator Produksi DTY', 'AKTIF'),
('usr-3', 'supervisor', 'spv123', 'M. Faisal', 'm.faisal@indorama.com', 'supervisor', 'Supervisor Shift Produksi', 'AKTIF'),
('usr-4', 'finance', 'finance123', 'Siti Rahmawati, S.E.', 'siti.r@indorama.com', 'finance', 'Finance & Cost Accounting', 'AKTIF'),
('usr-5', 'manager', 'manager123', 'Ir. Hendra Wijaya', 'hendra.w@indorama.com', 'manager', 'Plant Manager', 'AKTIF');

-- --------------------------------------------------------------------
-- 2. TABEL: master_cost_parameters (Parameter Biaya Acuan Finance)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `master_cost_parameters`;
CREATE TABLE `master_cost_parameters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `period_name` VARCHAR(50) NOT NULL COMMENT 'Contoh: November 2026 (Q4)',
  -- Pilar 1: BBBL
  `poy_price_per_kg` DECIMAL(12,2) NOT NULL DEFAULT 24500.00 COMMENT 'Rp/kg Beli POY 250D',
  `coning_oil_price_per_kg` DECIMAL(12,2) NOT NULL DEFAULT 32000.00 COMMENT 'Rp/kg Minyak Pelumas Coning Oil',
  `oil_pickup_percent` DECIMAL(5,2) NOT NULL DEFAULT 1.80 COMMENT '% Berat DTY OPU Standar',
  `scrap_waste_price_per_kg` DECIMAL(12,2) NOT NULL DEFAULT 7500.00 COMMENT 'Rp/kg Penjualan Limbah Scrap Bettes',
  -- Pilar 3: BLM (Listrik & Keausan)
  `electricity_tariff_lwbp` DECIMAL(10,2) NOT NULL DEFAULT 1180.00 COMMENT 'Tarif PLN Jam Luar Puncak Rp/kWh',
  `electricity_tariff_wbp` DECIMAL(10,2) NOT NULL DEFAULT 1720.00 COMMENT 'Tarif PLN Jam Puncak Rp/kWh',
  `electricity_tariff_avg` DECIMAL(10,2) NOT NULL DEFAULT 1250.00 COMMENT 'Tarif Rata-Rata Tertimbang Rp/kWh',
  `daya_heaters_kw` DECIMAL(6,2) NOT NULL DEFAULT 58.00 COMMENT 'Daya Termal Heater I & II (kW)',
  `daya_motor_kw` DECIMAL(6,2) NOT NULL DEFAULT 28.50 COMMENT 'Daya Motor & Spindel (kW)',
  `load_factor` DECIMAL(4,2) NOT NULL DEFAULT 0.70 COMMENT 'Faktor Beban Teknis Mesin (70%)',
  `wear_disc_cost_per_hour` DECIMAL(10,2) NOT NULL DEFAULT 8500.00 COMMENT 'Tarif Keausan Friction Disc Rp/jam mesin',
  -- Pilar 2: BTKL
  `labor_rate_per_hour` DECIMAL(10,2) NOT NULL DEFAULT 28500.00 COMMENT 'Tarif Upah Operator Langsung Rp/jam-org',
  -- Pilar 4: BOP (Overhead & Depresiasi)
  `machine_asset_value` DECIMAL(15,2) NOT NULL DEFAULT 2400000000.00 COMMENT 'Harga Perolehan Mesin DTY (Rp 2,4 M)',
  `machine_salvage_value` DECIMAL(15,2) NOT NULL DEFAULT 240000000.00 COMMENT 'Nilai Residu Mesin (Rp 240 Juta)',
  `economic_life_years` INT NOT NULL DEFAULT 10 COMMENT 'Masa Manfaat Garis Lurus (10 Tahun)',
  `operating_hours_per_year` INT NOT NULL DEFAULT 7200 COMMENT 'Jam Operasi Efektif per Tahun',
  `depreciation_rate_per_hour` DECIMAL(10,2) NOT NULL DEFAULT 30000.00 COMMENT 'Tarif Depresiasi Mesin Rp/jam mesin',
  `support_utility_per_hour` DECIMAL(10,2) NOT NULL DEFAULT 45000.00 COMMENT 'Listrik AC Chiller Ruang & Kompresor Rp/jam',
  `maintenance_rate_per_hour` DECIMAL(10,2) NOT NULL DEFAULT 18000.00 COMMENT 'Alokasi Servis & Pelumasan Rp/jam',
  `updated_by` VARCHAR(50) DEFAULT 'usr-4',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `master_cost_parameters` (
  `id`, `period_name`, `poy_price_per_kg`, `coning_oil_price_per_kg`, `oil_pickup_percent`, `scrap_waste_price_per_kg`,
  `electricity_tariff_lwbp`, `electricity_tariff_wbp`, `electricity_tariff_avg`, `daya_heaters_kw`, `daya_motor_kw`,
  `load_factor`, `wear_disc_cost_per_hour`, `labor_rate_per_hour`, `machine_asset_value`, `machine_salvage_value`,
  `economic_life_years`, `operating_hours_per_year`, `depreciation_rate_per_hour`, `support_utility_per_hour`,
  `maintenance_rate_per_hour`, `updated_by`
) VALUES (
  1, 'November 2026 (Q4)', 24500.00, 32000.00, 1.80, 7500.00,
  1180.00, 1720.00, 1250.00, 58.00, 28.50,
  0.70, 8500.00, 28500.00, 2400000000.00, 240000000.00,
  10, 7200, 30000.00, 45000.00,
  18000.00, 'usr-4'
);

-- --------------------------------------------------------------------
-- 3. TABEL: production_batches (Lot Produksi DTY - Job Order)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `production_batches`;
CREATE TABLE `production_batches` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY COMMENT 'Contoh: LOT-DTY-150D-01',
  `spec` VARCHAR(150) NOT NULL COMMENT 'Spesifikasi Benang DTY',
  `machine_no` VARCHAR(50) NOT NULL COMMENT 'Nomor Mesin Texturing (216 Spindles)',
  `target_qty_kg` DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
  `target_hpp_per_kg` DECIMAL(10,2) NOT NULL DEFAULT 31500.00,
  `start_date` DATE NOT NULL,
  `end_date` DATE DEFAULT NULL,
  `status` ENUM('DRAFT', 'PROSES', 'SELESAI') NOT NULL DEFAULT 'PROSES',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `production_batches` (`id`, `spec`, `machine_no`, `target_qty_kg`, `target_hpp_per_kg`, `start_date`, `end_date`, `status`) VALUES
('LOT-DTY-150D-01', 'DTY Polyester 150D/48F Semi Dull NIM', 'DTY-M01', 5000.00, 31500.00, '2026-11-01', '2026-11-01', 'SELESAI'),
('LOT-DTY-75D-02', 'DTY Microfiber 75D/72F High Intermingled (HIM)', 'DTY-M02', 3000.00, 36200.00, '2026-11-03', NULL, 'PROSES');

-- --------------------------------------------------------------------
-- 4. TABEL: shift_logs (Pencatatan Shift Harian & Audit Supervisor)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `shift_logs`;
CREATE TABLE `shift_logs` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY COMMENT 'Contoh: SH-01',
  `batch_id` VARCHAR(50) NOT NULL,
  `shift_no` INT NOT NULL COMMENT '1: Pagi (06-14), 2: Siang (14-22), 3: Malam (22-06)',
  `production_date` DATE NOT NULL,
  `operator_id` VARCHAR(36) NOT NULL,
  `operator_count` INT NOT NULL DEFAULT 3,
  `run_hours` DECIMAL(5,2) NOT NULL DEFAULT 7.50,
  `downtime_hours` DECIMAL(5,2) NOT NULL DEFAULT 0.50,
  `downtime_reason` VARCHAR(255) DEFAULT 'Operasi Normal',
  `poy_input_kg` DECIMAL(10,2) NOT NULL,
  `dty_output_kg` DECIMAL(10,2) NOT NULL,
  `waste_bettes_kg` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `supervisor_id` VARCHAR(36) DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `production_batches`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`operator_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `shift_logs` (
  `id`, `batch_id`, `shift_no`, `production_date`, `operator_id`, `operator_count`, `run_hours`,
  `downtime_hours`, `downtime_reason`, `poy_input_kg`, `dty_output_kg`, `waste_bettes_kg`, `status`,
  `supervisor_id`, `rejection_reason`, `approved_at`
) VALUES
-- Batch LOT-DTY-150D-01 (Siklus 24 Jam Penuh / 3 Shift)
('SH-01', 'LOT-DTY-150D-01', 1, '2026-11-01', 'usr-1', 3, 7.50, 0.50, 'Creeling POY lot baru', 1720.00, 1665.00, 14.50, 'APPROVED', 'usr-3', NULL, '2026-11-01 14:15:00'),
('SH-02', 'LOT-DTY-150D-01', 2, '2026-11-01', 'usr-2', 3, 7.80, 0.20, 'Penggantian bobbin doffing', 1740.00, 1685.00, 13.80, 'APPROVED', 'usr-3', NULL, '2026-11-01 22:10:00'),
('SH-03', 'LOT-DTY-150D-01', 3, '2026-11-01', 'usr-1', 3, 7.60, 0.40, 'Pembersihan fly waste & lint suction', 1710.00, 1650.00, 15.20, 'APPROVED', 'usr-3', NULL, '2026-11-02 06:15:00'),

-- Batch LOT-DTY-75D-02 (Proses berjalan)
('SH-04', 'LOT-DTY-75D-02', 1, '2026-11-03', 'usr-1', 3, 7.60, 0.40, 'Setting temperatur heater 210C', 1050.00, 1015.00, 11.50, 'APPROVED', 'usr-3', NULL, '2026-11-03 14:20:00'),
('SH-05', 'LOT-DTY-75D-02', 2, '2026-11-03', 'usr-2', 3, 7.00, 1.00, 'Ganti friction disc seksi 2', 980.00, 945.00, 16.00, 'PENDING', NULL, NULL, NULL);

-- --------------------------------------------------------------------
-- 5. TABEL: batch_hpp_recap (Rekapitulasi Kalkulasi HPP 4 Pilar)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `batch_hpp_recap`;
CREATE TABLE `batch_hpp_recap` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` VARCHAR(50) NOT NULL UNIQUE,
  -- Rekap Fisik
  `total_poy_kg` DECIMAL(12,2) NOT NULL,
  `total_dty_kg` DECIMAL(12,2) NOT NULL,
  `total_waste_kg` DECIMAL(12,2) NOT NULL,
  `total_run_hours` DECIMAL(8,2) NOT NULL,
  `total_operator_man_hours` DECIMAL(8,2) NOT NULL,
  -- Rekap 4 Pilar Biaya (Rp)
  `cost_poy` DECIMAL(15,2) NOT NULL,
  `cost_coning_oil` DECIMAL(15,2) NOT NULL,
  `credit_waste_scrap` DECIMAL(15,2) NOT NULL,
  `net_bbbl` DECIMAL(15,2) NOT NULL COMMENT 'Pilar 1: BBBL Bersih',
  `total_btkl` DECIMAL(15,2) NOT NULL COMMENT 'Pilar 2: BTKL Upah Jam',
  `cost_electricity` DECIMAL(15,2) NOT NULL,
  `cost_friction_disc` DECIMAL(15,2) NOT NULL,
  `total_blm` DECIMAL(15,2) NOT NULL COMMENT 'Pilar 3: BLM Listrik & Suku Cadang',
  `cost_depreciation` DECIMAL(15,2) NOT NULL,
  `cost_utility_support` DECIMAL(15,2) NOT NULL,
  `cost_maintenance` DECIMAL(15,2) NOT NULL,
  `total_bop` DECIMAL(15,2) NOT NULL COMMENT 'Pilar 4: BOP Overhead Pabrik',
  -- Level 0 & Level 3 KPI
  `total_hpp` DECIMAL(15,2) NOT NULL COMMENT 'Total Biaya Batch',
  `hpp_per_kg` DECIMAL(12,2) NOT NULL COMMENT 'HPP Final per Kilogram Benang DTY',
  `yield_percent` DECIMAL(5,2) NOT NULL COMMENT 'Rendemen Bahan (%)',
  `waste_percent` DECIMAL(5,2) NOT NULL COMMENT 'Rasio Limbah (%)',
  `sec_kwh_per_kg` DECIMAL(6,3) NOT NULL COMMENT 'Specific Energy Consumption',
  `calculated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `production_batches`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `batch_hpp_recap` (
  `batch_id`, `total_poy_kg`, `total_dty_kg`, `total_waste_kg`, `total_run_hours`, `total_operator_man_hours`,
  `cost_poy`, `cost_coning_oil`, `credit_waste_scrap`, `net_bbbl`, `total_btkl`,
  `cost_electricity`, `cost_friction_disc`, `total_blm`,
  `cost_depreciation`, `cost_utility_support`, `cost_maintenance`, `total_bop`,
  `total_hpp`, `hpp_per_kg`, `yield_percent`, `waste_percent`, `sec_kwh_per_kg`
) VALUES (
  'LOT-DTY-150D-01', 5170.00, 5000.00, 43.50, 22.90, 68.70,
  126665000.00, 2880000.00, 326250.00, 129218750.00, 1957950.00,
  1733256.00, 194650.00, 1927906.00,
  687000.00, 1030500.00, 412200.00, 2129700.00,
  135234306.00, 27046.86, 96.71, 0.84, 0.277
);

-- ====================================================================
-- SELESAI. File ini dapat di-import langsung di phpMyAdmin / MySQL CLI
-- ====================================================================
