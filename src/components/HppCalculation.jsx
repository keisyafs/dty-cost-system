import React from 'react';
import { Printer, Lock, CheckCircle2, Shield, FileText, ChevronRight, BarChart2, Info, Building2, Check } from 'lucide-react';
import { calculateBatchHPP, formatRupiah, formatNumber } from '../utils/calculator';

export default function HppCalculation({ batches, setBatches, masterCost, selectedBatchId, setSelectedBatchId, currentRole }) {
  const activeBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const calc = calculateBatchHPP(activeBatch, masterCost);

  const canLock = currentRole === 'finance' || currentRole === 'manager';

  const handleToggleLock = () => {
    if (!canLock) return;
    const newStatus = activeBatch.status === 'SELESAI' ? 'PROSES' : 'SELESAI';
    const updated = batches.map(b => (b.id === activeBatch.id ? { ...b, status: newStatus } : b));
    setBatches(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Toolbar (Hidden on print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Pilih Lot Produksi:
          </label>
          <select
            value={selectedBatchId}
            onChange={e => setSelectedBatchId(e.target.value)}
            className="border border-slate-300 rounded-xl bg-blue-50/50 px-3.5 py-2 text-xs font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.id} &bull; {b.spec} [{b.status}]
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          {canLock ? (
            <button
              onClick={handleToggleLock}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm ${
                activeBatch.status === 'SELESAI'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {activeBatch.status === 'SELESAI' ? 'Buka Kunci Lot' : 'Kunci Batch (Finalisasi HPP)'}
            </button>
          ) : (
            <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-slate-400" /> Mode Peninjauan Draft (Hanya Finance yang dapat mengunci final)
            </span>
          )}

          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> Cetak / Ekspor PDF Laporan
          </button>
        </div>
      </div>

      {/* 2. FORMAL COST ACCOUNTING SHEET (PRINTABLE) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm print:shadow-none print:border-none print:p-0">
        {/* Document Header with Logo */}
        <div className="flex flex-wrap justify-between items-start border-b-2 border-slate-200 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="border border-slate-200 p-2 rounded-xl bg-white shadow-sm">
              <img
                src="/indorama.jpg"
                alt="Indorama Logo"
                className="h-11 w-auto object-contain block max-w-[150px]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="font-bold text-[#003F7A] text-lg px-2">INDORAMA</span>';
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                PT INDORAMA SYNTHETICS TBK
              </h1>
              <p className="text-xs text-blue-700 font-semibold">
                Divisi Drawn Textured Yarn (DTY) &bull; Unit Pilot Plant Kampus
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Laporan Resmi Perhitungan Harga Pokok Produksi (Cost of Goods Manufactured Sheet)
              </p>
            </div>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="text-lg font-black text-blue-900">{activeBatch.id}</div>
            <div className="text-slate-500">
              Tgl Cetak: <strong className="text-slate-700">{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
            </div>
            <div>
              <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full uppercase ${
                activeBatch.status === 'SELESAI'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                Status: {activeBatch.status}
              </span>
            </div>
          </div>
        </div>

        {/* Info Box: Penegasan Metodologi Batch & Kurun Waktu Biaya */}
        <div className="my-6 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-blue-950 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Metode Perhitungan: Job-Order Batch Costing (Akumulasi 1 Siklus Batch Produksi)
            </span>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Standar Biaya: November 2026 (Q4)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-slate-700 border-t border-blue-100 text-[11px] leading-relaxed">
            <div>
              <strong className="text-slate-900 block">1. Objek Perhitungan:</strong>
              Dihitung <strong>per Batch (Lot)</strong>, bukan per individu shift. Biaya 3 shift dijumlahkan jadi Total HPP Batch, lalu dibagi total kg DTY untuk menjadi <strong>HPP per Kilogram (Rp/kg)</strong>.
            </div>
            <div>
              <strong className="text-slate-900 block">2. Durasi 1 Batch:</strong>
              Batch target 5.000 kg ini memakan waktu <strong>3 Shift Operasional</strong> (Shift 1, 2, dan 3) = <strong>1 Hari Kerja Penuh (24 Jam Non-Stop)</strong> pada mesin 216 spindel.
            </div>
            <div>
              <strong className="text-slate-900 block">3. Kurun Waktu Tarif Finance:</strong>
              Harga POY berlaku <strong>1 Bulan</strong> (kontrak lot), tarif listrik PLN berlaku <strong>3 Bulan</strong> (triwulanan), sedangkan upah BTKL & depresiasi BOP berlaku <strong>1 Tahun Fiskal</strong>.
            </div>
          </div>
        </div>

        {/* Technical Lot Attributes Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Spesifikasi Benang:</span>
            <span className="font-bold text-slate-900">{activeBatch.spec}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Durasi & Siklus:</span>
            <span className="font-bold text-blue-900">3 Shift (24 Jam / 1 Hari)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Jam Mesin Run / Idle:</span>
            <span className="font-bold text-slate-900">22.9 Jam / 1.1 Jam</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">POY Masuk &rarr; DTY:</span>
            <span className="font-bold text-slate-900">
              {formatNumber(calc?.physical.totalPoyKg, 0)} kg &rarr; {formatNumber(calc?.physical.totalDtyKg, 0)} kg
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Rendemen / Limbah:</span>
            <span className="font-bold text-emerald-700">
              {formatNumber(calc?.kpi.yieldPercent, 2)}% / {formatNumber(calc?.kpi.wastePercent, 2)}%
            </span>
          </div>
        </div>

        {/* 4 Pilar Breakdown Tables */}
        <div className="space-y-5 text-xs">
          {/* PILAR 1: BBBL */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-800 text-xs flex justify-between items-center">
              <span>Biaya Bahan Baku Langsung (BBBL)</span>
              <span className="text-[11px] text-slate-500 font-normal">Rumus: Biaya POY + Minyak Coning Oil &minus; Kredit Limbah</span>
            </div>
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-800">1.1 Bahan Baku POY 250D</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatNumber(calc?.physical.totalPoyKg, 1)} kg</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">&times;</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatRupiah(masterCost.poyPricePerKg)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.poyCost)}</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    1.2 Coning Oil Pelumas Benang ({masterCost.oilPickupPercent}% Pick-up)
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatNumber(calc?.physical.oilNeededKg, 1)} kg</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">&times;</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatRupiah(masterCost.coningOilPricePerKg)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.oilCost)}</td>
                </tr>
                <tr className="bg-amber-50/50 text-amber-900">
                  <td className="py-2.5 px-4 font-medium">
                    1.3 Pengurang: Kredit Limbah Bettes/Tangle (Scrap Sales)
                  </td>
                  <td className="py-2.5 px-4 text-right">{formatNumber(calc?.physical.totalWasteKg, 1)} kg</td>
                  <td className="py-2.5 px-2 text-center text-amber-400">&times;</td>
                  <td className="py-2.5 px-4 text-right">{formatRupiah(masterCost.scrapWastePricePerKg)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-amber-800">- {formatRupiah(calc?.costs.wasteCredit)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="py-2.5 px-4 text-blue-900 uppercase" colSpan="4">Subtotal Biaya Bahan Baku Bersih</td>
                  <td className="py-2.5 px-4 text-right text-blue-900 text-sm font-black">{formatRupiah(calc?.costs.netBbbl)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PILAR 2: BTKL */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-800 text-xs flex justify-between items-center">
              <span>Biaya Tenaga Kerja Langsung (BTKL)</span>
              <span className="text-[11px] text-slate-500 font-normal">Rumus: Total Jam-Orang &times; Tarif Upah per Jam</span>
            </div>
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-800">2.1 Upah Operator Mesin Shift (Akumulasi Shift)</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatNumber(calc?.physical.totalOperatorManHours, 1)} Jam-Orang</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">&times;</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatRupiah(masterCost.laborRatePerHour)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.totalBtkl)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="py-2.5 px-4 text-blue-900 uppercase" colSpan="4">Subtotal Biaya Tenaga Kerja Langsung</td>
                  <td className="py-2.5 px-4 text-right text-blue-900 text-sm font-black">{formatRupiah(calc?.costs.totalBtkl)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PILAR 3: BLM */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-800 text-xs flex justify-between items-center">
              <span>Biaya Langsung Mesin & Energi Listrik (BLM)</span>
              <span className="text-[11px] text-slate-500 font-normal">Rumus: Daya (kW) &times; Jam &times; LF 0.70 &times; Tarif Listrik + Aus Disc</span>
            </div>
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    3.1 Listrik Mesin (Daya {calc?.costs.totalConnectedPowerKw} kW [Heater {masterCost.dayaHeatersKw} kW + Motor {masterCost.dayaMotorKw} kW] &times; Faktor Beban {masterCost.loadFactor})
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatNumber(calc?.costs.machineKwh, 1)} kWh</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">&times;</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatRupiah(masterCost.electricityTariffAvg)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.machineElectricityCost)}</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-800">3.2 Keausan Friction Discs Piringan Friksi</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatNumber(calc?.physical.totalRunHours, 1)} Jam</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">&times;</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatRupiah(masterCost.wearDiscCostPerHour)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.wearDiscCost)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="py-2.5 px-4 text-blue-900 uppercase" colSpan="4">Subtotal Biaya Langsung Mesin & Energi</td>
                  <td className="py-2.5 px-4 text-right text-blue-900 text-sm font-black">{formatRupiah(calc?.costs.totalBlm)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PILAR 4: BOP */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-800 text-xs flex justify-between items-center">
              <span>Biaya Overhead Pabrik (BOP Tidak Langsung)</span>
              <span className="text-[11px] text-slate-500 font-normal">Rumus: Depresiasi Garis Lurus + Listrik Utilitas Ruangan + Maintenance</span>
            </div>
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-800">4.1 Depresiasi Mesin DTY (Garis Lurus 10 Tahun)</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatNumber(calc?.physical.totalRunHours, 1)} Jam</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">&times;</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatRupiah(masterCost.depreciationRatePerHour)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.machineDepreciationCost)}</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-800">4.2 Utilitas Pendukung (AC Chiller & Kompresor Nozzle)</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatNumber(calc?.physical.totalRunHours, 1)} Jam</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">&times;</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatRupiah(masterCost.supportUtilityPerHour)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.plantUtilityCost)}</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-800">4.3 Preventive Maintenance & Pembersihan Heater</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatNumber(calc?.physical.totalRunHours, 1)} Jam</td>
                  <td className="py-2.5 px-2 text-center text-slate-400">&times;</td>
                  <td className="py-2.5 px-4 text-right text-slate-700">{formatRupiah(masterCost.maintenanceRatePerHour)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatRupiah(calc?.costs.maintenanceCost)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="py-2.5 px-4 text-blue-900 uppercase" colSpan="4">Subtotal Biaya Overhead Pabrik</td>
                  <td className="py-2.5 px-4 text-right text-blue-900 text-sm font-black">{formatRupiah(calc?.costs.totalBop)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* LEVEL 0: REKAPITULASI RESMI HPP */}
          <div className="rounded-2xl border-2 border-blue-600 bg-gradient-to-br from-blue-50/80 to-slate-50 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-blue-200 pb-4">
              <div>
                <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider block">
                  Total Biaya Produksi Batch (BBBL + BTKL + BLM + BOP)
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatRupiah(calc?.costs.totalHpp)}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-blue-800 font-bold uppercase tracking-wider block">
                  Harga Pokok Produksi per Kilogram (HPP / kg DTY)
                </span>
                <span className="text-3xl sm:text-4xl font-black text-blue-900">
                  {formatRupiah(calc?.costs.hppPerKg)}
                  <span className="text-base font-semibold text-slate-500"> / kg</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Total Output Benang:</span>
                <span className="font-bold text-slate-900">{formatNumber(calc?.physical.totalDtyKg, 0)} kg</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Target Standar Pabrik:</span>
                <span className="font-bold text-slate-900">{formatRupiah(activeBatch.targetHppPerKg)} / kg</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Selisih Varian Anggaran:</span>
                <span className={`font-bold ${
                  (calc?.kpi.costVariancePerKg || 0) <= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {formatRupiah(calc?.kpi.costVariancePerKg)} / kg
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Intensitas Listrik (SEC):</span>
                <span className="font-bold text-slate-900">{formatNumber(calc?.kpi.secKwhPerKg, 3)} kWh/kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification & Sign-off Block */}
        <div className="grid grid-cols-3 gap-6 pt-12 mt-8 border-t border-slate-200 text-xs text-center">
          <div>
            <div className="text-slate-500 mb-14 text-xs font-medium">Dibuat Oleh (Operator Shift):</div>
            <div className="font-bold text-slate-900 border-t border-slate-400 pt-2 uppercase">Rian Hidayat</div>
            <div className="text-[11px] text-slate-500">Operator Shift Lantai DTY</div>
          </div>
          <div>
            <div className="text-slate-500 mb-14 text-xs font-medium">Diperiksa Oleh (Supervisor):</div>
            <div className="font-bold text-slate-900 border-t border-slate-400 pt-2 uppercase">M. Faisal</div>
            <div className="text-[11px] text-slate-500">Supervisor Produksi DTY</div>
          </div>
          <div>
            <div className="text-slate-500 mb-14 text-xs font-medium">Disetujui Oleh (Cost Accounting):</div>
            <div className="font-bold text-slate-900 border-t border-slate-400 pt-2 uppercase">Siti Rahmawati, S.E.</div>
            <div className="text-[11px] text-slate-500">Kepala Bagian Akuntansi Biaya</div>
          </div>
        </div>
      </div>
    </div>
  );
}
