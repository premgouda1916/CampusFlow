import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  CalendarCheck,
  Award,
  User,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Activity,
  LogOut,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'STUDENT':
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/student/jobs', label: 'Explore Jobs', icon: Briefcase },
          { to: '/student/applications', label: 'My Applications', icon: FileCheck2 },
          { to: '/student/interviews', label: 'Interviews', icon: CalendarCheck },
          { to: '/student/offers', label: 'Offers', icon: Award },
          { to: '/student/profile', label: 'Academic Profile', icon: User },
        ];
      case 'RECRUITER':
        return [
          { to: '/recruiter/dashboard', label: 'Recruiter Hub', icon: LayoutDashboard },
          { to: '/recruiter/jobs', label: 'Job Postings', icon: Briefcase },
          { to: '/recruiter/jobs/new', label: 'Create Opening', icon: Layers },
          { to: '/recruiter/applicants', label: 'Candidate Review', icon: Users },
          { to: '/recruiter/interviews', label: 'Interviews', icon: CalendarCheck },
          { to: '/recruiter/offers', label: 'Offer Letters', icon: Award },
        ];
      case 'PLACEMENT_OFFICER':
        return [
          { to: '/officer/dashboard', label: 'Placement Analytics', icon: LayoutDashboard },
          { to: '/officer/approvals', label: 'Recruiter Verification', icon: ShieldCheck },
          { to: '/officer/students', label: 'Student Directory', icon: Users },
          { to: '/officer/drives', label: 'Placement Drives', icon: Layers },
          { to: '/officer/reports', label: 'Export Reports', icon: FileSpreadsheet },
        ];
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Administration', icon: LayoutDashboard },
          { to: '/officer/approvals', label: 'Recruiter Approvals', icon: ShieldCheck },
          { to: '/officer/students', label: 'Student Records', icon: Users },
          { to: '/officer/drives', label: 'Placement Drives', icon: Layers },
          { to: '/officer/reports', label: 'Reports & Analytics', icon: FileSpreadsheet },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight flex items-center gap-1.5">
              CampusFlow
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Smart Placement Platform</div>
          </div>
        </div>

        {/* User Role Tag */}
        <div className="px-5 py-3 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
              {user?.fullName}
            </div>
            <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
              {user?.role?.replace(/_/g, ' ')}
            </div>
          </div>
          {user?.verified && (
            <span className="inline-flex items-center text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Verified
            </span>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom logout button */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

