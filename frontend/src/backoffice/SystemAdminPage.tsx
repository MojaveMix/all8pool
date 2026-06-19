import React, { useState, useEffect } from "react";
import api from "../api";
import { Users, Search, Shield, User, Crown, Plus, Trash2, PowerOff, Power, ClipboardList, Check, X, Mail, Phone, MapPin, Store } from "lucide-react";
import CustomAlert from "../shared/CustomAlert";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "player" | "owner" | "admin";
  status: "active" | "suspended";
}

interface OwnerRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  hallName: string;
  city: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const SystemAdminPage = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('users');
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [requests, setRequests] = useState<OwnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  // Create User State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "player" });
  const [createLoading, setCreateLoading] = useState(false);

  const [readMessages, setReadMessages] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_read_messages") || "[]");
    } catch {
      return [];
    }
  });

  const handleMarkAsRead = (requestId: string) => {
    if (!readMessages.includes(requestId)) {
      const updated = [...readMessages, requestId];
      setReadMessages(updated);
      localStorage.setItem("admin_read_messages", JSON.stringify(updated));
    }
  };

  const unreadCount = requests.filter(r => r.message && !readMessages.includes(r.id)).length;

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const fetchUsers = async (query: string = "") => {
    try {
      setLoading(true);
      const endpoint = query ? `/users?search=${encodeURIComponent(query)}` : `/users`;
      const res = await api.get(endpoint);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/owner-requests');
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(true);
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      const delayDebounceFn = setTimeout(() => {
        fetchUsers(searchQuery);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      fetchRequests();
    }
  }, [searchQuery, activeTab]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setAlertConfig({
      isOpen: true,
      type: 'warning',
      title: 'Change Role',
      message: `Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`,
      onConfirm: async () => {
        try {
          await api.patch(`/users/${userId}/role`, { role: newRole });
          setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)));
          setAlertConfig({ isOpen: true, type: 'success', title: 'Success', message: 'Role updated successfully.' });
        } catch (err: any) {
          console.error("Failed to update role", err);
          setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: err.response?.data?.message || "Failed to update user role" });
        }
      }
    });
  };

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const actionWord = currentStatus === 'active' ? 'suspend' : 'activate';
    
    setAlertConfig({
      isOpen: true,
      type: 'warning',
      title: `${actionWord.charAt(0).toUpperCase() + actionWord.slice(1)} Account`,
      message: `Are you sure you want to ${actionWord} this account?`,
      confirmText: actionWord,
      onConfirm: async () => {
        try {
          await api.patch(`/users/${userId}/status`, { status: newStatus });
          setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus as any } : u)));
          setAlertConfig({ isOpen: true, type: 'success', title: 'Success', message: `Account ${actionWord}d successfully.` });
        } catch (err: any) {
          console.error("Failed to update status", err);
          setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: err.response?.data?.message || "Failed to update user status" });
        }
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    setAlertConfig({
      isOpen: true,
      type: 'error',
      title: 'Delete Account',
      message: 'WARNING: Are you absolutely sure you want to DELETE this user? This action cannot be undone.',
      confirmText: 'Delete Permanently',
      onConfirm: async () => {
        try {
          await api.delete(`/users/${userId}`);
          setUsers(users.filter((u) => u.id !== userId));
          setAlertConfig({ isOpen: true, type: 'success', title: 'Deleted', message: 'User permanently deleted.' });
        } catch (err: any) {
          console.error("Failed to delete user", err);
          setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: err.response?.data?.message || "Failed to delete user" });
        }
      }
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await api.post('/users', newUser);
      setUsers([res.data.user, ...users]);
      setShowCreateModal(false);
      setNewUser({ name: "", email: "", password: "", role: "player" });
      setAlertConfig({ isOpen: true, type: 'success', title: 'Success', message: 'User created successfully.' });
    } catch (err: any) {
      console.error("Failed to create user", err);
      setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: err.response?.data?.message || "Failed to create user" });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRequestStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/owner-requests/${requestId}/status`, { status });
      setRequests(requests.map(r => r.id === requestId ? { ...r, status } : r));
      setAlertConfig({ 
        isOpen: true, 
        type: 'success', 
        title: 'Status Updated', 
        message: `Request has been ${status}.` 
      });
    } catch (err: any) {
      console.error("Failed to update request status", err);
      setAlertConfig({ 
        isOpen: true, 
        type: 'error', 
        title: 'Error', 
        message: err.response?.data?.message || "Failed to update status" 
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield size={16} className="text-danger" />;
      case "owner": return <Crown size={16} className="text-warning" />;
      default: return <User size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <CustomAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onClose={closeAlert}
        confirmText={alertConfig.confirmText}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <Shield className="text-danger" size={32} />
            System Administration
          </h2>
          <p className="text-gray-400 font-bold mt-2">
            Manage all platform users, roles, and partner applications.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-accent text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,255,136,0.2)]"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-800 pb-px">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-4 font-black uppercase tracking-widest text-xs transition-all relative ${
            activeTab === 'users' ? 'text-accent' : 'text-gray-500 hover:text-white'
          }`}
        >
          User Management
          {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-4 font-black uppercase tracking-widest text-xs transition-all relative flex items-center gap-2 ${
            activeTab === 'requests' ? 'text-accent' : 'text-gray-500 hover:text-white'
          }`}
        >
          Partner Applications
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[9px] bg-danger text-white rounded-full font-black animate-pulse select-none">
              {unreadCount}
            </span>
          )}
          {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="bg-secondary rounded-[2rem] border border-gray-800 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-2">
              <Users className="text-accent" /> User Directory
            </h3>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-primary border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">User</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Email</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Role</th>
                  <th className="text-right py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-accent font-bold animate-pulse">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500 font-bold">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-800/50 hover:bg-primary/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black border ${u.status === 'suspended' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-primary text-accent border-gray-800'}`}>
                            {u.name[0].toUpperCase()}
                          </div>
                          <span className={`font-bold ${u.status === 'suspended' ? 'text-gray-500 line-through' : 'text-white'}`}>{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-400 font-bold">{u.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-danger/10 text-danger'}`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
                          {getRoleIcon(u.role)}
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-transparent border-none text-white text-xs font-bold outline-none cursor-pointer appearance-none"
                          >
                            <option value="player" className="bg-primary">PLAYER</option>
                            <option value="owner" className="bg-primary">OWNER</option>
                            <option value="admin" className="bg-primary">SYSTEM ADMIN</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <button
                             onClick={() => handleStatusChange(u.id, u.status || 'active')}
                             title={u.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                             className={`p-2 rounded-lg transition-colors ${u.status === 'suspended' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-warning/10 text-warning hover:bg-warning hover:text-white'}`}
                           >
                             {u.status === 'suspended' ? <Power size={16} /> : <PowerOff size={16} />}
                           </button>
                           <button
                             onClick={() => handleDeleteUser(u.id)}
                             title="Delete Account"
                             className="p-2 bg-danger/10 text-danger rounded-lg hover:bg-danger hover:text-white transition-colors"
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-secondary rounded-[2rem] border border-gray-800 p-8">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-2">
              <ClipboardList className="text-accent" /> Pending Applications
            </h3>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-accent font-bold animate-pulse">
                Loading applications...
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-bold bg-primary rounded-2xl border border-gray-800 border-dashed">
                No partner applications found.
              </div>
            ) : (
              requests.map((r) => (
                <div key={r.id} className="bg-primary border border-gray-800 rounded-2xl p-6 hover:border-accent/30 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center border border-gray-800 text-accent">
                            <Store size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">{r.hallName}</h4>
                            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                              <MapPin size={10} /> {r.city}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          r.status === 'pending' ? 'bg-warning/10 text-warning' :
                          r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                          'bg-danger/10 text-danger'
                        }`}>
                          {r.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-800/50">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-500" />
                          <span className="text-sm font-bold text-gray-300">{r.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-500" />
                          <span className="text-sm font-bold text-gray-300">{r.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-500" />
                          <span className="text-sm font-bold text-gray-300">{r.phone}</span>
                        </div>
                      </div>

                      {r.message && (
                        <div 
                          onClick={() => handleMarkAsRead(r.id)}
                          className={`rounded-xl p-4 border transition-colors cursor-pointer ${
                            !readMessages.includes(r.id) 
                              ? 'bg-accent/5 border-accent/30 hover:bg-accent/10 shadow-[0_0_15px_rgba(0,255,136,0.05)]' 
                              : 'bg-secondary/50 border-gray-800/50 hover:bg-secondary/70'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-xs text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 select-none">
                              Message 
                              {!readMessages.includes(r.id) && (
                                <span className="bg-accent text-primary text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse normal-case tracking-normal">New</span>
                              )}
                            </p>
                            <span className="text-[10px] text-gray-500 font-bold select-none">
                              {formatTimeAgo(r.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 font-medium italic">"{r.message}"</p>
                        </div>
                      )}
                      
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        Submitted on {new Date(r.createdAt).toLocaleDateString()} at {new Date(r.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    {r.status === 'pending' && (
                      <div className="flex flex-row md:flex-col gap-3 justify-center">
                        <button
                          onClick={() => handleRequestStatusUpdate(r.id, 'approved')}
                          className="flex-1 md:flex-none p-3 bg-emerald-500 text-primary rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2"
                        >
                          <Check size={18} /> Approve
                        </button>
                        <button
                          onClick={() => handleRequestStatusUpdate(r.id, 'rejected')}
                          className="flex-1 md:flex-none p-3 bg-danger/10 text-danger border border-danger/20 rounded-xl font-black uppercase text-xs hover:bg-danger hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <X size={18} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-secondary rounded-[2rem] border border-gray-800 p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6">
              Create New User
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Name</label>
                <input
                  required
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full bg-primary border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-primary border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Password</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full bg-primary border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-primary border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-accent appearance-none"
                >
                  <option value="player">Player</option>
                  <option value="owner">Hall Owner</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
              
              <div className="flex gap-4 pt-4 mt-8 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl font-black uppercase text-xs tracking-widest text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 py-3 rounded-xl font-black uppercase text-xs tracking-widest bg-accent text-primary hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminPage;
