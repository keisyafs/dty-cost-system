import React from 'react';
import { 
  LayoutDashboard, 
  Sliders, 
  ClipboardList, 
  Building2, 
  FileText, 
  Lock, 
  Shield, 
  Users, 
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentRole, 
  activeUser, 
  setShowUserModal 
}) {
  const getTabAccess = (tabId) => {
    if (currentRole === 'manager') return { allowed: true };
    if (tabId === 'dashboard') {
      return { allowed: true, note: currentRole === 'operator' ? 'Hanya Metrik Teknis' : '' };
    }
    if (tabId === 'shift') {
      return { allowed: true };
    }
    if (tabId === 'master') {
      if (currentRole === 'finance') return { allowed: true };
      return { allowed: false, reason: 'Khusus Finance & Manager' };
    }
    if (tabId === 'overhead') {
      if (currentRole === 'finance') return { allowed: true };
      return { allowed: false, reason: 'Khusus Finance & Manager' };
    }
    if (tabId === 'hpp') {
      if (currentRole === 'finance' || currentRole === 'supervisor') return { allowed: true };
      return { allowed: false, reason: 'Khusus Finance & Supervisor' };
    }
    return { allowed: true };
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard & Produktivitas', 
      icon: LayoutDashboard,
      desc: 'Ringkasan KPI, Yield & Waste'
    },
    { 
      id: 'master', 
      label: 'Master Parameter Biaya', 
      icon: Sliders,
      desc: 'Harga POY, Tarif PLN, Upah'
    },
    { 
      id: 'shift', 
      label: 'Log Shift Operasional', 
      icon: ClipboardList,
      desc: 'Timbangan fisik & downtime'
    },
    { 
      id: 'overhead', 
      label: 'Alokasi Overhead (BOP)', 
      icon: Building2,
      desc: 'Depresiasi mesin & utilitas'
    },
    { 
      id: 'hpp', 
      label: 'Kalkulasi & Laporan HPP', 
      icon: FileText,
      desc: 'Cost Sheet resmi Indorama'
    },
  ];

  return (
    <aside className="w-64 bg-[#001D3D] text-white flex flex-col shrink-0 border-r border-[#003566] select-none print:hidden">
      {/* Brand & Logo */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3 bg-[#00172E]">
        <div className="bg-white p-1.5 rounded-lg shrink-0 shadow-sm">
          <img
            src="/indorama.jpg"
            alt="Indorama Logo"
            className="h-8 w-auto object-contain block max-w-[110px]"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span class="font-bold text-[#003F7A] text-xs px-1">INDORAMA</span>';
            }}
          />
        </div>
        <div>
          <div className="text-xs font-bold text-white tracking-tight leading-tight">
            PT INDORAMA
          </div>
          <div className="text-[11px] text-blue-300 font-medium">
            Unit Pilot Plant DTY
          </div>
        </div>
      </div>

      {/* Navigation Menu (NO NUMBERS 1, 2, 3!) */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const access = getTabAccess(item.id);
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (access.allowed) {
                  setActiveTab(item.id);
                }
              }}
              disabled={!access.allowed}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : access.allowed
                  ? 'text-slate-300 hover:text-white hover:bg-white/10 font-medium'
                  : 'text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'}`} />
                <div className="truncate">
                  <div className="text-xs truncate">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </div>
                </div>
              </div>

              {!access.allowed && (
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" title={access.reason} />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action / Manager Section */}
      {currentRole === 'manager' && (
        <div className="p-3 mx-3 mb-3 bg-blue-950/60 rounded-xl border border-blue-500/30">
          <div className="text-[11px] font-semibold text-blue-200 mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Akses Administrator
          </div>
          <button
            onClick={() => setShowUserModal(true)}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Users className="w-3.5 h-3.5" />
            Kelola User & Hak Akses
          </button>
        </div>
      )}

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-white/10 text-[11px] text-slate-400 bg-[#00172E]">
        <div className="flex items-center justify-between text-slate-300 mb-1">
          <span>Status Mesin:</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Online (2/2)
          </span>
        </div>
        <div className="text-[10px] text-slate-400">
          Kecepatan: 850 m/min &bull; 432 Spindel
        </div>
      </div>
    </aside>
  );
}
