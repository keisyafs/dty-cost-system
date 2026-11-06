import React, { useState } from 'react';
import { 
  Plus, Check, X, Clock, AlertTriangle, ShieldCheck, 
  FileSpreadsheet, CheckCircle2, ChevronDown, Calendar, 
  Users, Layers, Edit3, AlertCircle, RefreshCw 
} from 'lucide-react';
import { calculateBatchHPP, formatNumber } from '../utils/calculator';

export default function ShiftLog({ batches, setBatches, currentRole }) {
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);

  // Rejection Modal State
  const [rejectModalShiftId, setRejectModalShiftId] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  // Edit / Revision Modal State (for Operator to fix rejected shift)
  const [editingShift, setEditingShift] = useState(null);

  // New Shift Form State
  const [shiftNo, setShiftNo] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [operatorCount, setOperatorCount] = useState(3);
  const [runHours, setRunHours] = useState(7.5);
  const [downtimeHours, setDowntimeHours] = useState(0.5);
  const [downtimeReason, setDowntimeReason] = useState('Creeling POY lot baru');
  const [poyInputKg, setPoyInputKg] = useState(1700);
  const [dtyOutputKg, setDtyOutputKg] = useState(1650);
  const [wasteBettesKg, setWasteBettesKg] = useState(15.0);

  const activeBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const canApprove = currentRole === 'supervisor' || currentRole === 'manager';
  const canInput = currentRole === 'operator' || currentRole === 'supervisor' || currentRole === 'manager';

  const previewYield = poyInputKg > 0 ? (dtyOutputKg / poyInputKg) * 100 : 0;
  const previewWaste = poyInputKg > 0 ? (wasteBettesKg / poyInputKg) * 100 : 0;

  // 1. TAMBAH SHIFT BARU
  const handleAddShift = (e) => {
    e.preventDefault();
    if (!activeBatch) return;

    const newShift = {
      id: `SH-${Date.now().toString().slice(-4)}`,
      shiftNo: Number(shiftNo),
      date,
      operatorCount: Number(operatorCount),
      runHours: Number(runHours),
      downtimeHours: Number(downtimeHours),
      downtimeReason: downtimeReason || 'Operasi Normal',
      poyInputKg: Number(poyInputKg),
      dtyOutputKg: Number(dtyOutputKg),
      wasteBettesKg: Number(wasteBettesKg),
      status: currentRole === 'supervisor' || currentRole === 'manager' ? 'APPROVED' : 'PENDING',
      supervisor: currentRole === 'supervisor' || currentRole === 'manager' ? 'M. Faisal (Verified)' : '-',
      rejectionReason: ''
    };

    const updatedBatches = batches.map(b => {
      if (b.id === activeBatch.id) {
        return {
          ...b,
          shifts: [...b.shifts, newShift]
        };
      }
      return b;
    });

    setBatches(updatedBatches);
    setShowAddForm(false);
  };

  // 2. SUPERVISOR MENYETUJUI SHIFT
  const handleApproveShift = (shiftId) => {
    if (!canApprove) return;
    const updatedBatches = batches.map(b => {
      if (b.id === activeBatch.id) {
        return {
          ...b,
          shifts: b.shifts.map(s => {
            if (s.id === shiftId) {
              return { 
                ...s, 
                status: 'APPROVED', 
                supervisor: 'M. Faisal (Verified)',
                rejectionReason: '' 
              };
            }
            return s;
          })
        };
      }
      return b;
    });
    setBatches(updatedBatches);
  };

  // 3. SUPERVISOR MEMBUKA MODAL PENOLAKAN
  const handleOpenRejectModal = (shiftId) => {
    setRejectModalShiftId(shiftId);
    setRejectionReasonText('');
  };

  // 4. SUPERVISOR MENGONFIRMASI PENOLAKAN DENGAN ALASAN
  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!canApprove || !rejectModalShiftId) return;

    const updatedBatches = batches.map(b => {
      if (b.id === activeBatch.id) {
        return {
          ...b,
          shifts: b.shifts.map(s => {
            if (s.id === rejectModalShiftId) {
              return { 
                ...s, 
                status: 'REJECTED', 
                supervisor: 'M. Faisal (Ditolak)',
                rejectionReason: rejectionReasonText || 'Data timbangan/jam mesin tidak sinkron dengan fisik lapangan.'
              };
            }
            return s;
          })
        };
      }
      return b;
    });

    setBatches(updatedBatches);
    setRejectModalShiftId(null);
    setRejectionReasonText('');
  };

  // 5. OPERATOR MENYIMPAN REVISI SHIFT YANG SEBELUMNYA DITOLAK
  const handleSaveRevisedShift = (e) => {
    e.preventDefault();
    if (!editingShift) return;

    const updatedBatches = batches.map(b => {
      if (b.id === activeBatch.id) {
        return {
          ...b,
          shifts: b.shifts.map(s => {
            if (s.id === editingShift.id) {
              return {
                ...editingShift,
                status: 'PENDING', // Kembali ke PENDING agar supervisor bisa memeriksa ulang
                supervisor: '-',
                rejectionReason: ''
              };
            }
            return s;
          })
        };
      }
      return b;
    });

    setBatches(updatedBatches);
    setEditingShift(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Toolbar & Batch Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
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
                {b.id} &bull; {b.spec} ({b.machineNo})
              </option>
            ))}
          </select>
        </div>

        {canInput && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Tutup Formulir' : '+ Catat Log Shift Baru'}
          </button>
        )}
      </div>

      {/* 2. Form Input Shift Baru */}
      {showAddForm && (
        <form onSubmit={handleAddShift} className="bg-white rounded-2xl border border-blue-200 p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Formulir Pencatatan Shift Produksi DTY
              </h3>
            </div>
            <div className="text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full font-semibold border border-blue-100">
              Target Lot: {activeBatch.id} ({activeBatch.machineNo})
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Shift Kerja</label>
              <select
                value={shiftNo}
                onChange={e => setShiftNo(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Shift 1 (06:00 - 14:00 WIB)</option>
                <option value={2}>Shift 2 (14:00 - 22:00 WIB)</option>
                <option value={3}>Shift 3 (22:00 - 06:00 WIB)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Tanggal Produksi</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Jumlah Operator Bertugas</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white">
                <input
                  type="number"
                  min="1"
                  value={operatorCount}
                  onChange={e => setOperatorCount(e.target.value)}
                  className="w-full p-2.5 font-bold focus:outline-none"
                />
                <span className="p-2.5 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200">Orang</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Jam Jalan Mesin (Run Hours)</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white">
                <input
                  type="number"
                  step="0.1"
                  value={runHours}
                  onChange={e => setRunHours(e.target.value)}
                  className="w-full p-2.5 font-bold focus:outline-none"
                />
                <span className="p-2.5 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200">Jam</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Jam Mati Mesin (Downtime)</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white">
                <input
                  type="number"
                  step="0.1"
                  value={downtimeHours}
                  onChange={e => setDowntimeHours(e.target.value)}
                  className="w-full p-2.5 font-bold text-rose-600 focus:outline-none"
                />
                <span className="p-2.5 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200">Jam</span>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-700 font-medium mb-1.5">Keterangan Kendala / Downtime</label>
              <input
                type="text"
                value={downtimeReason}
                onChange={e => setDowntimeReason(e.target.value)}
                placeholder="Contoh: Putus benang spindle 12, creeling lot baru..."
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Bahan Baku POY Masuk</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white">
                <input
                  type="number"
                  value={poyInputKg}
                  onChange={e => setPoyInputKg(e.target.value)}
                  className="w-full p-2.5 font-bold text-slate-900 focus:outline-none"
                />
                <span className="p-2.5 bg-slate-50 text-slate-500 font-semibold border-l border-slate-200">kg</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Hasil Benang DTY Jadi</label>
              <div className="flex rounded-xl overflow-hidden border border-emerald-300 bg-emerald-50/30">
                <input
                  type="number"
                  value={dtyOutputKg}
                  onChange={e => setDtyOutputKg(e.target.value)}
                  className="w-full p-2.5 font-bold text-emerald-800 focus:outline-none bg-transparent"
                />
                <span className="p-2.5 bg-emerald-100/70 text-emerald-800 font-semibold border-l border-emerald-300">kg</span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1.5">Limbah Kusut (Bettes/Tangle)</label>
              <div className="flex rounded-xl overflow-hidden border border-amber-300 bg-amber-50/30">
                <input
                  type="number"
                  step="0.1"
                  value={wasteBettesKg}
                  onChange={e => setWasteBettesKg(e.target.value)}
                  className="w-full p-2.5 font-bold text-amber-800 focus:outline-none bg-transparent"
                />
                <span className="p-2.5 bg-amber-100/70 text-amber-800 font-semibold border-l border-amber-300">kg</span>
              </div>
            </div>
          </div>

          {/* Real-time Calculation Preview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <span>Estimasi Rendemen Shift: <strong className="text-emerald-700 text-sm font-bold">{formatNumber(previewYield, 2)}%</strong></span>
              <span>&bull;</span>
              <span>Rasio Limbah: <strong className="text-amber-700 text-sm font-bold">{formatNumber(previewWaste, 2)}%</strong></span>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Simpan Catatan Shift ke Sistem
            </button>
          </div>
        </form>
      )}

      {/* 3. Shift Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Riwayat Log Shift: {activeBatch.id}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mesin: <strong>{activeBatch.machineNo}</strong> &bull; Total: <strong>{activeBatch.shifts.length} Shift</strong> (1 Siklus 24 Jam = 3 Shift: Pagi, Siang, Malam)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-blue-50 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-100">
              *Setiap shift diakumulasikan ke dalam 1 HPP Batch final
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">ID Shift</th>
                <th className="py-3 px-4">Tgl & Shift</th>
                <th className="py-3 px-4 text-center">Operator</th>
                <th className="py-3 px-4 text-center">Jam Jalan</th>
                <th className="py-3 px-4 text-center">Downtime</th>
                <th className="py-3 px-4">Kendala / Catatan Revisi</th>
                <th className="py-3 px-4 text-right">POY Masuk</th>
                <th className="py-3 px-4 text-right">DTY Jadi</th>
                <th className="py-3 px-4 text-right">Bettes</th>
                <th className="py-3 px-4 text-right">Rendemen</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi / Verifikasi SPV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeBatch.shifts.map(shift => {
                const yieldPct = shift.poyInputKg > 0 ? (shift.dtyOutputKg / shift.poyInputKg) * 100 : 0;
                const isRejected = shift.status === 'REJECTED';
                const isApproved = shift.status === 'APPROVED';
                const isPending = shift.status === 'PENDING';

                return (
                  <tr key={shift.id} className={`hover:bg-slate-50/80 transition-colors ${isRejected ? 'bg-rose-50/30' : ''}`}>
                    <td className="py-3 px-4 font-bold text-blue-700">{shift.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{shift.date}</div>
                      <div className="text-[11px] text-slate-500">Shift {shift.shiftNo}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-600">{shift.operatorCount} org</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{shift.runHours} jam</td>
                    <td className="py-3 px-4 text-center text-rose-600 font-semibold">{shift.downtimeHours} jam</td>
                    <td className="py-3 px-4 text-[11px] max-w-[200px]">
                      <div className="text-slate-700 truncate" title={shift.downtimeReason}>
                        {shift.downtimeReason}
                      </div>
                      {isRejected && shift.rejectionReason && (
                        <div className="mt-1 text-rose-700 font-semibold bg-rose-50 p-1.5 rounded border border-rose-200 text-[10px]">
                          <strong>Catatan SPV:</strong> {shift.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">{formatNumber(shift.poyInputKg, 0)} kg</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatNumber(shift.dtyOutputKg, 0)} kg</td>
                    <td className="py-3 px-4 text-right font-semibold text-amber-700">{formatNumber(shift.wasteBettesKg, 1)} kg</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">{formatNumber(yieldPct, 1)}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {isApproved ? 'Disetujui' : isRejected ? 'Ditolak (Revisi)' : 'Menunggu SPV'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isPending && (
                        canApprove ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleApproveShift(shift.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1"
                              title="Setujui Catatan Shift"
                            >
                              <Check className="w-3.5 h-3.5" /> Setujui
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(shift.id)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1"
                              title="Tolak dan Minta Operator Revisi"
                            >
                              <X className="w-3.5 h-3.5" /> Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Menunggu SPV</span>
                        )
                      )}

                      {isApproved && (
                        <div className="flex items-center justify-center gap-1 text-xs text-emerald-700 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Terverifikasi
                          {canApprove && (
                            <button
                              onClick={() => handleOpenRejectModal(shift.id)}
                              className="ml-1 text-[10px] text-slate-400 hover:text-rose-600 underline"
                              title="Batalkan persetujuan dan minta revisi"
                            >
                              Batalkan
                            </button>
                          )}
                        </div>
                      )}

                      {isRejected && (
                        <div className="space-y-1">
                          <span className="text-[10px] text-rose-600 font-bold block">
                            Perlu Revisi
                          </span>
                          {/* Operator atau siapa saja bisa mengedit/memperbaiki data yang ditolak */}
                          <button
                            onClick={() => setEditingShift({ ...shift })}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold rounded-lg shadow-sm flex items-center gap-1 mx-auto"
                            title="Buka form untuk memperbaiki timbangan"
                          >
                            <Edit3 className="w-3 h-3" /> Perbaiki Data
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL ALASAN PENOLAKAN OLEH SUPERVISOR */}
      {rejectModalShiftId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertCircle className="w-5 h-5" />
                Tolak Catatan Shift ({rejectModalShiftId})
              </div>
              <button onClick={() => setRejectModalShiftId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <p className="text-slate-600">
                Sebagai Supervisor, masukkan alasan penolakan agar Operator tahu bagian timbangan atau jam mesin mana yang harus diperbaiki:
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Catatan Alasan Penolakan (Instruksi Revisi):
                </label>
                <textarea
                  required
                  rows="3"
                  value={rejectionReasonText}
                  onChange={e => setRejectionReasonText(e.target.value)}
                  placeholder="Contoh: Timbangan DTY terlalu tinggi tidak sesuai fisik doffing, atau limbah belum diinput..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectModalShiftId(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Konfirmasi Tolak Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL REVISI / PERBAIKI DATA OLEH OPERATOR */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <Edit3 className="w-5 h-5" />
                Perbaiki Catatan Shift ({editingShift.id})
              </div>
              <button onClick={() => setEditingShift(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Catatan dari SPV */}
            {editingShift.rejectionReason && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800">
                <strong>Instruksi Penolakan dari Supervisor:</strong> {editingShift.rejectionReason}
              </div>
            )}

            <form onSubmit={handleSaveRevisedShift} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Bahan POY Masuk (kg)</label>
                  <input
                    type="number"
                    value={editingShift.poyInputKg}
                    onChange={e => setEditingShift({ ...editingShift, poyInputKg: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Hasil Benang DTY (kg)</label>
                  <input
                    type="number"
                    value={editingShift.dtyOutputKg}
                    onChange={e => setEditingShift({ ...editingShift, dtyOutputKg: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Limbah Bettes (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingShift.wasteBettesKg}
                    onChange={e => setEditingShift({ ...editingShift, wasteBettesKg: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jam Jalan Mesin</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingShift.runHours}
                    onChange={e => setEditingShift({ ...editingShift, runHours: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jam Downtime</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingShift.downtimeHours}
                    onChange={e => setEditingShift({ ...editingShift, downtimeHours: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jumlah Operator</label>
                  <input
                    type="number"
                    value={editingShift.operatorCount}
                    onChange={e => setEditingShift({ ...editingShift, operatorCount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-700 font-medium mb-1">Alasan Kendala / Catatan Perbaikan</label>
                  <input
                    type="text"
                    value={editingShift.downtimeReason}
                    onChange={e => setEditingShift({ ...editingShift, downtimeReason: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingShift(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Kirim Ulang Hasil Revisi (Status Kembali Pending)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
