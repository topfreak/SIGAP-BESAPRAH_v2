import React, { useState } from 'react';
import { 
  UserSquare2, 
  Search, 
  Mail, 
  CheckCircle2, 
  KeyRound, 
  UserPlus, 
  Edit3, 
  Trash2, 
  X, 
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MasterPegawaiPage() {
  const { pegawaiList, currentUser, addUser, updateUser, resetUserPassword, deleteUser } = useAuth();
  const [search, setSearch] = useState('');
  const [filterTim, setFilterTim] = useState('Semua');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states for Add User
  const [newUserData, setNewUserData] = useState({
    username: '',
    password: '',
    nama: '',
    nip_baru: '',
    nip_lama: '',
    pangkat_golongan: 'Penata Muda/III/a',
    jabatan: 'Statistisi Pertama',
    tim_kerja: 'Umum',
    role: 'pegawai',
    email: ''
  });

  // Form states for Reset Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassToggle, setShowPassToggle] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const isSuperadmin = currentUser?.role === 'superadmin';

  const showNotification = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const filtered = pegawaiList.filter(p => {
    if (filterTim !== 'Semua' && p.tim_kerja !== filterTim) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.nama.toLowerCase().includes(q) ||
        p.nip_baru.includes(q) ||
        (p.username && p.username.toLowerCase().includes(q)) ||
        p.jabatan.toLowerCase().includes(q) ||
        p.pangkat_golongan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle Add User Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newUserData.username.trim() || !newUserData.password || !newUserData.nama.trim() || !newUserData.nip_baru.trim()) {
      showNotification('error', 'Semua kolom bertanda * wajib diisi.');
      return;
    }

    if (newUserData.password.length < 6) {
      showNotification('error', 'Kata sandi minimal 6 karakter.');
      return;
    }

    const res = addUser(newUserData);
    if (res.success) {
      showNotification('success', res.message);
      setShowAddModal(false);
      setNewUserData({
        username: '',
        password: '',
        nama: '',
        nip_baru: '',
        nip_lama: '',
        pangkat_golongan: 'Penata Muda/III/a',
        jabatan: 'Statistisi Pertama',
        tim_kerja: 'Umum',
        role: 'pegawai',
        email: ''
      });
    } else {
      showNotification('error', res.message);
    }
  };

  // Handle Reset Password Submit
  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showNotification('error', 'Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification('error', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const res = resetUserPassword(selectedUser.nip_baru, newPassword);
    if (res.success) {
      showNotification('success', `Kata sandi untuk ${selectedUser.nama} (@${selectedUser.username}) berhasil diubah!`);
      setShowResetModal(false);
      setSelectedUser(null);
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showNotification('error', res.message);
    }
  };

  // Handle Edit User Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const res = updateUser(selectedUser.nip_baru, selectedUser);
    if (res.success) {
      showNotification('success', 'Data pegawai berhasil diperbarui.');
      setShowEditModal(false);
      setSelectedUser(null);
    } else {
      showNotification('error', res.message);
    }
  };

  // Handle Delete User
  const handleDeleteUser = (user) => {
    if (window.confirm(`Yakin ingin menghapus akun ${user.nama} (@${user.username})? Tindakan ini tidak dapat dibatalkan.`)) {
      const res = deleteUser(user.nip_baru);
      if (res.success) {
        showNotification('success', res.message);
      } else {
        showNotification('error', res.message);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-lg fixed top-20 right-6 z-50 animate-in slide-in-from-top duration-200 ${
          toast.type === 'success' 
            ? 'bg-emerald-600 text-white shadow-emerald-900/20' 
            : 'bg-rose-600 text-white shadow-rose-900/20'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="ml-4 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserSquare2 className="w-7 h-7 text-purple-700" />
            <span>Manajemen Pengguna & Pegawai BPS Sambas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data aparatur, username login, peran sistem, dan pengelolaan kata sandi
          </p>
        </div>

        {isSuperadmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-600/30 transition transform active:scale-98"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Akun Baru</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIP, username, atau jabatan..."
            className="w-full pl-9 pr-3 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs text-slate-800 placeholder-purple-400/80 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterTim}
            onChange={(e) => setFilterTim(e.target.value)}
            className="px-3.5 py-2 bg-purple-50/50 border border-purple-150 rounded-xl text-xs font-medium text-slate-700 focus:outline-none w-full sm:w-auto"
          >
            <option value="Semua">Semua Tim / Fungsi</option>
            <option value="Pimpinan">Pimpinan</option>
            <option value="Umum">Umum / Tata Usaha</option>
            <option value="Sosial">Statistik Sosial</option>
            <option value="Produksi">Statistik Produksi</option>
            <option value="Distribusi">Statistik Distribusi</option>
            <option value="Neraca">Nerwilis & Analisis</option>
            <option value="IPDS">IPDS & TI</option>
          </select>

          <span className="text-xs text-slate-500 font-semibold px-2">
            Total: {filtered.length} Akun
          </span>
        </div>
      </div>

      {/* Pegawai Cards / Table */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#2E1065] text-purple-100 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">No.</th>
                <th className="py-3 px-4">Pegawai & Username</th>
                <th className="py-3 px-4">NIP Baru / Lama</th>
                <th className="py-3 px-4">Pangkat & Golongan</th>
                <th className="py-3 px-4">Jabatan & Tim</th>
                <th className="py-3 px-4 text-center">Peran Sistem</th>
                <th className="py-3 px-4 text-center">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filtered.map((p, idx) => {
                const isCurrent = currentUser?.nip_baru === p.nip_baru;
                return (
                  <tr key={p.nip_baru} className={`hover:bg-purple-50/40 transition ${isCurrent ? 'bg-purple-50/60' : ''}`}>
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    
                    {/* Pegawai & Username */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{p.nama}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-purple-700 text-white font-bold px-1.5 py-0.2 rounded">Anda</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-purple-100 text-purple-900 font-mono font-semibold px-2 py-0.5 rounded border border-purple-200">
                          user: {p.username || '-'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-purple-400" />
                          {p.email}
                        </span>
                      </div>
                    </td>

                    {/* NIP */}
                    <td className="py-3 px-4 font-mono">
                      <div className="text-slate-800 font-semibold">{p.nip_baru}</div>
                      <div className="text-[10px] text-slate-400">{p.nip_lama || '-'}</div>
                    </td>

                    {/* Pangkat & Golongan */}
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {p.pangkat_golongan}
                    </td>

                    {/* Jabatan & Tim */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-semibold">{p.jabatan}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-purple-100/80 text-purple-800 font-bold text-[10px]">
                        {p.tim_kerja}
                      </span>
                    </td>

                    {/* Peran Sistem */}
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full uppercase text-[10px] font-extrabold border ${
                        p.role === 'superadmin' 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'bg-purple-100 text-purple-900 border-purple-200'
                      }`}>
                        {p.role}
                      </span>
                    </td>

                    {/* Aksi Superadmin (Tanpa One-Click Switch) */}
                    <td className="py-3 px-4 text-center">
                      {isSuperadmin ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Reset Password Button */}
                          <button
                            onClick={() => {
                              setSelectedUser(p);
                              setNewPassword('');
                              setConfirmPassword('');
                              setShowResetModal(true);
                            }}
                            title="Reset Password Akun Ini"
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User Button */}
                          <button
                            onClick={() => {
                              setSelectedUser({ ...p });
                              setShowEditModal(true);
                            }}
                            title="Edit Data Akun"
                            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User Button (not allowed on self) */}
                          {!isCurrent && (
                            <button
                              onClick={() => handleDeleteUser(p)}
                              title="Hapus Akun"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                          Aktif
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH AKUN BARU (SUPERADMIN ONLY) */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-purple-100 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Tambah Akun Pegawai Baru</h3>
                  <p className="text-[11px] text-slate-500">Buat kredensial login dan profil aparatur BPS</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Username */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Username Login <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUserData.username}
                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                    placeholder="Contoh: budi.santoso"
                    required
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                  />
                </div>

                {/* Password Awal */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kata Sandi Awal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    placeholder="Min. 6 karakter"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                  />
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUserData.nama}
                  onChange={(e) => setNewUserData({ ...newUserData, nama: e.target.value })}
                  placeholder="Contoh: Budi Santoso, S.Tr.Stat."
                  required
                  className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* NIP Baru */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIP Baru (18 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUserData.nip_baru}
                    onChange={(e) => setNewUserData({ ...newUserData, nip_baru: e.target.value })}
                    placeholder="Contoh: 199501012023011001"
                    required
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                  />
                </div>

                {/* NIP Lama */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP Lama</label>
                  <input
                    type="text"
                    value={newUserData.nip_lama}
                    onChange={(e) => setNewUserData({ ...newUserData, nip_lama: e.target.value })}
                    placeholder="Opsional"
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pangkat & Golongan */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pangkat & Golongan</label>
                  <input
                    type="text"
                    value={newUserData.pangkat_golongan}
                    onChange={(e) => setNewUserData({ ...newUserData, pangkat_golongan: e.target.value })}
                    placeholder="Penata Muda/III/a"
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* Jabatan */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={newUserData.jabatan}
                    onChange={(e) => setNewUserData({ ...newUserData, jabatan: e.target.value })}
                    placeholder="Statistisi Pertama"
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tim Kerja */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tim Kerja</label>
                  <select
                    value={newUserData.tim_kerja}
                    onChange={(e) => setNewUserData({ ...newUserData, tim_kerja: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                  >
                    <option value="Umum">Umum / Tata Usaha</option>
                    <option value="Sosial">Statistik Sosial</option>
                    <option value="Produksi">Statistik Produksi</option>
                    <option value="Distribusi">Statistik Distribusi</option>
                    <option value="Neraca">Nerwilis & Analisis</option>
                    <option value="IPDS">IPDS & TI</option>
                    <option value="Pimpinan">Pimpinan</option>
                  </select>
                </div>

                {/* Peran Sistem */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peran Akses (RBAC)</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                  >
                    <option value="pegawai">Pegawai / Staf Biasa</option>
                    <option value="pj_kegiatan">PJ Kegiatan</option>
                    <option value="verifikator">Verifikator</option>
                    <option value="bendahara">Bendahara Pengeluaran</option>
                    <option value="ppk">Pejabat Pembuat Komitmen (PPK)</option>
                    <option value="ppspm">Pejabat Penandatangan SPM (PPSPM)</option>
                    <option value="kpa">Kuasa Pengguna Anggaran (KPA)</option>
                    <option value="superadmin">Superadmin (Akses Penuh)</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Resmi (Opsional)</label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="budi.santoso@bps.go.id"
                  className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md shadow-purple-700/20"
                >
                  Simpan & Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RESET PASSWORD PENGGUNA (SUPERADMIN ONLY) */}
      {/* ========================================================================= */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-purple-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Reset Kata Sandi Pengguna</h3>
                  <p className="text-[11px] text-slate-500">Ubah kata sandi akun jika pegawai lupa password</p>
                </div>
              </div>
              <button
                onClick={() => { setShowResetModal(false); setSelectedUser(null); }}
                className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs">
              <div className="font-bold text-purple-950">{selectedUser.nama}</div>
              <div className="text-purple-700 font-mono text-[11px] mt-0.5">
                Username: <span className="font-bold">@{selectedUser.username}</span> | NIP: {selectedUser.nip_baru}
              </div>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassToggle ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassToggle(!showPassToggle)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  >
                    {showPassToggle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showPassToggle ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => { setShowResetModal(false); setSelectedUser(null); }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20"
                >
                  Setel Ulang Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT DATA PENGGUNA (SUPERADMIN ONLY) */}
      {/* ========================================================================= */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-purple-100 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Profil & Peran Pegawai</h3>
                  <p className="text-[11px] text-slate-500">Perbarui data aparatur atau ubah peran sistem</p>
                </div>
              </div>
              <button
                onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={selectedUser.nama}
                  onChange={(e) => setSelectedUser({ ...selectedUser, nama: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username Login</label>
                  <input
                    type="text"
                    value={selectedUser.username || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={selectedUser.email || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pangkat & Golongan</label>
                  <input
                    type="text"
                    value={selectedUser.pangkat_golongan || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, pangkat_golongan: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={selectedUser.jabatan || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, jabatan: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tim Kerja</label>
                  <select
                    value={selectedUser.tim_kerja || 'Umum'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, tim_kerja: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                  >
                    <option value="Umum">Umum / Tata Usaha</option>
                    <option value="Sosial">Statistik Sosial</option>
                    <option value="Produksi">Statistik Produksi</option>
                    <option value="Distribusi">Statistik Distribusi</option>
                    <option value="Neraca">Nerwilis & Analisis</option>
                    <option value="IPDS">IPDS & TI</option>
                    <option value="Pimpinan">Pimpinan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peran Akses (RBAC)</label>
                  <select
                    value={selectedUser.role || 'pegawai'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                  >
                    <option value="pegawai">Pegawai / Staf Biasa</option>
                    <option value="pj_kegiatan">PJ Kegiatan</option>
                    <option value="verifikator">Verifikator</option>
                    <option value="bendahara">Bendahara Pengeluaran</option>
                    <option value="ppk">Pejabat Pembuat Komitmen (PPK)</option>
                    <option value="ppspm">Pejabat Penandatangan SPM (PPSPM)</option>
                    <option value="kpa">Kuasa Pengguna Anggaran (KPA)</option>
                    <option value="superadmin">Superadmin (Akses Penuh)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md shadow-purple-700/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
