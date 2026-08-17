import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types/auth';
import {
  ShieldAlert,
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Shield,
  ShieldCheck,
  Key,
  Trash2,
  CheckCircle2,
  Ban,
  HardDrive,
  Activity,
  Cpu,
  Mail,
  Edit3,
  X,
  Sparkles,
  Lock
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { user: currentUser, allUsers, addUser, updateUser, deleteUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('operator');
  const [newUserDeviceLimit, setNewUserDeviceLimit] = useState(10);

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    addUser(newUserName, newUserEmail, newUserRole, newUserDeviceLimit);
    setIsAddModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('operator');
    setNewUserDeviceLimit(10);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <ShieldCheck className="w-3 h-3" />
            <span>Super Admin / Owner</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Shield className="w-3 h-3" />
            <span>Administrator</span>
          </span>
        );
      case 'operator':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Activity className="w-3 h-3" />
            <span>Operator</span>
          </span>
        );
      case 'viewer':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-gray-500/20 text-gray-300 border border-gray-500/30">
            <Users className="w-3 h-3" />
            <span>Viewer (Read-Only)</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0B0F19] p-6 space-y-6">
      {/* Top Header */}
      <div className="pb-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold font-heading text-white">Super Admin — User Management</h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 glow-amber flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Owner Access</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Kelola hak akses pengguna, alokasi kuota perangkat IoT, peran keamanan (*Role-Based Access Control*), dan status keanggotaan platform.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition self-start md:self-auto font-mono"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New User</span>
        </button>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Total Pengguna</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{allUsers.length} Users</div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Verified Accounts</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Admin & Operator</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {allUsers.filter(u => u.role === 'owner' || u.role === 'admin' || u.role === 'operator').length} Active
          </div>
          <div className="text-[11px] text-purple-300 font-mono">Role-Based Control</div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Total Kuota Perangkat</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {allUsers.reduce((acc, u) => acc + (u.deviceLimit || 5), 0)} Devices
          </div>
          <div className="text-[11px] text-cyan-300 font-mono">Global Device Capacity</div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Status Keamanan</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">Enforced</div>
          <div className="text-[11px] text-gray-400 font-mono">JWT & OTP Protection</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl glass-panel border border-gray-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau alamat email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center space-x-2 bg-gray-950 border border-gray-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs text-gray-300 focus:outline-none font-mono"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner / Super Admin</option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 bg-gray-950 border border-gray-800 rounded-xl px-3 py-1.5">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-gray-300 focus:outline-none font-mono"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl glass-panel border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-950/80 border-b border-gray-800 text-gray-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-6 py-4">User Profile</th>
                <th className="px-6 py-4">Role & Access</th>
                <th className="px-6 py-4">Device Quota</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-sans">
              {filteredUsers.map((u) => {
                const isSuper = u.role === 'owner';
                const isSuspended = u.status === 'suspended';

                return (
                  <tr key={u.id} className="hover:bg-gray-900/40 transition">
                    {/* User Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.email}`}
                          alt={u.name}
                          className="w-9 h-9 rounded-full border border-gray-700 bg-gray-800"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{u.name}</span>
                            {isSuper && <Sparkles className="w-3 h-3 text-amber-400" />}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Selector */}
                    <td className="px-6 py-4">
                      {isSuper ? (
                        getRoleBadge(u.role)
                      ) : (
                        <select
                          value={u.role}
                          onChange={e => updateUser(u.id, { role: e.target.value as UserRole })}
                          className="bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-brand-500 font-mono"
                        >
                          <option value="admin">Administrator</option>
                          <option value="operator">Operator</option>
                          <option value="viewer">Viewer (Read-Only)</option>
                        </select>
                      )}
                    </td>

                    {/* Device Quota */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-brand-300">
                          {u.devicesCount || 0} / {u.deviceLimit || 5}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">Devices</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <button
                        disabled={isSuper}
                        onClick={() => updateUser(u.id, { status: isSuspended ? 'active' : 'suspended' })}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase transition ${
                          isSuspended
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                        }`}
                      >
                        {isSuspended ? (
                          <>
                            <Ban className="w-3 h-3" />
                            <span>Suspended</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Last Login */}
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-400">
                      {u.lastLogin || 'Recent'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {!isSuper && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus pengguna "${u.name}" (${u.email})?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add User */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white font-heading flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-brand-400" />
                <span>Invite / Add New User</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Daftarkan anggota tim atau operator baru ke dalam platform IoT Hub Pro Anda.
              </p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-[11px] text-gray-400 font-medium block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Prakoso"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 font-medium block mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  placeholder="budi@company.com"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-400 font-medium block mb-1">Role / Peran</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500 font-mono"
                  >
                    <option value="admin">Administrator</option>
                    <option value="operator">Operator</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-medium block mb-1">Batas Kuota Device</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={newUserDeviceLimit}
                    onChange={e => setNewUserDeviceLimit(Number(e.target.value))}
                    className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl shadow-lg glow-cyan transition font-mono"
                >
                  Confirm & Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
