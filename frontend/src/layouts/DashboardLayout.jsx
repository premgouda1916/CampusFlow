import React, { useState } from 'react';
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
  PhoneCall,
  Power,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Share2,
  Plus,
  Copy,
  Lock,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine navigation items by role
  const getNavLinks = () => {
    switch (user?.role) {
      case 'STUDENT':
        return [
          { to: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/student/jobs', label: 'Explore Jobs', icon: Briefcase },
          { to: '/student/applications', label: 'Applications', icon: FileCheck2 },
          { to: '/student/interviews', label: 'Interviews', icon: CalendarCheck },
          { to: '/student/offers', label: 'Offers', icon: Award },
          { to: '/student/profile', label: 'Academic Profile', icon: User },
        ];
      case 'RECRUITER':
        return [
          { to: '/recruiter/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/recruiter/jobs', label: 'Job Openings', icon: Briefcase },
          { to: '/recruiter/applicants', label: 'Candidates', icon: Users },
          { to: '/recruiter/interviews', label: 'Interviews', icon: CalendarCheck },
          { to: '/recruiter/offers', label: 'Offer Letters', icon: Award },
        ];
      case 'PLACEMENT_OFFICER':
      case 'ADMIN':
        return [
          { to: user?.role === 'ADMIN' ? '/admin/dashboard' : '/officer/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/officer/drives', label: 'Placement Drives', icon: Layers },
          { to: '/officer/approvals', label: 'Recruiters', icon: ShieldCheck },
          { to: '/officer/students', label: 'Student Directory', icon: Users },
          { to: '/officer/reports', label: 'Export Reports', icon: FileSpreadsheet },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (user?.role === 'STUDENT') {
        navigate(`/student/jobs?search=${encodeURIComponent(searchQuery)}`);
      } else if (user?.role === 'RECRUITER') {
        navigate(`/recruiter/jobs?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/officer/students?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <div className="min-h-screen spatial-environment text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 lg:p-6 relative select-none">
      {/* Background Timber Horizon Shelf (Matching Vision Pro Reference Image) */}
      <div className="spatial-desk-shelf" />

      {/* Floating Spatial Chrome Bar (VisionOS Safari/Window Header) */}
      <div className="w-full max-w-7xl h-11 mb-2 px-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] flex items-center justify-between shadow-lg text-slate-400 text-xs z-20">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <button className="p-1 rounded-lg hover:bg-white/10 hover:text-white transition">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 rounded-lg hover:bg-white/10 hover:text-white transition">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] text-slate-500">AA</span>
        </div>

        {/* Address Pill (Matching Medizinisch.com in reference image) */}
        <div className="flex items-center gap-2 px-4 py-1 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs font-medium tracking-wide shadow-inner">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>campusflow.edu</span>
          <span className="text-slate-500">/</span>
          <span className="text-blue-400">spatial-hub</span>
          <button className="ml-1 hover:text-white transition" title="Refresh">
            <RotateCw className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
          </button>
        </div>

        {/* Window action pills */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Spatial Glass Window Container */}
      <div className="w-full max-w-7xl flex-1 rounded-[32px] sm:rounded-[38px] spatial-window specular-rim p-3 sm:p-5 flex flex-col relative z-10 min-h-[calc(100vh-80px)]">
        
        {/* Top Header Rail Inside Window */}
        <header className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.08] relative z-20">
          {/* Brand Monogram Logo (Matching 'M' Monogram in Reference Image) */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center text-white font-black text-base tracking-tighter shadow-spatial-glow cursor-pointer hover:scale-105 transition"
            >
              CF
            </div>

            {/* Segmented Spatial Pill Tabs */}
            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              {navLinks.slice(0, 3).map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-spatial-glow border border-blue-400/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />}
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Search Pill Capsule (Matching search in reference) */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs hidden lg:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities, skills, recruiters..."
                className="w-full pl-9 pr-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400/60 focus:bg-white/[0.08] transition shadow-inner"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* Action Pills & Profile (Matching Phone, Notification, Profile in Reference Image) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Call / Help Button (Electric Blue Circle) */}
            <button
              onClick={() => window.open('mailto:placement.support@campusflow.edu')}
              title="Placement Support Hotline"
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-spatial-glow transition"
            >
              <PhoneCall className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => navigate(user?.role === 'STUDENT' ? '/student/applications' : '/officer/dashboard')}
                title="Notifications"
                className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#0a0d14] animate-ping" />
              </button>
            </div>

            {/* User Profile Pill Avatar */}
            <div
              onClick={() => {
                if (user?.role === 'STUDENT') navigate('/student/profile');
              }}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] cursor-pointer hover:bg-white/[0.12] transition"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate hidden sm:inline-block">
                {user?.fullName?.split(' ')[0]}
              </span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/[0.06] text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 my-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl flex flex-col gap-2 z-30">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
            >
              <Power className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Body Container: Left Spatial Dock + Main Canvas */}
        <div className="flex-1 flex gap-4 lg:gap-6 pt-4 min-h-0">
          
          {/* Left Vertical Spatial Floating Dock (Matching Reference Image Dock) */}
          <aside className="hidden md:flex flex-col items-center justify-between w-14 py-4 px-1 rounded-3xl bg-white/[0.035] border border-white/[0.08] backdrop-blur-2xl shadow-spatial-dock">
            {/* Navigation Icons Stack */}
            <div className="flex flex-col items-center gap-3">
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
                        ? 'bg-blue-600 text-white shadow-spatial-glow scale-105 border border-blue-400/50'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </NavLink>
                );
              })}
            </div>

            {/* Bottom Power / Logout Button (Matching Power icon in Reference Image) */}
            <button
              onClick={logout}
              title="Sign Out"
              className="w-10 h-10 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 flex items-center justify-center transition"
            >
              <Power className="w-4 h-4" />
            </button>
          </aside>

          {/* Main Spatial Content Canvas */}
          <main className="flex-1 min-w-0 overflow-y-auto pr-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
