import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
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
  Search,
  Bell,
  LogOut,
  Check,
  CheckCheck,
  Menu,
  X
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const getNavLinks = () => {
    switch (user?.role) {
      case 'STUDENT':
        return [
          { to: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/student/jobs', label: 'Opportunities', icon: Briefcase },
          { to: '/student/applications', label: 'Applications', icon: FileCheck2 },
          { to: '/student/interviews', label: 'Interviews', icon: CalendarCheck },
          { to: '/student/offers', label: 'Offers', icon: Award },
          { to: '/student/profile', label: 'Profile', icon: User },
        ];
      case 'RECRUITER':
        return [
          { to: '/recruiter/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/recruiter/jobs', label: 'Openings', icon: Briefcase },
          { to: '/recruiter/applicants', label: 'Candidates', icon: Users },
          { to: '/recruiter/interviews', label: 'Interviews', icon: CalendarCheck },
          { to: '/recruiter/offers', label: 'Offers', icon: Award },
        ];
      case 'PLACEMENT_OFFICER':
        return [
          { to: '/officer/dashboard', label: 'Analytics', icon: LayoutDashboard },
          { to: '/officer/approvals', label: 'Approvals', icon: ShieldCheck },
          { to: '/officer/students', label: 'Students', icon: Users },
          { to: '/officer/drives', label: 'Drives', icon: Layers },
          { to: '/officer/reports', label: 'Reports', icon: FileSpreadsheet },
        ];
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'System', icon: LayoutDashboard },
          { to: '/officer/dashboard', label: 'Analytics', icon: Layers },
          { to: '/officer/approvals', label: 'Approvals', icon: ShieldCheck },
          { to: '/officer/students', label: 'Students', icon: Users },
          { to: '/officer/drives', label: 'Drives', icon: CalendarCheck },
          { to: '/officer/reports', label: 'Reports', icon: FileSpreadsheet },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data?.unreadCount || 0);
    } catch {
      // Non-critical
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications({ size: 8 });
      setNotifications(res.data?.content || []);
    } catch {
      // Non-critical
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notifOpen) {
      fetchNotifications();
    }
  }, [notifOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // Ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (user?.role === 'STUDENT') {
      navigate(`/student/jobs?search=${encodeURIComponent(q)}`);
    } else if (user?.role === 'RECRUITER') {
      navigate(`/recruiter/jobs?search=${encodeURIComponent(q)}`);
    } else {
      navigate(`/officer/students?search=${encodeURIComponent(q)}`);
    }
  };

  const roleLabel = user?.role?.replace(/_/g, ' ') || '';

  return (
    <div className="min-h-screen spatial-environment text-zinc-100 flex flex-col items-center p-2.5 sm:p-4 lg:p-6">
      {/* Main Floating Spatial Window */}
      <div className="w-full max-w-[1380px] flex-1 rounded-[28px] sm:rounded-[34px] spatial-window specular-rim p-3.5 sm:p-5 lg:p-6 flex flex-col min-h-[calc(100vh-3rem)]">

        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.08] relative z-30">
          <div className="flex items-center gap-4">
            {/* Brand Identity */}
            <button
              type="button"
              onClick={() => navigate(navLinks[0]?.to || '/')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-spatial-glow group-hover:bg-emerald-500 transition">
                CF
              </div>
              <span className="hidden sm:inline-block text-sm font-semibold tracking-tight text-white">
                CampusFlow
              </span>
            </button>

            {/* Primary Pill Tabs */}
            <nav className="hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              {navLinks.slice(0, 5).map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs hidden lg:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  user?.role === 'STUDENT'
                    ? 'Search roles, companies, skills...'
                    : user?.role === 'RECRUITER'
                    ? 'Search openings...'
                    : 'Search student directory...'
                }
                className="w-full pl-9 pr-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.09] text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.07] transition"
              />
            </div>
          </form>

          {/* Right Utilities */}
          <div className="flex items-center gap-2.5">
            {/* Notification Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label="Notifications"
                className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] text-zinc-300 hover:text-white flex items-center justify-center relative transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#18181b]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl backdrop-blur-3xl bg-[#18181b]/95 border border-white/15 shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.03]">
                    <span className="text-xs font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.06]">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-zinc-500">
                        You have no notifications.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 text-xs flex items-start gap-3 transition ${
                            !n.read ? 'bg-emerald-500/[0.08]' : 'hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="flex-1 space-y-1">
                            <div className="font-semibold text-zinc-100">{n.title}</div>
                            <p className="text-zinc-400 leading-relaxed text-[11px]">{n.message}</p>
                            <div className="text-[10px] text-zinc-500">
                              {new Date(n.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {!n.read && (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(n.id)}
                              title="Mark as read"
                              className="p-1 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-white/[0.06] transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Identity Pill */}
            <button
              type="button"
              onClick={() => {
                if (user?.role === 'STUDENT') navigate('/student/profile');
              }}
              className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.09] text-left transition ${
                user?.role === 'STUDENT' ? 'hover:bg-white/[0.1] cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-900 font-bold text-xs flex items-center justify-center">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-zinc-100 leading-none truncate max-w-[120px]">
                  {user?.fullName}
                </div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider leading-none mt-1">
                  {roleLabel}
                </div>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl bg-white/[0.05] border border-white/[0.09] text-zinc-300"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden my-3 p-3 rounded-2xl bg-[#18181b]/95 border border-white/10 backdrop-blur-2xl flex flex-col gap-1 z-30">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 text-left transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Workspace Body */}
        <div className="flex-1 flex gap-4 lg:gap-6 pt-5 min-h-0">
          {/* Left Floating Dock */}
          <aside className="hidden md:flex flex-col items-center justify-between w-14 py-3.5 px-1.5 rounded-3xl spatial-panel shadow-spatial-dock shrink-0">
            <div className="flex flex-col items-center gap-2.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={item.label}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  </NavLink>
                );
              })}
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="w-10 h-10 rounded-2xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/25 flex items-center justify-center transition"
            >
              <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </button>
          </aside>

          <main className="flex-1 min-w-0 overflow-y-auto pr-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
