import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MasterCost from './components/MasterCost';
import ShiftLog from './components/ShiftLog';
import OverheadCost from './components/OverheadCost';
import HppCalculation from './components/HppCalculation';
import UserManagementModal from './components/UserManagementModal';
import { INITIAL_MASTER_COST, INITIAL_BATCHES, INITIAL_USERS } from './data/initialData';

export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState('usr-5'); // Default: Ir. Hendra Wijaya (Manager)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [masterCost, setMasterCost] = useState(INITIAL_MASTER_COST);
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [selectedBatchId, setSelectedBatchId] = useState(INITIAL_BATCHES[0].id);
  const [showUserModal, setShowUserModal] = useState(false);

  // Active user object & their effective role
  const activeUser = users.find(u => u.id === currentUserId) || users[0];
  const currentRole = activeUser.role;

  // Handle switching user
  const handleSwitchUser = (userId) => {
    setCurrentUserId(userId);
    const target = users.find(u => u.id === userId);
    if (target) {
      if (target.role === 'operator' && (activeTab === 'master' || activeTab === 'overhead')) {
        setActiveTab('shift');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-blue-600 selection:text-white text-slate-800">
      {/* Modern Left Sidebar Navigation (NO NUMBERS 1, 2, 3!) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        activeUser={activeUser}
        setShowUserModal={setShowUserModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Navbar */}
        <Header
          currentRole={currentRole}
          activeUser={activeUser}
          users={users}
          onSwitchUser={handleSwitchUser}
          activeTab={activeTab}
          setShowUserModal={setShowUserModal}
        />

        {/* Content Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              batches={batches}
              masterCost={masterCost}
              setActiveTab={setActiveTab}
              setSelectedBatchId={setSelectedBatchId}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'master' && (
            <MasterCost
              masterCost={masterCost}
              setMasterCost={setMasterCost}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'shift' && (
            <ShiftLog
              batches={batches}
              setBatches={setBatches}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'overhead' && (
            <OverheadCost
              masterCost={masterCost}
              setMasterCost={setMasterCost}
              batches={batches}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'hpp' && (
            <HppCalculation
              batches={batches}
              setBatches={setBatches}
              masterCost={masterCost}
              selectedBatchId={selectedBatchId}
              setSelectedBatchId={setSelectedBatchId}
              currentRole={currentRole}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 print:hidden mt-auto">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="font-semibold text-slate-700">PT Indorama Synthetics Tbk &bull; Unit Pilot Plant DTY</span>
            </div>
            <div className="text-slate-400">
              Sistem Manajemen Biaya & HPP &bull; Proyek Manufaktur Tekstil (UTS)
            </div>
          </div>
        </footer>
      </div>

      {/* User Management Modal for Plant Manager */}
      <UserManagementModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        users={users}
        setUsers={setUsers}
        currentUserId={currentUserId}
        onSwitchUser={handleSwitchUser}
      />
    </div>
  );
}
