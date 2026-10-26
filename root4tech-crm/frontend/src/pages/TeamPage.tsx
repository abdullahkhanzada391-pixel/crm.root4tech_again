import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, UserAccount } from '@/types/crm';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  Clock,
  Briefcase,
  Shield,
  ShieldCheck,
  Lock,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Table as TableIcon,
  BadgePercent,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  CheckCheck,
  Layers,
  Code2,
  Send,
  RefreshCw,
  Power,
  KeyRound
} from 'lucide-react';
import {
  ROLE_DEFINITIONS,
  getRoleConfig,
  getRoleDefaultRoute,
  generateSecureTempPassword
} from '@/utils/roleConfig';

export const TeamPage: React.FC = () => {
  const {
    users,
    addUser,
    updateUserProfile,
    updateUserPassword,
    deleteUser,
    toggleUserStatus,
    user: currentUser
  } = useAuth();
  const navigate = useNavigate();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'sales' | 'marketing' | 'developer' | 'hr' | 'admin' | 'custom'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [passwordModalUser, setPasswordModalUser] = useState<UserAccount | null>(null);
  const [inviteModalUser, setInviteModalUser] = useState<UserAccount | null>(null);
  const [provisionedSuccessUser, setProvisionedSuccessUser] = useState<UserAccount | null>(null);

  // Add Form State
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addRoleCategory, setAddRoleCategory] = useState<UserRole>('sales');
  const [addRoleTitle, setAddRoleTitle] = useState('Senior Sales Executive');
  const [addDepartment, setAddDepartment] = useState('Business Development & Sales');
  const [addShift, setAddShift] = useState('10:00 AM – 06:00 PM');
  const [addPortalRoute, setAddPortalRoute] = useState<string>('/salesperson');
  const [addSalary, setAddSalary] = useState<string>('85000');
  const [addPassword, setAddPassword] = useState('team123');
  const [addStatus, setAddStatus] = useState<'Active' | 'Inactive'>('Active');
  const [addAvatarUrl, setAddAvatarUrl] = useState('');

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRoleCategory, setEditRoleCategory] = useState<UserRole>('sales');
  const [editRoleTitle, setEditRoleTitle] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editShift, setEditShift] = useState('');
  const [editPortalRoute, setEditPortalRoute] = useState('/salesperson');
  const [editSalary, setEditSalary] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Onboarding' | 'On Leave' | 'Inactive'>('Active');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  // Change Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Copy feedback
  const [hasCopiedInvite, setHasCopiedInvite] = useState(false);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Preset role change handler
  const handleRoleCategoryChange = (roleKey: UserRole) => {
    setAddRoleCategory(roleKey);
    const cfg = getRoleConfig(roleKey);
    setAddRoleTitle(cfg.defaultTitle);
    setAddDepartment(cfg.defaultDepartment);
    setAddShift(cfg.shift);
    setAddPortalRoute(cfg.defaultRoute);
    setAddSalary(String(cfg.defaultSalary));
  };

  // Edit role change handler
  const handleEditRoleCategoryChange = (roleKey: UserRole) => {
    setEditRoleCategory(roleKey);
    const cfg = getRoleConfig(roleKey);
    setEditRoleTitle(cfg.defaultTitle);
    setEditDepartment(cfg.defaultDepartment);
    setEditPortalRoute(cfg.defaultRoute);
  };

  // Open Edit Modal with user data
  const openEditModal = (u: UserAccount) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPhone(u.phone || '');
    setEditRoleCategory(u.role);
    setEditRoleTitle(u.roleTitle);
    setEditDepartment(u.department);
    setEditShift(u.shift || 'Full Time');
    setEditPortalRoute(u.defaultRoute || getRoleDefaultRoute(u.role));
    setEditSalary(u.salary ? String(u.salary) : '');
    setEditStatus(u.status || 'Active');
    setEditAvatarUrl(u.avatarUrl || '');
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editName.trim() || !editEmail.trim()) {
      alert('Name and Email are required.');
      return;
    }

    const initials = editName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'TM';

    const finalRoute = editPortalRoute || getRoleDefaultRoute(editRoleCategory);

    updateUserProfile(editingUser.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      role: editRoleCategory,
      roleTitle: editRoleTitle.trim() || getRoleConfig(editRoleCategory).defaultTitle,
      department: editDepartment.trim() || getRoleConfig(editRoleCategory).defaultDepartment,
      shift: editShift.trim(),
      defaultRoute: finalRoute,
      salary: editSalary ? Number(editSalary) : undefined,
      status: editStatus,
      avatarUrl: editAvatarUrl.trim() || undefined,
      avatarInitials: initials
    });

    setEditingUser(null);
    showToast(`Teammate "${editName}" updated with assigned dashboard: ${finalRoute}`);
  };

  // Create New Teammate with Automatic Dashboard Provisioning
  const handleCreateTeammate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim() || !addPassword.trim()) {
      alert('Please fill out Name, Email, and Password.');
      return;
    }

    // Check if email already exists
    const emailExists = users.some(u => u.email.toLowerCase() === addEmail.trim().toLowerCase());
    if (emailExists) {
      alert('A team member with this work email already exists.');
      return;
    }

    const initials = addName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'TM';

    const cfg = getRoleConfig(addRoleCategory);
    const assignedRoute = addPortalRoute || cfg.defaultRoute;
    const finalTitle = addRoleTitle.trim() || cfg.defaultTitle;
    const finalDept = addDepartment.trim() || cfg.defaultDepartment;

    const newUserPayload: Omit<UserAccount, 'id'> = {
      name: addName.trim(),
      email: addEmail.trim(),
      phone: addPhone.trim(),
      role: addRoleCategory,
      roleTitle: finalTitle,
      department: finalDept,
      shift: addShift.trim() || cfg.shift,
      password: addPassword.trim(),
      defaultRoute: assignedRoute,
      salary: addSalary ? Number(addSalary) : cfg.defaultSalary,
      status: addStatus,
      avatarUrl: addAvatarUrl.trim() || undefined,
      joinDate: new Date().toISOString().split('T')[0],
      avatarInitials: initials
    };

    addUser(newUserPayload);

    // Save for provisioned success modal display
    const createdAccount: UserAccount = {
      ...newUserPayload,
      id: `usr-${Date.now()}`
    };

    setIsAddModalOpen(false);
    setProvisionedSuccessUser(createdAccount);
    showToast(`🎉 New teammate "${addName}" added with automatic ${addRoleCategory} dashboard!`);

    // Reset fields
    setAddName('');
    setAddEmail('');
    setAddPhone('');
    setAddAvatarUrl('');
    setAddRoleCategory('sales');
    const defaultSalesCfg = getRoleConfig('sales');
    setAddRoleTitle(defaultSalesCfg.defaultTitle);
    setAddDepartment(defaultSalesCfg.defaultDepartment);
    setAddShift(defaultSalesCfg.shift);
    setAddSalary(String(defaultSalesCfg.defaultSalary));
    setAddPassword('team123');
    setAddStatus('Active');
  };

  // Change Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!passwordModalUser) return;

    if (!newPassword || newPassword.trim().length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    const ok = updateUserPassword(passwordModalUser.id, newPassword);
    if (ok) {
      showToast(`Password for ${passwordModalUser.name} updated successfully.`);
      setPasswordModalUser(null);
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError('Could not update password.');
    }
  };

  // Copy Invitation Message
  const handleCopyInviteMessage = (member: UserAccount) => {
    const inviteText = `===========================================
ROOT 4 TECH CRM - PORTAL INVITATION
===========================================
Hello ${member.name},

You have been provisioned on the Root 4 Tech CRM platform!
Your dedicated role dashboard is ready for you to access.

- Assigned Role: ${member.roleTitle} (${member.role.toUpperCase()})
- Department:    ${member.department}
- Dashboard:     ${window.location.origin}${member.defaultRoute}

LOGIN CREDENTIALS:
- Email:    ${member.email}
- Password: ${member.password}

Please sign in at: ${window.location.origin}/login
===========================================`;

    navigator.clipboard.writeText(inviteText);
    setHasCopiedInvite(true);
    showToast(`Copied invitation & credentials for ${member.name} to clipboard!`);
    setTimeout(() => setHasCopiedInvite(false), 2500);
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    if (selectedRoleFilter !== 'all') {
      if (selectedRoleFilter === 'sales' && u.role !== 'sales') return false;
      if (selectedRoleFilter === 'marketing' && u.role !== 'marketing') return false;
      if (selectedRoleFilter === 'developer' && u.role !== 'developer') return false;
      if (selectedRoleFilter === 'hr' && u.role !== 'hr') return false;
      if (selectedRoleFilter === 'admin' && u.role !== 'admin') return false;
      if (selectedRoleFilter === 'custom' && (u.role === 'sales' || u.role === 'marketing' || u.role === 'developer' || u.role === 'hr' || u.role === 'admin')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchTitle = u.roleTitle.toLowerCase().includes(q);
      const matchDept = u.department.toLowerCase().includes(q);
      const matchPhone = u.phone ? u.phone.toLowerCase().includes(q) : false;
      return matchName || matchEmail || matchTitle || matchDept || matchPhone;
    }

    return true;
  });

  // Role Counts
  const salesCount = users.filter(u => u.role === 'sales').length;
  const marketingCount = users.filter(u => u.role === 'marketing').length;
  const devCount = users.filter(u => u.role === 'developer').length;
  const hrCount = users.filter(u => u.role === 'hr').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const customCount = users.filter(u => !['sales', 'marketing', 'developer', 'hr', 'admin'].includes(u.role)).length;

  return (
    <div className="space-y-6 max-w-7xl pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Team Members & Dynamic Roles</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold border border-blue-200">
                  {users.length} Total Teammates
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically generate role-based dashboards for Sales Executives, Marketing Managers, Developers, HR & Custom Roles
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Team Member</span>
        </button>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Roster */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Roster
          </span>
          <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
            {users.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            {users.filter(u => u.status !== 'Inactive').length} Active
          </span>
        </div>

        {/* Sales */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
            Sales ({salesCount})
          </span>
          <div className="text-xl font-black text-blue-600 font-mono mt-0.5">
            {salesCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
            /salesperson
          </span>
        </div>

        {/* Marketing */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
            Marketing ({marketingCount})
          </span>
          <div className="text-xl font-black text-purple-600 font-mono mt-0.5">
            {marketingCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
            /marketing
          </span>
        </div>

        {/* Developers */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider block">
            Devs ({devCount})
          </span>
          <div className="text-xl font-black text-cyan-600 font-mono mt-0.5">
            {devCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
            /developer
          </span>
        </div>

        {/* HR */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            HR ({hrCount})
          </span>
          <div className="text-xl font-black text-rose-600 font-mono mt-0.5">
            {hrCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
            /hr
          </span>
        </div>

        {/* Admins & Custom */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Admin ({adminCount})
          </span>
          <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">
            {adminCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
            Executive CRM
          </span>
        </div>
      </div>

      {/* 3. Search and Role Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search teammate by name, email, role, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Filter Pills & View Mode */}
        <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setSelectedRoleFilter('all')}
              className={`px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                selectedRoleFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setSelectedRoleFilter('sales')}
              className={`px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                selectedRoleFilter === 'sales'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Sales ({salesCount})
            </button>
            <button
              onClick={() => setSelectedRoleFilter('marketing')}
              className={`px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                selectedRoleFilter === 'marketing'
                  ? 'bg-purple-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              Marketing ({marketingCount})
            </button>
            <button
              onClick={() => setSelectedRoleFilter('developer')}
              className={`px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                selectedRoleFilter === 'developer'
                  ? 'bg-cyan-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-cyan-700'
              }`}
            >
              Devs ({devCount})
            </button>
            <button
              onClick={() => setSelectedRoleFilter('hr')}
              className={`px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                selectedRoleFilter === 'hr'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              HR ({hrCount})
            </button>
            <button
              onClick={() => setSelectedRoleFilter('admin')}
              className={`px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                selectedRoleFilter === 'admin'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Admin ({adminCount})
            </button>
          </div>

          {/* Grid vs Table toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. TEAM MEMBERS ROSTER DISPLAY (GRID OR TABLE) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(u => {
            const cfg = getRoleConfig(u.role);
            const isSelf = currentUser?.id === u.id;
            const isInactive = u.status === 'Inactive';

            return (
              <div
                key={u.id}
                className={`p-5 rounded-2xl bg-white border transition-all duration-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-lg ${
                  isInactive
                    ? 'border-slate-200 bg-slate-50/70 opacity-80'
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Header: Avatar + Name + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cfg.accentGradient} text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0`}>
                        {u.avatarInitials || 'TM'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.role === 'admin' && (
                            <ShieldCheck className="w-4 h-4 text-emerald-500 inline shrink-0" />
                          )}
                        </h3>
                        <p className="text-xs text-slate-600 truncate font-medium">
                          {u.roleTitle}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                        isInactive
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {u.status || 'Active'}
                    </span>
                  </div>

                  {/* Role & Department Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                      {u.department}
                    </span>
                  </div>

                  {/* Contact Info & Meta */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    {u.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{u.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Shift: {u.shift || 'Full Time'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px] text-blue-600 font-semibold truncate">
                        {u.defaultRoute || cfg.defaultRoute}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Compensation:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {u.salary ? `PKR ${u.salary.toLocaleString()}/mo` : 'Confidential'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1 pt-1">
                    {/* Preview Dashboard */}
                    <button
                      onClick={() => navigate(u.defaultRoute || cfg.defaultRoute)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1"
                      title="Preview this teammate's role dashboard"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    {/* Invite / Credentials */}
                    <button
                      onClick={() => setInviteModalUser(u)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1"
                      title="View credentials & copy invitation"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Invite</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit Teammate"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Active / Inactive */}
                    <button
                      onClick={() => {
                        toggleUserStatus(u.id);
                        showToast(`Status toggled for ${u.name}`);
                      }}
                      className={`p-1.5 rounded-lg transition ${
                        isInactive
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title={isInactive ? 'Activate account' : 'Deactivate account'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete (if not self) */}
                    {!isSelf && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete teammate "${u.name}"?`)) {
                            deleteUser(u.id);
                            showToast(`Teammate "${u.name}" removed.`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Teammate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Teammate</th>
                  <th className="py-3 px-4 font-semibold">Role & Department</th>
                  <th className="py-3 px-4 font-semibold">Assigned Dashboard</th>
                  <th className="py-3 px-4 font-semibold">Shift Hours</th>
                  <th className="py-3 px-4 font-semibold">Salary</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => {
                  const cfg = getRoleConfig(u.role);
                  const isInactive = u.status === 'Inactive';
                  const isSelf = currentUser?.id === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${cfg.accentGradient} text-white font-bold text-xs flex items-center justify-center`}>
                            {u.avatarInitials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">{u.department}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-blue-600 font-semibold">
                        {u.defaultRoute || cfg.defaultRoute}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {u.shift || 'Full Time'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-slate-900">
                        {u.salary ? `PKR ${u.salary.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isInactive
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(u.defaultRoute || cfg.defaultRoute)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Preview Dashboard"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setInviteModalUser(u)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                            title="Copy Invitation"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                            title="Edit Teammate"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                            title="Toggle Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          {!isSelf && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${u.name}?`)) deleteUser(u.id);
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Delete Teammate"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* 5. ADD TEAM MEMBER MODAL WITH DYNAMIC ROLE ASSIGNMENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Add New Team Member</h3>
                  <p className="text-[11px] text-blue-100">
                    System will automatically provision their account & generate their role dashboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTeammate} className="p-6 space-y-4">
              {/* Role Category Selector with rich visual cards */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Role & Automatic Dashboard Template *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'sales', label: 'Sales Executive', icon: '🎯', route: '/salesperson', desc: 'Leads, Clients, Deals' },
                    { key: 'marketing', label: 'Marketing Manager', icon: '🚀', route: '/marketing', desc: 'Campaigns, Strategy' },
                    { key: 'developer', label: 'Developer', icon: '💻', route: '/developer', desc: 'Projects, Tasks, Git' },
                    { key: 'hr', label: 'HR Manager', icon: '👥', route: '/hr', desc: 'Roster, Attendance, Tasks' },
                    { key: 'admin', label: 'Administrator', icon: '🛡️', route: '/dashboard', desc: 'Executive Master CRM' },
                    { key: 'custom', label: 'Custom Operations', icon: '✨', route: '/portal', desc: 'Dynamic Workspace' }
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => handleRoleCategoryChange(r.key as UserRole)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        addRoleCategory === r.key
                          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-base">{r.icon}</div>
                      <div className="font-bold text-xs text-slate-900 mt-0.5">{r.label}</div>
                      <div className="text-[10px] text-blue-600 font-mono font-semibold truncate">{r.route}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={addName}
                    onChange={e => setAddName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Title / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Engineer"
                    value={addRoleTitle}
                    onChange={e => setAddRoleTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@root4tech.com"
                    value={addEmail}
                    onChange={e => setAddEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +92 300 1234567"
                    value={addPhone}
                    onChange={e => setAddPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Department & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={addDepartment}
                    onChange={e => setAddDepartment(e.target.value)}
                    placeholder="e.g. Software Engineering & IT"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shift Working Hours
                  </label>
                  <input
                    type="text"
                    value={addShift}
                    onChange={e => setAddShift(e.target.value)}
                    placeholder="e.g. 11:00 AM – 07:00 PM"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Assigned Dashboard Route & Monthly Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Dashboard Route (Auto-Configured)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={addPortalRoute}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono text-blue-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Base Salary (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 110000"
                    value={addSalary}
                    onChange={e => setAddSalary(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Password & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Login Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setAddPassword(generateSecureTempPassword(addName || 'user'))}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Randomize</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={addPassword}
                    onChange={e => setAddPassword(e.target.value)}
                    placeholder="e.g. dev123"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={addStatus}
                    onChange={e => setAddStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active (Immediate Login Access)</option>
                    <option value="Inactive">Inactive (Suspended / Onboarding)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-xs transition"
                >
                  Confirm & Provision Teammate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. PROVISIONED SUCCESS MODAL */}
      {provisionedSuccessUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Dashboard Automatically Created!</h3>
                <p className="text-xs text-slate-500">Account provisioned with dedicated role portal</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Teammate:</span>
                <span className="font-bold text-slate-900">{provisionedSuccessUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role & Title:</span>
                <span className="font-semibold text-slate-800">{provisionedSuccessUser.roleTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Dashboard:</span>
                <span className="font-mono text-blue-600 font-bold">{provisionedSuccessUser.defaultRoute}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Login Email:</span>
                <span className="font-mono text-slate-900">{provisionedSuccessUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password:</span>
                <span className="font-mono text-emerald-600 font-bold">{provisionedSuccessUser.password}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyInviteMessage(provisionedSuccessUser)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                {hasCopiedInvite ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedInvite ? 'Copied Invitation!' : 'Copy Invitation Message'}</span>
              </button>

              <button
                onClick={() => {
                  const targetRoute = provisionedSuccessUser.defaultRoute;
                  setProvisionedSuccessUser(null);
                  navigate(targetRoute);
                }}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Open Dashboard</span>
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setProvisionedSuccessUser(null)}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. INVITE / CREDENTIALS MODAL */}
      {inviteModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Account Credentials & Invitation</h3>
                  <p className="text-[11px] text-slate-500">{inviteModalUser.name}</p>
                </div>
              </div>
              <button onClick={() => setInviteModalUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-900">{inviteModalUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Password:</span>
                <span className="font-mono text-slate-900 font-bold">{inviteModalUser.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Dashboard:</span>
                <span className="font-mono text-blue-600">{inviteModalUser.defaultRoute}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold text-slate-900 capitalize">{inviteModalUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600">{inviteModalUser.status || 'Active'}</span>
              </div>
            </div>

            <button
              onClick={() => handleCopyInviteMessage(inviteModalUser)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
            >
              {hasCopiedInvite ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{hasCopiedInvite ? 'Copied Invitation Text!' : 'Copy Full Invitation Text'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. EDIT TEAM MEMBER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Edit Teammate Profile & Role</h3>
                  <p className="text-[11px] text-slate-400">
                    Changing role will automatically re-assign dashboard and permissions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  System Role (Automatically re-assigns dashboard) *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'sales', label: 'Sales Executive', icon: '🎯' },
                    { key: 'marketing', label: 'Marketing Manager', icon: '🚀' },
                    { key: 'developer', label: 'Developer', icon: '💻' },
                    { key: 'hr', label: 'HR Manager', icon: '👥' },
                    { key: 'admin', label: 'Administrator', icon: '🛡️' },
                    { key: 'custom', label: 'Custom Operations', icon: '✨' }
                  ].map(r => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => handleEditRoleCategoryChange(r.key as UserRole)}
                      className={`p-2 rounded-xl border text-left transition ${
                        editRoleCategory === r.key
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20 font-bold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm mr-1">{r.icon}</span>
                      <span className="text-xs">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Designation *</label>
                  <input
                    type="text"
                    required
                    value={editRoleTitle}
                    onChange={e => setEditRoleTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={e => setEditDepartment(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Working Shift</label>
                  <input
                    type="text"
                    value={editShift}
                    onChange={e => setEditShift(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Route</label>
                  <input
                    type="text"
                    readOnly
                    value={editPortalRoute}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono text-blue-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
