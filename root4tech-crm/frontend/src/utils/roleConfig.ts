import { UserRole } from '@/types/crm';

export interface RoleDefinition {
  key: UserRole;
  label: string;
  defaultTitle: string;
  defaultDepartment: string;
  defaultRoute: string;
  defaultSalary: number;
  shift: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentGradient: string;
  icon: string;
  description: string;
  allowedModules: string[];
}

export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  admin: {
    key: 'admin',
    label: 'Administrator',
    defaultTitle: 'Executive Director & Administrator',
    defaultDepartment: 'Executive Administration',
    defaultRoute: '/dashboard',
    defaultSalary: 150000,
    shift: 'Full Time / Flexible',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    accentGradient: 'from-emerald-600 to-teal-600',
    icon: '🛡️',
    description: 'Full unrestricted CRM and executive system access.',
    allowedModules: ['Dashboard', 'Leads', 'Clients', 'Team Members', 'Quotations', 'Invoices', 'Sales', 'Settings']
  },
  sales: {
    key: 'sales',
    label: 'Sales Executive',
    defaultTitle: 'Senior Sales Executive',
    defaultDepartment: 'Business Development & Sales',
    defaultRoute: '/salesperson',
    defaultSalary: 85000,
    shift: '10:00 AM – 06:00 PM',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    accentGradient: 'from-blue-600 to-indigo-600',
    icon: '🎯',
    description: 'Personal leads, assigned clients, quotations, sales & commission tracking.',
    allowedModules: ['My Leads', 'Assigned Clients', 'Follow-ups', 'My Quotations', 'My Tasks', 'Recent Activities']
  },
  marketing: {
    key: 'marketing',
    label: 'Marketing Manager',
    defaultTitle: 'Digital Growth & Marketing Manager',
    defaultDepartment: 'Digital Growth & Client Marketing',
    defaultRoute: '/marketing',
    defaultSalary: 95000,
    shift: '10:00 AM – 06:00 PM',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    accentGradient: 'from-purple-600 to-pink-600',
    icon: '🚀',
    description: 'Marketing leads, campaign tracking, client onboarding & marketing tasks.',
    allowedModules: ['Marketing Leads', 'Campaign Management', 'Marketing Tasks', 'Assigned Projects', 'Recent Activities']
  },
  developer: {
    key: 'developer',
    label: 'Developer',
    defaultTitle: 'Full-Stack Software Engineer',
    defaultDepartment: 'Software Engineering & IT',
    defaultRoute: '/developer',
    defaultSalary: 110000,
    shift: '11:00 AM – 07:00 PM',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
    badgeBorder: 'border-cyan-200',
    accentGradient: 'from-cyan-600 to-blue-600',
    icon: '💻',
    description: 'Assigned engineering projects, dev tasks, sprint milestones & git activity.',
    allowedModules: ['Assigned Projects', 'Development Tasks', 'Project Status', 'Task Deadlines', 'Recent Activities']
  },
  hr: {
    key: 'hr',
    label: 'HR Manager',
    defaultTitle: 'Human Resources & Talent Manager',
    defaultDepartment: 'People Operations & HR',
    defaultRoute: '/hr',
    defaultSalary: 90000,
    shift: '09:00 AM – 05:00 PM',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    accentGradient: 'from-rose-600 to-orange-600',
    icon: '👥',
    description: 'Company team members roster, employee records, attendance & HR tasks.',
    allowedModules: ['Team Members', 'Employee Details', 'Attendance Tracking', 'Assigned HR Tasks']
  },
  custom: {
    key: 'custom',
    label: 'Custom Role',
    defaultTitle: 'Operations Specialist',
    defaultDepartment: 'General Operations',
    defaultRoute: '/portal',
    defaultSalary: 75000,
    shift: '10:00 AM – 06:00 PM',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    accentGradient: 'from-amber-600 to-yellow-600',
    icon: '✨',
    description: 'Custom operational workspace tailored to specific business workflows.',
    allowedModules: ['My Workspace', 'Assigned Tasks', 'Shift Punch', 'Recent Company Feed']
  }
};

/**
 * Returns the default dashboard route for a given role
 */
export const getRoleDefaultRoute = (role: string): string => {
  const normalized = (role || '').toLowerCase();
  if (normalized.includes('admin')) return '/dashboard';
  if (normalized.includes('sales')) return '/salesperson';
  if (normalized.includes('market')) return '/marketing';
  if (normalized.includes('dev') || normalized.includes('engineer')) return '/developer';
  if (normalized.includes('hr') || normalized.includes('human')) return '/hr';
  return ROLE_DEFINITIONS[normalized]?.defaultRoute || '/portal';
};

/**
 * Returns role metadata configuration
 */
export const getRoleConfig = (role: string): RoleDefinition => {
  const normalized = (role || '').toLowerCase();
  if (normalized.includes('admin')) return ROLE_DEFINITIONS.admin;
  if (normalized.includes('sales')) return ROLE_DEFINITIONS.sales;
  if (normalized.includes('market')) return ROLE_DEFINITIONS.marketing;
  if (normalized.includes('dev') || normalized.includes('engineer')) return ROLE_DEFINITIONS.developer;
  if (normalized.includes('hr') || normalized.includes('human')) return ROLE_DEFINITIONS.hr;
  return ROLE_DEFINITIONS[normalized] || ROLE_DEFINITIONS.custom;
};

/**
 * Generates an initial secure temporary password for new team member
 */
export const generateSecureTempPassword = (name: string): string => {
  const cleanName = name.trim().split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') || 'team';
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${cleanName}@${randomNum}`;
};
