import React, { useState } from 'react';
import { Save, AlertCircle, Zap, Wrench, DollarSign, Cpu, CheckCircle2, Info, Building2, Sliders } from 'lucide-react';
import { formatRupiah, formatNumber } from '../utils/calculator';

export default function MasterCost({ masterCost, setMasterCost, currentRole }) {
  const [formData, setFormData] = useState({ ...masterCost });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canEdit = currentRole === 'finance' || currentRole === 'manager';

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!canEdit) return;
    setMasterCost({ ...formData });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const totalDayaKw = Number(formData.dayaHeatersKw || 0) + Number(formData.dayaMotorKw || 0);
  const kwhPerHour = totalDayaKw * Number(formData.loadFactor || 0.7);
  const costPerHour = kwhPerHour * Number(formData.electricityTariffAvg || 1250);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Master Parameter Biaya Produksi DTY
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Konfigurasi harga acuan bahan baku POY, tarif listrik PLN industri, parameter mesin, dan alokasi BOP.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 px-3.5 py-2 rounded-xl font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Parameter Biaya Berhasil Disimpan!
            </div>
          )}

          {!canEdit && (
            <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Mode Baca: Hanya Finance & Management yang berhak mengubah tarif.
            </div>
          )}
        </div>

        {/* Kurun Waktu Standar Biaya Finance */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md text-[11px]">
              STANDAR BIAYA FINANCE
            </span>
            <span className="font-semibold text-slate-800">
              Periode Berlaku: <strong>November 2026 (Q4)</strong>
            </span>
          </div>
          <div className="text-[11px] text-blue-800 flex flex-wrap gap-x-4 gap-y-1">
            <span>&bull; <strong>Bahan Baku (POY):</strong> Berlaku <em>1 Bulan</em> (Kontrak Lot)</span>
            <span>&bull; <strong>Listrik PLN:</strong> Berlaku <em>3 Bulan</em> (Triwulanan ESDM)</span>
            <span>&bull; <strong>Upah & BOP:</strong> Berlaku <em>1 Tahun Fiskal</em> (Budgeting 2026)</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Parameter Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Bahan Baku & Limbah Scrap */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Bahan Baku & Kredit Waste
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                Berlaku: Bulanan
              </span>
              <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
                Pilar 1 (BBBL)
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Harga Beli POY 250 Denier</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white shadow-sm">
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.poyPricePerKg}
                  onChange={e => handleChange('poyPricePerKg', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">/ kg</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Harga Coning Oil (Minyak Pelumas)</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white shadow-sm">
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.coningOilPricePerKg}
                  onChange={e => handleChange('coningOilPricePerKg', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">/ kg</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Standar Oil Pick-Up Benang</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white shadow-sm">
                <input
                  type="number"
                  step="0.1"
                  disabled={!canEdit}
                  value={formData.oilPickupPercent}
                  onChange={e => handleChange('oilPickupPercent', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">% berat DTY</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Acuan standar industri: 1.8%</span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-slate-700 font-medium mb-1.5">
                Harga Jual Scrap Limbah Bettes/Tangle
              </label>
              <div className="flex rounded-xl overflow-hidden border border-emerald-300 bg-emerald-50/40 focus-within:ring-2 focus-within:ring-emerald-500 shadow-sm">
                <span className="px-3 py-2 bg-emerald-100/70 text-emerald-800 font-semibold border-r border-emerald-300 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.scrapWastePricePerKg}
                  onChange={e => handleChange('scrapWastePricePerKg', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-emerald-800 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-emerald-100/70 text-emerald-800 font-semibold border-l border-emerald-300 text-xs">/ kg</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                *Faktor pengurang langsung total biaya bahan baku
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Listrik PLN & Tarif Industri */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              Tarif Listrik PLN Industri
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                Berlaku: Triwulanan
              </span>
              <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-100">
                Gol I-3/TM
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Tarif LWBP (Luar Beban Puncak: 22:00 - 18:00)</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.electricityTariffLwbp}
                  onChange={e => handleChange('electricityTariffLwbp', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">/ kWh</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Tarif WBP (Waktu Beban Puncak: 18:00 - 22:00)</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.electricityTariffWbp}
                  onChange={e => handleChange('electricityTariffWbp', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">/ kWh</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Tarif Rata-Rata Operasional</label>
              <div className="flex rounded-xl overflow-hidden border border-blue-300 bg-blue-50/40 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
                <span className="px-3 py-2 bg-blue-600 text-white font-semibold border-r border-blue-600 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.electricityTariffAvg}
                  onChange={e => handleChange('electricityTariffAvg', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-blue-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-blue-600 text-white font-semibold border-l border-blue-600 text-xs">/ kWh</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              Estimasi Penggunaan Listrik: <strong>{formatNumber(kwhPerHour, 1)} kWh/jam</strong> &bull; Biaya: <strong>{formatRupiah(costPerHour)}/jam mesin</strong>.
            </div>
          </div>
        </div>

        {/* Card 3: Daya Mesin & Faktor Beban */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Cpu className="w-4 h-4 text-indigo-600" />
              Daya Mesin & Faktor Beban
            </span>
            <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-100">
              Pilar 3 (BLM)
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Daya Heaters I & II (Termal)</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <input
                  type="number"
                  step="0.5"
                  disabled={!canEdit}
                  value={formData.dayaHeatersKw}
                  onChange={e => handleChange('dayaHeatersKw', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">kW</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Pemanas primer dan sekunder</span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Daya Motor & Spindel (Mekanis)</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <input
                  type="number"
                  step="0.5"
                  disabled={!canEdit}
                  value={formData.dayaMotorKw}
                  onChange={e => handleChange('dayaMotorKw', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">kW</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Motor penarik benang, winder & spindel</span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Faktor Beban / Load Factor (Default: 0.70)</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <input
                  type="number"
                  step="0.01"
                  disabled={!canEdit}
                  value={formData.loadFactor}
                  onChange={e => handleChange('loadFactor', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-blue-700 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">
                  {Math.round(formData.loadFactor * 100)}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Total Daya Terpasang Mesin: <strong>{totalDayaKw} kW</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Suku Cadang Friction Discs & Upah Operator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Wrench className="w-4 h-4 text-emerald-600" />
              Friction Disc & Upah Operator
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                Berlaku: Tahunan (2026)
              </span>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-100">
                Pilar 2 & 3
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Tarif Keausan Friction Discs</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.wearDiscCostPerHour}
                  onChange={e => handleChange('wearDiscCostPerHour', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">/ jam mesin</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Biaya penyusutan piringan karet pemuntir</span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Tarif Upah Operator Langsung</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.laborRatePerHour}
                  onChange={e => handleChange('laborRatePerHour', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">/ jam-org</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Upah standar per jam per operator</span>
            </div>
          </div>
        </div>

        {/* Card 5: Overhead Pabrik (BOP) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Building2 className="w-4 h-4 text-purple-600" />
              Alokasi Biaya Overhead Pabrik (BOP)
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">
                Berlaku: Tahunan (Budget 2026)
              </span>
              <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold border border-purple-100">
                Pilar 4 (BOP)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Depresiasi Mesin DTY</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.depreciationRatePerHour}
                  onChange={e => handleChange('depreciationRatePerHour', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">/ jam</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Metode Garis Lurus 10 Tahun</span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Listrik Utilitas AC & Kompresor</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.supportUtilityPerHour}
                  onChange={e => handleChange('supportUtilityPerHour', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">/ jam</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Pendingin ruang & udara tekan nozzle</span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Preventive Maintenance & Servis</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm">
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs">Rp</span>
                <input
                  type="number"
                  disabled={!canEdit}
                  value={formData.maintenanceRatePerHour}
                  onChange={e => handleChange('maintenanceRatePerHour', e.target.value)}
                  className="w-full px-3 py-2 font-bold text-slate-900 focus:outline-none bg-transparent disabled:text-slate-500 text-sm"
                />
                <span className="px-3 py-2 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 text-xs">/ jam</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Pelumasan bearing & pembersih heater</span>
            </div>
          </div>
        </div>

        {/* 3. Action Button */}
        {canEdit && (
          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" /> Simpan Perubahan Parameter Master Biaya
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
