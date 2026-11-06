import React from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, Layers, Clock, CheckCircle2, ChevronRight, Gauge, Flame, RefreshCw, Lock, ArrowRight, Download, FileText, Check } from 'lucide-react';
import { calculateBatchHPP, formatRupiah, formatNumber } from '../utils/calculator';

export default function Dashboard({ batches, masterCost, setActiveTab, setSelectedBatchId, currentRole }) {
  const activeBatch = batches[0];
  const calc = calculateBatchHPP(activeBatch, masterCost);

  // Sesuai kerangka hak akses:
  // Operator TIDAK boleh melihat data keuangan / HPP rupiah / margin.
  const isOperator = currentRole === 'operator';
  const isSupervisor = currentRole === 'supervisor';
  const canViewFinancials = currentRole === 'finance' || currentRole === 'manager';

  const workflowSteps = [
    { title: 'Master Biaya', role: 'Finance', done: true },
    { title: 'Log Shift', role: 'Operator', done: true },
    { title: 'Validasi SPV', role: 'Supervisor', done: true },
    { title: 'Alokasi BOP', role: 'Finance', done: true },
    { title: 'Laporan HPP', role: 'Manager', done: activeBatch.status === 'SELESAI' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* 1. SLEEK WORKFLOW STEPPER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Alur Batch: {activeBatch.id}
            </h2>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Siklus: 3 Shift (24 Jam / 1 Hari Operasi) &bull; Target: {formatNumber(activeBatch.targetQtyKg, 0)} kg
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Standar Biaya: Nov 2026
            </span>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              activeBatch.status === 'SELESAI' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {activeBatch.status}
            </span>
          </div>
        </div>

        {/* Linear Stepper */}
        <div className="grid grid-cols-5 gap-2">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                step.done 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                {step.done ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <div className="text-xs font-semibold text-slate-800 truncate w-full">{step.title}</div>
              <div className="text-[10px] text-slate-400">{step.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TOP KPI CARDS (CLEAN VISUAL GAUGES & PROGRESS BARS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Rendemen / Yield */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">Rendemen Bahan (Yield)</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="text-3xl font-extrabold text-slate-900">
              {formatNumber(calc?.kpi.yieldPercent || 0, 2)}%
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Target &ge; 96.5%
            </span>
          </div>

          {/* Smooth visual progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2.5">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(calc?.kpi.yieldPercent || 0, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-slate-500">
            <span>POY: <strong className="text-slate-800">{formatNumber(calc?.physical.totalPoyKg || 0, 0)} kg</strong></span>
            <span>DTY: <strong className="text-emerald-700">{formatNumber(calc?.physical.totalDtyKg || 0, 0)} kg</strong></span>
          </div>
        </div>

        {/* KPI 2: Rasio Limbah Bettes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">Rasio Limbah (Bettes)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="text-3xl font-extrabold text-slate-900">
              {formatNumber(calc?.kpi.wastePercent || 0, 2)}%
            </div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Batas &le; 1.8%
            </span>
          </div>

          {/* Smooth visual progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2.5">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((calc?.kpi.wastePercent || 0) * 35, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-slate-500">
            <span>Limbah: <strong className="text-slate-800">{formatNumber(calc?.physical.totalWasteKg || 0, 1)} kg</strong></span>
            {canViewFinancials && (
              <span className="text-emerald-700 font-semibold">Kredit: {formatRupiah(calc?.costs.wasteCredit)}</span>
            )}
          </div>
        </div>

        {/* KPI 3: Konsumsi Listrik Spesifik (SEC) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">Intensitas Listrik (SEC)</span>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="text-3xl font-extrabold text-slate-900">
              {formatNumber(calc?.kpi.secKwhPerKg || 0, 3)}
            </div>
            <span className="text-xs text-slate-400 font-medium">kWh / kg</span>
          </div>

          {/* Smooth visual progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2.5">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((calc?.kpi.secKwhPerKg || 0) * 100, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-slate-500">
            <span>Daya: <strong className="text-slate-800">{calc?.costs.totalConnectedPowerKw} kW</strong></span>
            <span>Total: <strong className="text-slate-800">{formatNumber(calc?.costs.machineKwh || 0, 0)} kWh</strong></span>
          </div>
        </div>

        {/* KPI 4: HPP Aktual per kg */}
        <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-b from-white to-blue-50/20">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-blue-900">HPP Aktual per Kilogram</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>

          {canViewFinancials ? (
            <>
              <div className="flex items-baseline justify-between mb-2">
                <div className="text-2xl font-black text-blue-950">
                  {formatRupiah(calc?.costs.hppPerKg)}
                </div>
                <span className="text-xs font-semibold text-slate-400">/ kg</span>
              </div>

              {/* Status target pill */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2.5">
                <div
                  className="bg-blue-700 h-full rounded-full transition-all duration-500"
                  style={{ width: '85%' }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Target: <strong>{formatRupiah(activeBatch.targetHppPerKg)}</strong></span>
                <span className={`font-semibold ${
                  (calc?.kpi.costVariancePerKg || 0) <= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {(calc?.kpi.costVariancePerKg || 0) <= 0 ? '✓ Sesuai' : '+Over'}
                </span>
              </div>
            </>
          ) : (
            <div className="py-5 text-center text-xs text-slate-400 space-y-1">
              <Lock className="w-5 h-5 mx-auto text-amber-600" />
              <div className="font-bold text-slate-700">Data HPP Terkunci</div>
              <div className="text-[10px]">Khusus Finance & Management</div>
            </div>
          )}
        </div>
      </div>

      {/* 4. STRUKTUR 4 PILAR BIAYA (CLEAN SEGMENTED VISUAL PROGRESS & COMPACT LEGEND) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Cost Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Struktur Pilar Biaya Produksi DTY
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Spesifikasi: {activeBatch.spec} &bull; Total: {formatNumber(calc?.physical.totalRunHours, 1)} Jam Mesin
              </p>
            </div>

            {canViewFinancials && (
              <button
                onClick={() => {
                  setSelectedBatchId(activeBatch.id);
                  setActiveTab('hpp');
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                Lembar HPP <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {canViewFinancials ? (
            <div className="space-y-4">
              {/* Clean Segmented Bar (Smooth & Modern) */}
              <div className="flex h-3.5 w-full rounded-full overflow-hidden shadow-inner bg-slate-100">
                <div
                  style={{ width: `${calc?.kpi.pctBbbl}%` }}
                  className="bg-blue-800 transition-all duration-500"
                  title={`BBBL: ${formatNumber(calc?.kpi.pctBbbl, 1)}%`}
                ></div>
                <div
                  style={{ width: `${calc?.kpi.pctBlm}%` }}
                  className="bg-sky-500 transition-all duration-500"
                  title={`BLM: ${formatNumber(calc?.kpi.pctBlm, 1)}%`}
                ></div>
                <div
                  style={{ width: `${calc?.kpi.pctBop}%` }}
                  className="bg-purple-500 transition-all duration-500"
                  title={`BOP: ${formatNumber(calc?.kpi.pctBop, 1)}%`}
                ></div>
                <div
                  style={{ width: `${calc?.kpi.pctBtkl}%` }}
                  className="bg-indigo-600 transition-all duration-500"
                  title={`BTKL: ${formatNumber(calc?.kpi.pctBtkl, 1)}%`}
                ></div>
              </div>

              {/* Clean 4-Column Legend Cards (NO PROSE/WALL OF TEXT) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-800"></span>
                    Bahan Baku (BBBL)
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">{formatRupiah(calc?.costs.netBbbl)}</div>
                  <div className="text-[11px] text-blue-800 font-semibold mt-0.5">{formatNumber(calc?.kpi.pctBbbl, 1)}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    Mesin & Listrik (BLM)
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">{formatRupiah(calc?.costs.totalBlm)}</div>
                  <div className="text-[11px] text-sky-700 font-semibold mt-0.5">{formatNumber(calc?.kpi.pctBlm, 1)}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    Overhead (BOP)
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">{formatRupiah(calc?.costs.totalBop)}</div>
                  <div className="text-[11px] text-purple-700 font-semibold mt-0.5">{formatNumber(calc?.kpi.pctBop, 1)}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    Tenaga Kerja (BTKL)
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">{formatRupiah(calc?.costs.totalBtkl)}</div>
                  <div className="text-[11px] text-indigo-700 font-semibold mt-0.5">{formatNumber(calc?.kpi.pctBtkl, 1)}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 space-y-1">
              <Lock className="w-6 h-6 mx-auto text-amber-600" />
              <div className="font-bold text-slate-700 text-sm">Data Finansial Dirahasiakan</div>
              <p className="text-xs text-slate-400">Hak akses operator hanya diperuntukkan untuk log fisik mesin.</p>
            </div>
          )}
        </div>

        {/* Right Col: Clean Machine Telemetry Sensors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3.5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-blue-600" /> Sensor Mesin DTY
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Normal
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-600 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" /> Heater 1 (Termal)
              </span>
              <span className="font-bold text-rose-700">205.4 °C</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-600 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" /> Heater 2 (Set Yarn)
              </span>
              <span className="font-bold text-amber-700">178.2 °C</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-600 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600" /> Kecepatan Mesin
              </span>
              <span className="font-bold text-slate-800">850 m/min</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-600">Tekanan Nozzle Interlace</span>
              <span className="font-bold text-sky-700">2.8 Bar</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM TABLE: BATCH REGISTRY */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Daftar Lot Produksi DTY Pilot Plant
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring riwayat produksi benang poliester
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
            {batches.length} Lot
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Kode Batch</th>
                <th className="py-3 px-4">Spesifikasi Benang</th>
                <th className="py-3 px-4 text-center">Unit Mesin</th>
                <th className="py-3 px-4 text-right">POY Masuk</th>
                <th className="py-3 px-4 text-right">DTY Jadi</th>
                <th className="py-3 px-4 text-right">Limbah</th>
                <th className="py-3 px-4 text-right">Rendemen</th>
                {canViewFinancials && <th className="py-3 px-4 text-right">HPP (/kg)</th>}
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((batch) => {
                const bCalc = calculateBatchHPP(batch, masterCost);
                const isSelected = batch.id === activeBatch.id;

                return (
                  <tr key={batch.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3.5 px-4 font-bold text-blue-700">{batch.id}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{batch.spec}</td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-600">{batch.machineNo}</td>
                    <td className="py-3.5 px-4 text-right text-slate-700">{formatNumber(bCalc?.physical.totalPoyKg, 0)} kg</td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      {formatNumber(bCalc?.physical.totalDtyKg, 0)} kg
                    </td>
                    <td className="py-3.5 px-4 text-right text-amber-700">
                      {formatNumber(bCalc?.physical.totalWasteKg, 1)} kg
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                      {formatNumber(bCalc?.kpi.yieldPercent, 2)}%
                    </td>
                    {canViewFinancials && (
                      <td className="py-3.5 px-4 text-right font-black text-blue-900 text-sm">
                        {formatRupiah(bCalc?.costs.hppPerKg)}
                      </td>
                    )}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                        batch.status === 'SELESAI'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedBatchId(batch.id);
                          if (canViewFinancials || currentRole === 'supervisor') {
                            setActiveTab('hpp');
                          } else {
                            setActiveTab('shift');
                          }
                        }}
                        className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm"
                      >
                        {canViewFinancials || currentRole === 'supervisor' ? 'Lembar HPP' : 'Buka Shift'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
