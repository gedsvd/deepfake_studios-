import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trash2, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileDown, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  X
} from 'lucide-react';
import { getUsers, deleteUser, registerUser } from '../services/db';
import { User } from '../types';

interface AdminPanelProps {
  currentUser: User;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>({
    type: 'success',
    message: 'Logged in as Admin! Full database administrative access granted.',
  });

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newPassword, setNewPassword] = useState('user123');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Load users from storage
  const refreshUsers = () => {
    const list = getUsers();
    setUsers(list);
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleDelete = (userId: number, email: string) => {
    if (confirm(`Are you sure you want to permanently delete user "${email}"?`)) {
      setDeletingId(userId);
      setTimeout(() => {
        const ok = deleteUser(userId);
        setDeletingId(null);
        if (ok) {
          refreshUsers();
          setFeedback({
            type: 'success',
            message: `User ${email} deleted successfully.`,
          });
        } else {
          setFeedback({
            type: 'error',
            message: `Failed to remove user ${email}.`,
          });
        }
      }, 350);
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!newName || !newCity || !newEmail || !newMobile || !newPassword) {
      setModalError('Please fill all fields.');
      return;
    }

    setModalLoading(true);
    setTimeout(() => {
      const res = registerUser({
        name: newName,
        city: newCity,
        email: newEmail,
        mobile: newMobile,
        password: newPassword,
      });

      setModalLoading(false);
      if (res.success) {
        setShowAddModal(false);
        setNewName('');
        setNewCity('');
        setNewEmail('');
        setNewMobile('');
        refreshUsers();
        setFeedback({
          type: 'success',
          message: `User ${newEmail} created and added to database.`,
        });
      } else {
        setModalError(res.error || 'Failed to create user.');
      }
    }, 300);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'City', 'Email', 'Mobile', 'Role', 'Created At'];
    const rows = users.map(u => [
      u.id,
      `"${u.name}"`,
      `"${u.city}"`,
      `"${u.email}"`,
      `"${u.mobile}"`,
      u.role,
      u.createdAt || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `deepguard_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q) ||
      u.mobile.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full pb-12">
      {/* Top Welcome / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>ROLE: SUPER_ADMINISTRATOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Panel - User Management
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            MANAGE REGISTERED ACCOUNTS • PERMISSIONS • DATABASE AUDIT
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
            title="Export CSV"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Database Users
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            {users.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">SQLite3 Local Cluster Table</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Standard Analysts
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
            {users.filter(u => u.role !== 'admin').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Verified Biometric Inquirers</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Root Administrators
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Master Privileges Enabled</div>
        </div>
      </div>

      {/* Search and Table Container */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, city, or phone..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="text-xs font-mono text-slate-400 self-center">
            Showing <span className="text-cyan-300 font-bold">{filteredUsers.length}</span> of {users.length} users
          </div>
        </div>

        {/* User Items List matching Python code structure */}
        <div className="space-y-3 pt-2">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              No matching users found in the database.
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isCurrentUser = currentUser.email.toLowerCase() === u.email.toLowerCase();
              const isDeleting = deletingId === u.id;

              return (
                <div
                  key={u.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-sm text-white">{u.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                        }`}
                      >
                        {u.role}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          Current Session
                        </span>
                      )}
                    </div>

                    {/* Metadata line matching Python format: Name | Email | City | Mobile */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-300">{u.email}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{u.city}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{u.mobile}</span>
                      </span>
                      {u.createdAt && (
                        <span className="flex items-center gap-1.5 text-slate-500 hidden sm:flex">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleDelete(u.id, u.email)}
                      disabled={isDeleting || isCurrentUser}
                      title={isCurrentUser ? "You cannot delete your own active admin account" : `Delete ${u.email}`}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Removing {u.email}...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete {u.email}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Add User to Database</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-mono mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jordan Rivera"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. j.rivera@neural.org"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-mono mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Austin"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-mono mb-1">Mobile</label>
                  <input
                    type="text"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    placeholder="e.g. +1 (512) 555-0199"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Initial Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5"
                >
                  {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
