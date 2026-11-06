import React, { useState } from 'react';
import { X, UserPlus, Shield, Check, Trash2, ArrowRight, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UserManagementModal({ isOpen, onClose, users, setUsers, currentUserId, onSwitchUser }) {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('operator');
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const roleTitles = {
      operator: 'Operator Produksi (Shop Floor)',
      supervisor: 'Supervisor Shift',
      finance: 'Cost Accounting & Finance',
      manager: 'Plant Management'
    };

    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newName,
      email: newEmail,
      role: newRole,
      roleTitle: roleTitles[newRole] || 'Staff Produksi',
      status: 'AKTIF'
    };

    setUsers([...users, newUser]);
    setSuccessMsg(`Akun "${newName}" (${newRole.toUpperCase()}) berhasil ditambahkan! Anda bisa langsung beralih ke akun tersebut.`);
    setNewName('');
    setNewEmail('');
    setShowAddForm(false);

    setTimeout(() => {
      setSuccessMsg('');
    }, 6000);
  };

  const handleDeleteUser = (id) => {
    if (id === currentUserId) {
      alert('Tidak bisa menghapus akun yang sedang aktif digunakan.');
      return;
    }
    if (confirm('Yakin ingin menghapus akun pengguna ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'operator':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2 py-0.5 rounded-full font-medium">Operator</span>;
      case 'supervisor':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs px-2 py-0.5 rounded-full font-medium">Supervisor</span>;
      case 'finance':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs px-2 py-0.5 rounded-full font-medium">Finance</span>;
      case 'manager':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2 py-0.5 rounded-full font-medium">Manager</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 border border-slate-300 text-xs px-2 py-0.5 rounded-full font-medium">{role}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Manajemen Pengguna & Hak Akses Sistem (RBAC)
              </h3>
              <p className="text-xs text-slate-500">
                Kelola daftar staf pabrik, tambah operator/supervisor baru, dan beralih akun.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="text-xs text-slate-600 font-medium">
            Total Terdaftar: <strong className="text-slate-900">{users.length} Pengguna</strong>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            {showAddForm ? 'Tutup Formulir' : '+ Tambah User Baru'}
          </button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <form onSubmit={handleAddUser} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Formulir Pendaftaran Pengguna Baru
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Perusahaan</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="budi.s@indorama.com"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Peran / Hak Akses</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="operator">Operator (Input Timbangan Shift)</option>
                  <option value="supervisor">Supervisor (Validasi & Downtime)</option>
                  <option value="finance">Finance (Master Harga & Hitung HPP)</option>
                  <option value="manager">Plant Manager (Kelola Penuh)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Simpan Akun Baru
              </button>
            </div>
          </form>
        )}

        {/* Users Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Nama & Email</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi & Beralih Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isCurrent = u.id === currentUserId;

                return (
                  <tr key={u.id} className={`hover:bg-slate-50/80 transition-colors ${isCurrent ? 'bg-blue-50/40' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            {u.name}
                            {isCurrent && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.2 rounded-full">
                                Akun Aktif
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isCurrent ? (
                          <span className="text-xs font-semibold text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                            <Check className="w-3.5 h-3.5" /> Sedang Masuk
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              onSwitchUser(u.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-200 hover:border-blue-600 transition-all shadow-sm"
                            title={`Beralih dan masuk sebagai ${u.name}`}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            Ganti ke Akun Ini
                          </button>
                        )}

                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>Cara Menguji:</strong> Setiap kali Anda menambahkan user baru (misal Operator baru), cukup klik tombol <strong>"Ganti ke Akun Ini"</strong> di tabel atas. Tampilan sistem akan langsung berubah mengikuti hak akses peran tersebut. Anda juga bisa berganti akun kapan saja melalui menu profil di pojok kanan atas layar.
          </span>
        </div>

      </div>
    </div>
  );
}
