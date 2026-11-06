import React, { useState, useEffect, useRef } from 'react';
import { Shield, User, Clock, Check, Users, ChevronDown, CheckCircle2, UserCheck } from 'lucide-react';
import { USER_ROLES } from '../data/initialData';

export default function Header({ currentRole, activeUser, users, onSwitchUser, activeTab, setShowUserModal }) {
  const [timeStr, setTimeStr] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }) + ' • ' +
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabTitles = {
    dashboard: 'Dashboard & Produktivitas',
    master: 'Master Parameter Biaya',
    shift: 'Log Shift Operasional',
    overhead: 'Alokasi Overhead (BOP)',
    hpp: 'Kalkulasi & Laporan HPP'
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'operator':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'finance':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'manager':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  // STRICT RBAC FILTERING:
  // Hanya tampilkan akun yang memiliki role sama dengan role saat ini!
  // Operator hanya melihat operator, Supervisor hanya melihat supervisor, dsb.
  const visibleUsers = users.filter(u => u.role === currentRole);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 shadow-sm select-none print:hidden flex flex-wrap items-center justify-between gap-4">
      {/* Page Title & Status */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            {tabTitles[activeTab] || 'Sistem Biaya DTY'}
          </h1>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Pilot Plant Aktif
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          PT Indorama Synthetics Tbk &bull; Shift 2 &bull; {timeStr}
        </p>
      </div>

      {/* Right Controls: Role Switcher & Account Menu */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Quick Role Switcher Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs border border-slate-200">
          <span className="text-slate-500 px-2 font-medium flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Role:
          </span>
          <div className="flex gap-1">
            {[
              { role: 'operator', label: 'Operator' },
              { role: 'supervisor', label: 'Supervisor' },
              { role: 'finance', label: 'Finance' },
              { role: 'manager', label: 'Manager' }
            ].map(({ role, label }) => {
              const userForRole = users.find(u => u.role === role);
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => {
                    if (userForRole) onSwitchUser(userForRole.id);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Account Dropdown Switcher (Filtered strictly by current role) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-blue-400 px-3 py-1.5 rounded-xl transition-all shadow-sm"
            title="Klik untuk memilih akun pengguna"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
              {activeUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>{activeUser.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-medium ${getRoleBadgeStyle(activeUser.role)}`}>
                  {activeUser.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {visibleUsers.length > 1 ? `${visibleUsers.length} Akun Tersedia` : activeUser.email}
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Account Dropdown Menu */}
          {showAccountDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 text-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                    PILIH AKUN {currentRole.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Khusus akun dengan role {currentRole}
                  </div>
                </div>

                {/* HANYA MANAGER YANG BISA KELOLA USER */}
                {currentRole === 'manager' && (
                  <button
                    onClick={() => {
                      setShowAccountDropdown(false);
                      setShowUserModal(true);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
                  >
                    <Users className="w-3 h-3" /> Kelola
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-1.5">
                {visibleUsers.map(u => {
                  const isSelected = u.id === activeUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u.id);
                        setShowAccountDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                        isSelected ? 'bg-blue-50 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          u.role === 'operator' ? 'bg-amber-100 text-amber-800' :
                          u.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                          u.role === 'finance' ? 'bg-purple-100 text-purple-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="truncate">
                          <div className="text-xs text-slate-800 font-medium truncate">{u.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{u.email}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="shrink-0 text-blue-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* HANYA MANAGER YANG MELIHAT TOMBOL TAMBAH USER DI BAWAH DROPDOWN */}
              {currentRole === 'manager' && (
                <div className="p-2 bg-slate-50 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setShowAccountDropdown(false);
                      setShowUserModal(true);
                    }}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Kelola / Tambah User Baru
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
