import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Filter,
  FileText,
  Receipt,
  Menu
} from 'lucide-react';
import { useCRM } from '@/context/CRMContext';

interface MobileBottomNavProps {
  onOpenMobileMenu: () => void;
  isMobileOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenMobileMenu,
  isMobileOpen
}) => {
  const location = useLocation();
  const { leads, quotations, invoices } = useCRM();

  // Check if current route is one of the secondary routes (Clients, Team, Sales, Settings)
  const isSecondaryActive = ['/clients', '/team', '/sales', '/settings'].some(p =>
    location.pathname.startsWith(p)
  );

  const navItems = [
    {
      to: '/dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      to: '/leads',
      label: 'Leads',
      icon: Filter,
      badge: leads.length > 0 ? leads.length : undefined,
      badgeColor: 'bg-blue-500'
    },
    {
      to: '/quotations',
      label: 'Quotes',
      icon: FileText,
      badge: quotations.length > 0 ? quotations.length : undefined,
      badgeColor: 'bg-purple-500'
    },
    {
      to: '/invoices',
      label: 'Invoices',
      icon: Receipt,
      badge: invoices.length > 0 ? invoices.length : undefined,
      badgeColor: 'bg-amber-500'
    }
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md px-2 py-1 shadow-2xl shadow-black/80 pb-safe select-none"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[48px] touch-manipulation ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 active:scale-95'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Top Glowing Indicator for active tab */}
                  {isActive && (
                    <span className="absolute -top-1 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full shadow-sm shadow-blue-400" />
                  )}

                  <div className="relative">
                    <div
                      className={`p-1 rounded-lg transition-transform duration-200 ${
                        isActive
                          ? 'bg-blue-600/30 text-blue-400 scale-105'
                          : 'text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Numeric Count Badge */}
                    {item.badge !== undefined && (
                      <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center leading-none border border-slate-950 shadow-xs">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-medium tracking-tight mt-0.5 truncate ${
                      isActive ? 'font-bold text-white' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* 5th Button: Open Full Drawer Menu */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[48px] touch-manipulation active:scale-95 ${
            isMobileOpen || isSecondaryActive
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Open CRM Navigation Menu"
        >
          {(isMobileOpen || isSecondaryActive) && (
            <span className="absolute -top-1 w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-sm shadow-cyan-400" />
          )}

          <div className="relative">
            <div
              className={`p-1 rounded-lg transition-transform duration-200 ${
                isMobileOpen || isSecondaryActive
                  ? 'bg-slate-800 text-cyan-400 scale-105'
                  : 'text-slate-400'
              }`}
            >
              <Menu className="w-5 h-5" />
            </div>

            {/* Glowing dot if active on secondary page */}
            {isSecondaryActive && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950" />
            )}
          </div>

          <span
            className={`text-[10px] font-medium tracking-tight mt-0.5 truncate ${
              isMobileOpen || isSecondaryActive ? 'font-bold text-cyan-300' : 'text-slate-400'
            }`}
          >
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};
