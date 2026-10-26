import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Briefcase,
  Phone,
  Mail,
  ShieldCheck,
  Building2,
  CheckSquare,
  Square,
  Trash2,
  Sparkles,
  DollarSign,
  UserCheck,
  ChevronRight,
  LogOut,
  X,
  Eye,
  FileText,
  BadgePercent
} from 'lucide-react';
import { Root4TechLogo } from '@/components/common/Root4TechLogo';
import { INITIAL_HR_TASKS, INITIAL_HR_ATTENDANCE } from '@/data/mockData';
import { HRTask, HRAttendanceRecord, UserAccount, UserRole } from '@/types/crm';
import { getRoleConfig, getRoleDefaultRoute } from '@/utils/roleConfig';

const HR_TASKS_STORAGE_KEY = 'root4tech_crm_hr_tasks';

export const HRDashboardPage: React.FC = () => {
  const { user, users, addUser, toggleUserStatus, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'roster' | 'attendance' | 'tasks' | 'departments'>('roster');

  // Live Clock
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Attendance punch for HR
  const [isHrClockedIn, setIsHrClockedIn] = useState(true);
  const [hrClockInTime, setHrClockInTime] = useState<string | null>('08:58 AM');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Tasks State
  const [tasks, setTasks] = useState<HRTask[]>(() => {
    const saved = localStorage.getItem(HR_TASKS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_HR_TASKS;
      }
    }
    return INITIAL_HR_TASKS;
  });

  useEffect(() => {
    localStorage.setItem(HR_TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<HRAttendanceRecord[]>(INITIAL_HR_ATTENDANCE);

  // Modals
  const [selectedEmployee, setSelectedEmployee] = useState<UserAccount | null>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Add Employee Form State
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addRole, setAddRole] = useState<UserRole>('developer');
  const [addTitle, setAddTitle] = useState('Full-Stack Software Engineer');
  const [addDepartment, setAddDepartment] = useState('Software Engineering & IT');
  const [addShift, setAddShift] = useState('11:00 AM – 07:00 PM');
  const [addSalary, setAddSalary] = useState('110000');
  const [addPassword, setAddPassword] = useState('team123');

  // Add Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<HRTask['category']>('Payroll');
  const [newTaskPriority, setNewTaskPriority] = useState<HRTask['priority']>('High');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2025-11-05');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSelectionChange = (newRole: UserRole) => {
    setAddRole(newRole);
    const cfg = getRoleConfig(newRole);
    setAddTitle(cfg.defaultTitle);
    setAddDepartment(cfg.defaultDepartment);
    setAddShift(cfg.shift);
    setAddSalary(String(cfg.defaultSalary));
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim() || !addPassword.trim()) {
      alert('Please fill in Name, Email, and Password.');
      return;
    }

    const initials = addName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'TM';

    const defaultRoute = getRoleDefaultRoute(addRole);

    addUser({
      name: addName.trim(),
      email: addEmail.trim(),
      phone: addPhone.trim(),
      role: addRole,
      roleTitle: addTitle.trim() || getRoleConfig(addRole).defaultTitle,
      department: addDepartment.trim() || getRoleConfig(addRole).defaultDepartment,
      shift: addShift.trim(),
      salary: addSalary ? Number(addSalary) : undefined,
      password: addPassword.trim(),
      defaultRoute,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      avatarInitials: initials
    });

    setIsAddEmployeeOpen(false);
    showToast(`🎉 New teammate "${addName}" added with automatic ${addRole} dashboard access!`);

    // Reset Form
    setAddName('');
    setAddEmail('');
    setAddPhone('');
    setAddPassword('team123');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title.');
      return;
    }

    const newTask: HRTask = {
      id: `hr-task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      completed: false
    };

    setTasks(prev => [newTask, ...prev]);
    setIsAddTaskOpen(false);
    setNewTaskTitle('');
    showToast('New HR operational task created.');
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task removed.');
  };

  // Metrics
  const activeEmployeesCount = users.filter(u => u.status !== 'Inactive').length;
  const inactiveEmployeesCount = users.filter(u => u.status === 'Inactive').length;
  const completedTasksCount = tasks.filter(t => t.completed).length;

  // Filtered Roster
  const filteredUsers = users.filter(u => {
    if (statusFilter === 'Active' && u.status === 'Inactive') return false;
    if (statusFilter === 'Inactive' && u.status !== 'Inactive') return false;
    if (departmentFilter !== 'All' && u.department !== departmentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.roleTitle.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Unique Departments
  const departments = Array.from(new Set(users.map(u => u.department).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Root4TechLogo size="md" showText={true} subtitle="Human Resources & Talent Operations" variant="color" />
        </div>

        {/* Right Info Pills */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Shift: <strong>09:00 AM – 05:00 PM</strong></span>
          </div>

          <div className="hidden sm:block text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            {currentTime}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.avatarInitials || 'HR'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900">{user?.name || 'HR Manager'}</div>
              <div className="text-[10px] text-slate-500">{user?.roleTitle || 'People Operations Lead'}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Toast Feedback */}
        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 3. KEY METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Company Roster
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                {users.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                {activeEmployeesCount} Active Teammates
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                Present Today
              </span>
              <div className="text-2xl font-black text-rose-600 font-mono mt-0.5">
                {attendanceRecords.length}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                100% Shift Attendance
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
                Departments
              </span>
              <div className="text-2xl font-black text-purple-600 font-mono mt-0.5">
                {departments.length}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Cross-Functional Teams
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                HR Tasks Due
              </span>
              <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">
                {tasks.length - completedTasksCount}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {completedTasksCount} of {tasks.length} Completed
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 4. NAVIGATION TABS & ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'roster'
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Members ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Shift Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Assigned HR Tasks ({tasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('departments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'departments'
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Department Distribution</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Employee</span>
          </button>
        </div>

        {/* TAB 1: TEAM MEMBERS ROSTER */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search employees by name, email, department..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={departmentFilter}
                  onChange={e => setDepartmentFilter(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="All">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            {/* Employee Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map(emp => {
                const cfg = getRoleConfig(emp.role);
                return (
                  <div
                    key={emp.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Avatar & Role Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${cfg.accentGradient} text-white font-black text-sm flex items-center justify-center shadow-xs`}>
                            {emp.avatarInitials || 'TM'}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{emp.name}</span>
                              {emp.role === 'admin' && (
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline" />
                              )}
                            </h3>
                            <p className="text-xs text-slate-600 font-medium">{emp.roleTitle}</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            emp.status === 'Inactive'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {emp.status || 'Active'}
                        </span>
                      </div>

                      {/* Role & Department Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {emp.department}
                        </span>
                      </div>

                      {/* Contact & Meta */}
                      <div className="space-y-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{emp.email}</span>
                        </div>
                        {emp.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{emp.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Shift: {emp.shift || '10:00 AM – 06:00 PM'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {emp.salary ? `PKR ${emp.salary.toLocaleString()}/mo` : 'Confidential'}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => {
                            toggleUserStatus(emp.id);
                            showToast(`Status updated for ${emp.name}`);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                            emp.status === 'Inactive'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {emp.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SHIFT ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-rose-600" />
                  <span>Daily Shift Attendance Roster</span>
                </h3>
                <p className="text-xs text-slate-500">Live attendance status across all company shifts</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                  Today: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Department & Role</th>
                    <th className="py-3 px-4">Assigned Shift</th>
                    <th className="py-3 px-4">Clock In</th>
                    <th className="py-3 px-4">Hours Logged</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceRecords.map(att => (
                    <tr key={att.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {att.userName}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{att.department}</div>
                        <div className="text-[10px] text-slate-500">{att.role}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {att.shift}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                        {att.clockIn}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {att.hoursLogged}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNED HR TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assigned People & Compliance Tasks</h3>
                <p className="text-xs text-slate-500">Track onboarding, payroll review, and performance checks</p>
              </div>

              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add HR Task</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.map(t => (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl bg-white border transition flex items-start justify-between gap-3 ${
                    t.completed ? 'border-slate-200 bg-slate-50/60 opacity-70' : 'border-slate-200 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className="mt-0.5 text-slate-400 hover:text-rose-600 transition"
                    >
                      {t.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${t.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {t.title}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {t.category}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {t.priority}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span>Due Date: {t.dueDate}</span>
                        {t.notes && <span>• {t.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DEPARTMENT DISTRIBUTION */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(dept => {
              const members = users.filter(u => u.department === dept);
              const totalDeptPayroll = members.reduce((acc, m) => acc + (m.salary || 0), 0);

              return (
                <div key={dept} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{dept}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{members.length} Team Members</p>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                      {members.length}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {members.map(m => (
                      <div key={m.id} className="flex items-center justify-between text-xs py-1">
                        <span className="font-semibold text-slate-800">{m.name}</span>
                        <span className="text-[10px] text-slate-500">{m.roleTitle}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Monthly Payroll:</span>
                    <span className="font-mono font-bold text-slate-900">PKR {totalDeptPayroll.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. ADD EMPLOYEE MODAL */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gradient-to-r from-rose-600 via-rose-600 to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Add New Team Member & Assign Dashboard</h3>
                  <p className="text-[11px] text-rose-100">
                    System automatically provisions user account & role-based dashboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEmployeeOpen(false)}
                className="p-1 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-6 space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Role & Automatic Dashboard *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { role: 'sales', label: 'Sales Executive', icon: '🎯', route: '/salesperson' },
                    { role: 'marketing', label: 'Marketing Manager', icon: '🚀', route: '/marketing' },
                    { role: 'developer', label: 'Developer', icon: '💻', route: '/developer' },
                    { role: 'hr', label: 'HR Manager', icon: '👥', route: '/hr' },
                    { role: 'admin', label: 'Admin', icon: '🛡️', route: '/dashboard' },
                    { role: 'custom', label: 'Custom Operations', icon: '✨', route: '/portal' }
                  ].map(item => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleSelectionChange(item.role as UserRole)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        addRole === item.role
                          ? 'border-rose-600 bg-rose-50/80 ring-2 ring-rose-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm">{item.icon}</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{item.route}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={e => setAddName(e.target.value)}
                    placeholder="e.g. Bilal Farooq"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Designation *</label>
                  <input
                    type="text"
                    required
                    value={addTitle}
                    onChange={e => setAddTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={e => setAddEmail(e.target.value)}
                    placeholder="e.g. bilal@root4tech.com"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={addPhone}
                    onChange={e => setAddPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Department & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={addDepartment}
                    onChange={e => setAddDepartment(e.target.value)}
                    placeholder="e.g. Software Engineering & IT"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Working Shift Hours</label>
                  <input
                    type="text"
                    value={addShift}
                    onChange={e => setAddShift(e.target.value)}
                    placeholder="e.g. 11:00 AM – 07:00 PM"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Salary & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    value={addSalary}
                    onChange={e => setAddSalary(e.target.value)}
                    placeholder="e.g. 110000"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={addPassword}
                    onChange={e => setAddPassword(e.target.value)}
                    placeholder="e.g. team123"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white rounded-xl shadow-xs transition"
                >
                  Confirm & Provision Teammate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. EMPLOYEE DETAILS MODAL */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white font-black text-sm flex items-center justify-center">
                  {selectedEmployee.avatarInitials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedEmployee.name}</h3>
                  <p className="text-xs text-slate-500">{selectedEmployee.roleTitle}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">System Role:</span>
                  <span className="font-bold text-slate-900 capitalize">{selectedEmployee.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Dashboard:</span>
                  <span className="font-mono text-blue-600 font-semibold">{selectedEmployee.defaultRoute}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Status:</span>
                  <span className="font-bold text-emerald-600">{selectedEmployee.status || 'Active'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-900">{selectedEmployee.email}</span>
                </div>
                {selectedEmployee.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="text-slate-900">{selectedEmployee.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Shift Working Hours:</span>
                  <span className="text-slate-900">{selectedEmployee.shift || '10:00 AM – 06:00 PM'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Compensation:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedEmployee.salary ? `PKR ${selectedEmployee.salary.toLocaleString()}` : 'Confidential'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date Joined:</span>
                  <span className="text-slate-900">{selectedEmployee.joinDate || '2024-01-15'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. ADD TASK MODAL */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Assigned HR Task</h3>
              <button onClick={() => setIsAddTaskOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Conduct probation review for Sales Executive"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={e => setNewTaskCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="Payroll">Payroll</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Review">Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl text-xs font-bold"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
