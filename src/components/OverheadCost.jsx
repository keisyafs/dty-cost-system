import React from 'react';
import { Layers, Wind, Wrench, Clock, Calculator, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { calculateBatchHPP, formatRupiah, formatNumber } from '../utils/calculator';

export default function OverheadCost({ masterCost, setMasterCost, batches, currentRole }) {
  const activeBatch = batches[0];
  const calc = calculateBatchHPP(activeBatch, masterCost);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-base font-bold text-slate-900">
              Alokasi Biaya Tidak Langsung & Overhead Pabrik (BOP)
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-purple-50 text-purple-800 font-semibold px-2.5 py-1 rounded-full border border-purple-200">
              Masa Berlaku: Anggaran Tahunan (Tahun Fiskal 2026)
            </span>
            <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200">
              Metode: Machine Hour Rate (Tarif per Jam Mesin)
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Tarif overhead ditentukan di muka <em>(Predetermined Overhead Rate)</em> untuk kurun waktu <strong>1 Tahun Anggaran</strong> dan dibebankan ke setiap batch berdasarkan total akumulasi jam operasi mesin.
        </p>
      </div>

      {/* 2. Three Main Overhead Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Depresiasi Mesin */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              Depresiasi Mesin DTY
            </span>
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
              Sub-BOP 4.1
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Harga Beli Mesin:</span>
              <span className="font-bold text-slate-800">{formatRupiah(masterCost.machineAssetValue)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nilai Residu (Sisa):</span>
              <span className="font-bold text-slate-800">{formatRupiah(masterCost.machineSalvageValue)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Masa Manfaat:</span>
              <span className="font-bold text-slate-800">{masterCost.economicLifeYears} Thn ({masterCost.operatingHoursPerYear} Jam/Thn)</span>
            </div>
            <div className="flex justify-between items-center py-2.5 bg-blue-50/70 px-3 rounded-xl font-bold text-blue-900 border border-blue-100 mt-2">
              <span>Tarif Depresiasi:</span>
              <span className="text-sm font-extrabold">{formatRupiah(masterCost.depreciationRatePerHour)} / jam</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            *Metode Garis Lurus: (Nilai Aset &minus; Residu) &divide; Total Jam Kerja 10 Tahun (72.000 Jam).
          </p>
        </div>

        {/* Card 2: Listrik Fasilitas Penunjang */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Wind className="w-4 h-4 text-sky-600" />
              Utilitas AC & Kompresor
            </span>
            <span className="text-[11px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-semibold border border-sky-100">
              Sub-BOP 4.2
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">AC Chiller Ruang DTY:</span>
              <span className="font-bold text-slate-800">22°C - 24°C (RH 65%)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Kompresor Nozzle SIM:</span>
              <span className="font-bold text-slate-800">2.5 - 3.5 Bar Tekanan</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Daya Fasilitas Penunjang:</span>
              <span className="font-bold text-slate-800">&plusmn; 36 kWh / Jam</span>
            </div>
            <div className="flex justify-between items-center py-2.5 bg-sky-50/70 px-3 rounded-xl font-bold text-sky-900 border border-sky-100 mt-2">
              <span>Tarif Utilitas Ruang:</span>
              <span className="text-sm font-extrabold">{formatRupiah(masterCost.supportUtilityPerHour)} / jam</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            *Penting untuk menjaga stabilitas kelembapan benang dan ikatan simpul interlace nozzle.
          </p>
        </div>

        {/* Card 3: Perawatan & Suku Cadang */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Wrench className="w-4 h-4 text-emerald-600" />
              Preventive Maintenance
            </span>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-100">
              Sub-BOP 4.3
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Pelumasan Bearing Spindel:</span>
              <span className="font-bold text-slate-800">Grease Sintetis Kecepatan Tinggi</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Pembersihan Pelat Heater:</span>
              <span className="font-bold text-slate-800">Chemical Flush Berkala</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Pisau Pemotong Benang:</span>
              <span className="font-bold text-slate-800">Penggantian Berkala</span>
            </div>
            <div className="flex justify-between items-center py-2.5 bg-emerald-50/70 px-3 rounded-xl font-bold text-emerald-900 border border-emerald-100 mt-2">
              <span>Tarif Pemeliharaan:</span>
              <span className="text-sm font-extrabold">{formatRupiah(masterCost.maintenanceRatePerHour)} / jam</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            *Mencegah terjadinya downtime mendadak yang merugikan produktivitas batch.
          </p>
        </div>
      </div>

      {/* 3. Detailed Allocation Table on Active Lot */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pembebanan Overhead pada Lot Aktif: {activeBatch.id}
            </h3>
            <p className="text-xs text-slate-500">
              Durasi Batch: <strong>3 Shift (1 Siklus 24 Jam Penuh)</strong> &bull; Total Jam Jalan Mesin: <strong>{formatNumber(calc?.physical.totalRunHours, 1)} Jam</strong> &bull; Output DTY: <strong>{formatNumber(calc?.physical.totalDtyKg, 0)} kg</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block font-medium">Total Beban BOP Batch:</span>
            <span className="text-xl font-black text-blue-900">
              {formatRupiah(calc?.costs.totalBop)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Elemen Biaya Overhead (BOP)</th>
                <th className="py-3 px-4 text-right">Tarif Dasar / Jam Mesin</th>
                <th className="py-3 px-4 text-center">Durasi Batch</th>
                <th className="py-3 px-4 text-right">Total Dibebankan ke Batch</th>
                <th className="py-3 px-4 text-right">Alokasi per Kg Benang DTY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900">4.1 Depresiasi Mesin Draw-Texturing</td>
                <td className="py-3 px-4 text-right text-slate-700">{formatRupiah(masterCost.depreciationRatePerHour)}</td>
                <td className="py-3 px-4 text-center font-bold text-slate-800">{formatNumber(calc?.physical.totalRunHours, 1)} Jam</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.machineDepreciationCost)}</td>
                <td className="py-3 px-4 text-right text-slate-600 font-medium">
                  {formatRupiah(calc?.physical.totalDtyKg ? calc.costs.machineDepreciationCost / calc.physical.totalDtyKg : 0)} / kg
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900">4.2 Listrik Fasilitas Utilitas (Chiller AC & Kompresor)</td>
                <td className="py-3 px-4 text-right text-slate-700">{formatRupiah(masterCost.supportUtilityPerHour)}</td>
                <td className="py-3 px-4 text-center font-bold text-slate-800">{formatNumber(calc?.physical.totalRunHours, 1)} Jam</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.plantUtilityCost)}</td>
                <td className="py-3 px-4 text-right text-slate-600 font-medium">
                  {formatRupiah(calc?.physical.totalDtyKg ? calc.costs.plantUtilityCost / calc.physical.totalDtyKg : 0)} / kg
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900">4.3 Preventive Maintenance & Servis Berkala</td>
                <td className="py-3 px-4 text-right text-slate-700">{formatRupiah(masterCost.maintenanceRatePerHour)}</td>
                <td className="py-3 px-4 text-center font-bold text-slate-800">{formatNumber(calc?.physical.totalRunHours, 1)} Jam</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.maintenanceCost)}</td>
                <td className="py-3 px-4 text-right text-slate-600 font-medium">
                  {formatRupiah(calc?.physical.totalDtyKg ? calc.costs.maintenanceCost / calc.physical.totalDtyKg : 0)} / kg
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-blue-50/60 font-bold border-t border-blue-200">
                <td className="py-3 px-4 text-blue-900 uppercase">Total Biaya Overhead Pabrik (BOP)</td>
                <td className="py-3 px-4 text-right text-blue-900">
                  {formatRupiah(masterCost.depreciationRatePerHour + masterCost.supportUtilityPerHour + masterCost.maintenanceRatePerHour)} / jam
                </td>
                <td className="py-3 px-4 text-center text-slate-900">{formatNumber(calc?.physical.totalRunHours, 1)} Jam</td>
                <td className="py-3 px-4 text-right text-blue-900 text-sm font-black">{formatRupiah(calc?.costs.totalBop)}</td>
                <td className="py-3 px-4 text-right text-blue-900 text-sm font-black">
                  {formatRupiah(calc?.physical.totalDtyKg ? calc.costs.totalBop / calc.physical.totalDtyKg : 0)} / kg
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
