import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar,
  Layers,
  Terminal,
  Activity,
  LogOut,
  ExternalLink,
  Filter,
  CheckSquare,
  Square,
  Trash2,
  Sparkles,
  Cpu,
  Database,
  Server,
  X,
  Play,
  SquareCheck,
  ChevronRight,
  ShieldCheck,
  Zap,
  Flame
} from 'lucide-react';
import { Root4TechLogo } from '@/components/common/Root4TechLogo';
import {
  INITIAL_DEVELOPER_PROJECTS,
  INITIAL_DEVELOPER_TASKS,
  INITIAL_DEVELOPER_ACTIVITIES
} from '@/data/mockData';
import { DeveloperProject, DeveloperTask, DeveloperActivity } from '@/types/crm';

const DEV_TASKS_STORAGE_KEY = 'root4tech_crm_developer_tasks';
const DEV_PROJECTS_STORAGE_KEY = 'root4tech_crm_developer_projects';

export const DeveloperDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'milestones' | 'activities'>('projects');

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

  // Attendance Punch State
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState<string | null>('10:48 AM');

  // Projects State
  const [projects, setProjects] = useState<DeveloperProject[]>(() => {
    const saved = localStorage.getItem(DEV_PROJECTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DEVELOPER_PROJECTS;
      }
    }
    return INITIAL_DEVELOPER_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem(DEV_PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  // Tasks State
  const [tasks, setTasks] = useState<DeveloperTask[]>(() => {
    const saved = localStorage.getItem(DEV_TASKS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DEVELOPER_TASKS;
      }
    }
    return INITIAL_DEVELOPER_TASKS;
  });

  useEffect(() => {
    localStorage.setItem(DEV_TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Activities State
  const [activities, setActivities] = useState<DeveloperActivity[]>(INITIAL_DEVELOPER_ACTIVITIES);

  // Filters
  const [taskStatusFilter, setTaskStatusFilter] = useState<'All' | 'To Do' | 'In Progress' | 'Code Review' | 'Done'>('All');
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState(projects[0]?.name || 'Root 4 Tech CRM Next-Gen Backend');
  const [newTaskType, setNewTaskType] = useState<DeveloperTask['type']>('Feature');
  const [newTaskPriority, setNewTaskPriority] = useState<DeveloperTask['priority']>('High');
  const [newTaskDeadline, setNewTaskDeadline] = useState('Tomorrow');
  const [newTaskHours, setNewTaskHours] = useState('4');

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

  const handleToggleClock = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
      showToast(`Clocked out at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Great work today!`);
    } else {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsClockedIn(true);
      setClockInTime(now);
      showToast(`Clocked in at ${now}. Welcome to your development shift!`);
    }
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextStatus: DeveloperTask['status'] =
            t.status === 'Done' ? 'In Progress' : 'Done';
          return {
            ...t,
            status: nextStatus,
            completed: nextStatus === 'Done'
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task removed from board.');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title.');
      return;
    }

    const newTask: DeveloperTask = {
      id: `dev-task-${Date.now()}`,
      projectName: newTaskProject,
      title: newTaskTitle.trim(),
      type: newTaskType,
      priority: newTaskPriority,
      status: 'In Progress',
      deadline: newTaskDeadline.trim() || 'Next Sprint',
      estimatedHours: Number(newTaskHours) || 3,
      completed: false
    };

    setTasks(prev => [newTask, ...prev]);

    // Also push a live activity
    const newAct: DeveloperActivity = {
      id: `act-${Date.now()}`,
      title: `Logged new development task: "${newTaskTitle.trim()}"`,
      type: 'commit',
      target: newTaskProject,
      timestamp: 'Just now',
      author: user?.name || 'Developer'
    };
    setActivities(prev => [newAct, ...prev]);

    setIsAddTaskModalOpen(false);
    setNewTaskTitle('');
    showToast(`🚀 Task created and assigned to ${newTaskProject}!`);
  };

  // Metrics
  const completedTasksCount = tasks.filter(t => t.completed || t.status === 'Done').length;
  const inProgressTasksCount = tasks.filter(t => t.status === 'In Progress').length;
  const codeReviewCount = tasks.filter(t => t.status === 'Code Review').length;
  const totalHoursEstimated = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // Filtered Tasks
  const filteredTasks = tasks.filter(t => {
    if (taskStatusFilter !== 'All' && t.status !== taskStatusFilter) return false;
    if (taskTypeFilter !== 'All' && t.type !== taskTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 h-16 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <Root4TechLogo size="md" showText={true} subtitle="Software Engineering & Dev Hub" variant="dark" />
        </div>

        {/* Center / Right Developer Indicators */}
        <div className="flex items-center gap-3">
          {/* Shift Time Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-cyan-400 text-xs font-medium border border-cyan-500/20">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Shift: <strong className="text-white">{user?.shift || '11:00 AM – 07:00 PM'}</strong></span>
          </div>

          {/* Live Clock */}
          <div className="hidden sm:block text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
            {currentTime}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
              {user?.avatarInitials || 'DEV'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{user?.name || 'Developer'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-400">{user?.roleTitle || 'Senior Software Engineer'}</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition"
            title="Log Out from Session"
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
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2-COLUMN LAYOUT: LEFT SIDEBAR + RIGHT WORKSPACE */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* LEFT-SIDEBAR: DEV PROFILE & SHIFT & QUICK ACTIONS */}
          <aside className="w-full lg:w-80 shrink-0 bg-slate-950/70 rounded-2xl border border-cyan-500/30 shadow-2xl p-5 space-y-5 lg:sticky lg:top-20 backdrop-blur-sm">
            {/* Developer Identity Card */}
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  {user?.avatarInitials || 'DEV'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{user?.name || 'Developer'}</h3>
                  <p className="text-xs text-cyan-400 font-semibold">{user?.roleTitle || 'Full-Stack Developer'}</p>
                  <p className="text-[10px] text-slate-400">{user?.department || 'Software Engineering & IT'}</p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dev Status:</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  Active in Sprint 24
                </span>
              </div>
            </div>

            {/* Shift Attendance Punch */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Shift Punch Clock</span>
                </span>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {currentTime}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Clocked In:</span>
                <span className="font-semibold text-slate-200">
                  {isClockedIn ? clockInTime || '10:48 AM' : 'Not Clocked In'}
                </span>
              </div>

              <button
                onClick={handleToggleClock}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm ${
                  isClockedIn
                    ? 'bg-rose-600/90 hover:bg-rose-600 text-white shadow-rose-600/20'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/20'
                }`}
              >
                {isClockedIn ? (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Clock Out (End Shift)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Clock In (Start Shift)</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Development Task</span>
              </button>
            </div>

            {/* Tech Stack & Active Branch Indicators */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active Repository Context
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px]">
                  <GitBranch className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">feature/role-based-dashboards</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Build Pipeline:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passing (100%)
                  </span>
                </div>
              </div>
            </div>

            {/* Developer Metrics */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sprint Progress
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Tasks Completed</span>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="mt-1 text-lg font-bold font-mono text-white">
                  {completedTasksCount} / {tasks.length}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT-SIDE WORKSPACE */}
          <div className="flex-1 w-full space-y-5">
            {/* Top Workspace Navigation Tabs */}
            <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Assigned Projects ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'tasks'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Development Tasks ({tasks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('milestones')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'milestones'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Deadlines & Milestones</span>
              </button>

              <button
                onClick={() => setActiveTab('activities')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'activities'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Recent Activities</span>
              </button>
            </div>

            {/* TAB 1: ASSIGNED PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>My Assigned Engineering Projects</span>
                  </h2>
                  <span className="text-xs text-slate-400">
                    {projects.length} Active Production Projects
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map(proj => (
                    <div
                      key={proj.id}
                      className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-4 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        {/* Header badge & title */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                              {proj.clientName}
                            </span>
                            <h3 className="text-sm font-bold text-white mt-0.5">{proj.name}</h3>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                              proj.status === 'In Progress'
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                : proj.status === 'Review'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                : proj.status === 'Testing'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            {proj.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {proj.description}
                        </p>

                        {/* Tech Stack Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {proj.techStack.map(tech => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer & Progress Bar */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Completion</span>
                          <span className="font-mono font-bold text-cyan-400">{proj.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>Deadline: {proj.deadline}</span>
                          </span>
                          <span className="font-mono text-cyan-400 text-[10px]">
                            {proj.completedTasksCount}/{proj.totalTasksCount} Tasks
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: DEVELOPMENT TASKS */}
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search tasks by title, project, or type..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['All', 'In Progress', 'Code Review', 'Done', 'To Do'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setTaskStatusFilter(st)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          taskStatusFilter === st
                            ? 'bg-cyan-600 text-white font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}

                    <button
                      onClick={() => setIsAddTaskModalOpen(true)}
                      className="ml-auto px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Task</span>
                    </button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5">
                  {filteredTasks.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-400 text-xs">
                      No development tasks match the selected filter.
                    </div>
                  ) : (
                    filteredTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border transition-all duration-150 flex items-start justify-between gap-3 ${
                          task.completed || task.status === 'Done'
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                            : 'bg-slate-950 border-slate-800 hover:border-cyan-500/30'
                        }`}
                      >
                        {/* Checkbox & Details */}
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleToggleTaskStatus(task.id)}
                            className="mt-0.5 text-slate-400 hover:text-cyan-400 transition"
                          >
                            {task.completed || task.status === 'Done' ? (
                              <CheckSquare className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-600" />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold ${
                                  task.completed || task.status === 'Done'
                                    ? 'line-through text-slate-500'
                                    : 'text-white'
                                }`}
                              >
                                {task.title}
                              </span>

                              {/* Priority Badge */}
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  task.priority === 'Urgent'
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    : task.priority === 'High'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}
                              >
                                {task.priority}
                              </span>

                              {/* Type Badge */}
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono">
                                {task.type}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-slate-400">
                              <span className="text-cyan-400 font-medium">{task.projectName}</span>
                              <span>•</span>
                              <span>Due: {task.deadline}</span>
                              <span>•</span>
                              <span className="font-mono">{task.estimatedHours}h est.</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: DEADLINES & MILESTONES */}
            {activeTab === 'milestones' && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>Sprint 24 Engineering Milestones</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Key deliverables, release deadlines, and production rollouts
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                      Sprint Target: 15 Nov 2025
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        title: 'Dynamic Role-Based Dashboard Architecture',
                        project: 'Root 4 Tech CRM Next-Gen Backend',
                        deadline: 'Today 06:00 PM',
                        status: 'Completed',
                        color: 'border-emerald-500/30 bg-emerald-500/5'
                      },
                      {
                        title: 'Production Multi-Role Tamper-Proof ProtectedRoute',
                        project: 'Root 4 Tech CRM Next-Gen Backend',
                        deadline: 'Tomorrow 12:00 PM',
                        status: 'In Review',
                        color: 'border-cyan-500/30 bg-cyan-500/5'
                      },
                      {
                        title: 'Vanguard FinTech Institutional Audit Report',
                        project: 'Vanguard Capital Partners',
                        deadline: '05 Nov 2025',
                        status: 'Upcoming',
                        color: 'border-slate-800 bg-slate-900/60'
                      },
                      {
                        title: 'Apex Driver Real-Time Telemetry Live Dispatch',
                        project: 'Apex Logistics Ltd',
                        deadline: '15 Nov 2025',
                        status: 'Upcoming',
                        color: 'border-slate-800 bg-slate-900/60'
                      }
                    ].map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border ${m.color} flex items-center justify-between gap-3`}
                      >
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white">{m.title}</h4>
                          <p className="text-[11px] text-slate-400">{m.project}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-cyan-400 block">{m.deadline}</span>
                          <span className="text-[10px] text-slate-400">{m.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RECENT ACTIVITIES */}
            {activeTab === 'activities' && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Recent Engineering Activity Log</span>
                  </h2>

                  <div className="space-y-3">
                    {activities.map(act => (
                      <div
                        key={act.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          {act.type === 'pr_merged' ? (
                            <GitPullRequest className="w-4 h-4" />
                          ) : act.type === 'deployment' ? (
                            <Zap className="w-4 h-4" />
                          ) : (
                            <GitCommit className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white">{act.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="text-cyan-400 font-mono">{act.target}</span>
                            <span>•</span>
                            <span>{act.author}</span>
                            <span>•</span>
                            <span>{act.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. ADD TASK MODAL */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Add Development Task</span>
              </h3>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement WebSocket reconnection retry"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assigned Project
                </label>
                <select
                  value={newTaskProject}
                  onChange={e => setNewTaskProject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newTaskType}
                    onChange={e => setNewTaskType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Feature">Feature</option>
                    <option value="Bugfix">Bugfix</option>
                    <option value="Refactor">Refactor</option>
                    <option value="DevOps">DevOps</option>
                    <option value="API">API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Deadline
                  </label>
                  <input
                    type="text"
                    value={newTaskDeadline}
                    onChange={e => setNewTaskDeadline(e.target.value)}
                    placeholder="e.g. Tomorrow"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    value={newTaskHours}
                    onChange={e => setNewTaskHours(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30"
                >
                  Confirm & Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
