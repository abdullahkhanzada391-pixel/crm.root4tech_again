import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  CheckSquare,
  Square,
  Trash2,
  Sparkles,
  LogOut,
  X,
  Play,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Root4TechLogo } from '@/components/common/Root4TechLogo';
import { getRoleConfig } from '@/utils/roleConfig';

interface CustomTask {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  completed: boolean;
}

export const DynamicRolePortalPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cfg = getRoleConfig(user?.role || 'custom');

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

  // Clock in/out
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState<string | null>('10:00 AM');

  // Tasks
  const [tasks, setTasks] = useState<CustomTask[]>([
    {
      id: 'task-1',
      title: `Complete daily operational checklist for ${user?.department || 'Operations'}`,
      priority: 'High',
      deadline: 'Today 05:00 PM',
      completed: false
    },
    {
      id: 'task-2',
      title: 'Review weekly workflow milestones and submit status summary',
      priority: 'Medium',
      deadline: 'Tomorrow',
      completed: true
    }
  ]);

  // Modal
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<CustomTask['priority']>('High');
  const [newTaskDeadline, setNewTaskDeadline] = useState('Today 06:00 PM');

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
      showToast('Clocked out successfully.');
    } else {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsClockedIn(true);
      setClockInTime(now);
      showToast(`Clocked in at ${now}. Have a productive shift!`);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setTasks(prev => [
      {
        id: `task-${Date.now()}`,
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
        deadline: newTaskDeadline.trim() || 'Next Shift',
        completed: false
      },
      ...prev
    ]);

    setIsAddTaskOpen(false);
    setNewTaskTitle('');
    showToast('New operational task created.');
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task removed.');
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <Root4TechLogo size="md" showText={true} subtitle={`${user?.roleTitle || 'Operations'} Workspace`} variant="dark" />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs font-semibold border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Shift: {user?.shift || '10:00 AM – 06:00 PM'}</span>
          </div>

          <div className="hidden sm:block text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
            {currentTime}
          </div>

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${cfg.accentGradient} text-white font-bold text-xs flex items-center justify-center`}>
              {user?.avatarInitials || 'TM'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white">{user?.name}</div>
              <div className="text-[10px] text-slate-400">{user?.roleTitle}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between shadow-lg">
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column */}
          <aside className="w-full lg:w-80 shrink-0 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-5">
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cfg.accentGradient} text-white font-black text-sm flex items-center justify-center`}>
                  {user?.avatarInitials || 'TM'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{user?.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold">{user?.roleTitle}</p>
                  <p className="text-[10px] text-slate-400">{user?.department}</p>
                </div>
              </div>
            </div>

            {/* Shift punch */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Shift Punch</span>
                </span>
                <span className="font-mono text-amber-400 font-bold">{currentTime}</span>
              </div>

              <button
                onClick={handleToggleClock}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                  isClockedIn ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                {isClockedIn ? <LogOut className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isClockedIn ? 'Clock Out (End Shift)' : 'Clock In (Start Shift)'}</span>
              </button>
            </div>

            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Task</span>
            </button>
          </aside>

          {/* Right Workspace */}
          <div className="flex-1 w-full space-y-5">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white">Assigned Workspace Tasks</h2>
                  <p className="text-xs text-slate-400">Operational tasks and deliverables assigned to your role</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {completedCount} of {tasks.length} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {tasks.map(t => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                      t.completed ? 'bg-slate-900/50 border-slate-800/60 opacity-70' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button onClick={() => handleToggleTask(t.id)} className="mt-0.5 text-slate-400 hover:text-amber-400">
                        {t.completed ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5" />}
                      </button>
                      <div>
                        <div className={`text-xs font-semibold ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                          {t.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          <span>Priority: {t.priority}</span> • <span>Due: {t.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => handleDeleteTask(t.id)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Add Task</h3>
              <button onClick={() => setIsAddTaskOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Complete client onboarding QA check"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline</label>
                  <input
                    type="text"
                    value={newTaskDeadline}
                    onChange={e => setNewTaskDeadline(e.target.value)}
                    placeholder="e.g. Today 06:00 PM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-xs font-bold"
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
