// Initial realistic DTY Indorama dataset for Textile Manufacturing System

export const INITIAL_MASTER_COST = {
  // Bahan Baku
  poyPricePerKg: 24500, // Rp/kg POY 250 Denier
  coningOilPricePerKg: 32000, // Rp/kg Minyak pelumas DTY
  oilPickupPercent: 1.8, // 1.8% standar pick-up benang DTY
  scrapWastePricePerKg: 7500, // Rp/kg Harga jual limbah bettes/tangle ke recycler

  // Tarif Energi Listrik PLN Industri (Golongan I-3 / TM)
  electricityTariffLwbp: 1180, // Rp/kWh Luar Waktu Beban Puncak
  electricityTariffWbp: 1720, // Rp/kWh Waktu Beban Puncak (18:00 - 22:00)
  electricityTariffAvg: 1250, // Rp/kWh Rata-rata tertimbang

  // Spesifikasi Mesin DTY (misal Oerlikon Barmag FK6-1000 / 216 Spindles)
  spindleCount: 216,
  nominalSpeedMpm: 850, // meter/menit
  dayaHeatersKw: 58.0, // Total daya Heater I & Heater II (kW)
  dayaMotorKw: 28.5, // Total daya motor penarik & spindel (kW)
  loadFactor: 0.70, // Standar duty-cycle teknis industri tekstil (70%)

  // Suku Cadang & Keausan
  frictionDiscSetPrice: 1200000, // Rp harga set disc per seksi (12 spindel)
  frictionDiscLifeHours: 2500, // Jam pakai sebelum aus
  wearDiscCostPerHour: 8500, // Rp/jam kalkulasi keausan friction disc

  // Tenaga Kerja Langsung (BTKL)
  laborRatePerHour: 28500, // Rp/jam operator

  // Overhead Pabrik / Depresiasi
  machineAssetValue: 2400000000, // Rp 2.4 Miliar harga mesin DTY
  machineSalvageValue: 240000000, // Rp 240 Juta nilai sisa
  economicLifeYears: 10,
  operatingHoursPerYear: 7200, // 300 hari x 24 jam
  depreciationRatePerHour: 30000, // Rp/jam ((2.4M - 240M) / (10 x 7200))

  // Fasilitas Penunjang (Listrik AC Chiller & Kompresor Udara)
  supportUtilityPerHour: 45000, // Rp/jam chiller ruang DTY & kompresor intermingle
  maintenanceRatePerHour: 18000, // Rp/jam alokasi servis, grease, pembersih
};

export const INITIAL_BATCHES = [
  {
    id: "LOT-DTY-150D-01",
    spec: "DTY Polyester 150D/48F Semi Dull NIM",
    machineNo: "DTY-M01",
    targetQtyKg: 5000,
    startDate: "2026-11-01",
    status: "SELESAI", // SELESAI | PROSES | DRAFT
    targetHppPerKg: 31500,
    shifts: [
      {
        id: "SH-01",
        shiftNo: 1,
        date: "2026-11-01",
        operatorCount: 3,
        runHours: 7.5,
        downtimeHours: 0.5,
        downtimeReason: "Creeling POY lot baru",
        poyInputKg: 1720,
        dtyOutputKg: 1675,
        wasteBettesKg: 18.5,
        status: "APPROVED",
        supervisor: "M. Faisal"
      },
      {
        id: "SH-02",
        shiftNo: 2,
        date: "2026-11-01",
        operatorCount: 3,
        runHours: 7.8,
        downtimeHours: 0.2,
        downtimeReason: "Pembersihan nozzle jet",
        poyInputKg: 1750,
        dtyOutputKg: 1710,
        wasteBettesKg: 14.2,
        status: "APPROVED",
        supervisor: "Ahmad S."
      },
      {
        id: "SH-03",
        shiftNo: 3,
        date: "2026-11-02",
        operatorCount: 3,
        runHours: 7.2,
        downtimeHours: 0.8,
        downtimeReason: "Putus benang spindle 14-18",
        poyInputKg: 1680,
        dtyOutputKg: 1625,
        wasteBettesKg: 22.0,
        status: "APPROVED",
        supervisor: "Budi Santoso"
      }
    ]
  },
  {
    id: "LOT-DTY-75D-02",
    spec: "DTY Microfiber 75D/72F High Intermingled (HIM)",
    machineNo: "DTY-M02",
    targetQtyKg: 3000,
    startDate: "2026-11-03",
    status: "PROSES",
    targetHppPerKg: 36200,
    shifts: [
      {
        id: "SH-04",
        shiftNo: 1,
        date: "2026-11-03",
        operatorCount: 3,
        runHours: 7.6,
        downtimeHours: 0.4,
        downtimeReason: "Setting temperatur heater 210C",
        poyInputKg: 1050,
        dtyOutputKg: 1015,
        wasteBettesKg: 11.5,
        status: "APPROVED",
        supervisor: "M. Faisal"
      },
      {
        id: "SH-05",
        shiftNo: 2,
        date: "2026-11-03",
        operatorCount: 3,
        runHours: 7.0,
        downtimeHours: 1.0,
        downtimeReason: "Ganti friction disc seksi 2",
        poyInputKg: 980,
        dtyOutputKg: 945,
        wasteBettesKg: 16.0,
        status: "PENDING",
        supervisor: "Ahmad S."
      }
    ]
  }
];

export const USER_ROLES = [
  { id: "operator", name: "Rian Hidayat", roleTitle: "Operator Produksi", badge: "OPERATOR", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "supervisor", name: "M. Faisal", roleTitle: "Supervisor Shift", badge: "SUPERVISOR", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "finance", name: "Siti Rahmawati, S.E.", roleTitle: "Finance & Accounting", badge: "FINANCE", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "manager", name: "Ir. Hendra Wijaya", roleTitle: "Plant Manager", badge: "MANAGER", color: "bg-emerald-100 text-emerald-800 border-emerald-300" }
];

export const INITIAL_USERS = [
  { id: "usr-1", name: "Rian Hidayat", email: "rian.h@indorama.com", role: "operator", status: "AKTIF", roleTitle: "Operator Produksi" },
  { id: "usr-2", name: "Dedi Kurniawan", email: "dedi.k@indorama.com", role: "operator", status: "AKTIF", roleTitle: "Operator Produksi" },
  { id: "usr-3", name: "M. Faisal", email: "m.faisal@indorama.com", role: "supervisor", status: "AKTIF", roleTitle: "Supervisor Shift" },
  { id: "usr-4", name: "Siti Rahmawati, S.E.", email: "siti.r@indorama.com", role: "finance", status: "AKTIF", roleTitle: "Finance & Cost Accounting" },
  { id: "usr-5", name: "Ir. Hendra Wijaya", email: "hendra.w@indorama.com", role: "manager", status: "AKTIF", roleTitle: "Plant Manager" }
];
