import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen spatial-environment text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl rounded-[32px] spatial-window specular-rim p-6 sm:p-10 flex flex-col justify-between space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-spatial-glow">
              CF
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">
              CampusFlow
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-medium text-zinc-300 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/[0.06]"
            >
              Sign In
            </Link>
            <Link to="/login" className="spatial-btn-primary">
              Launch Portal
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="py-6 sm:py-10 text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-[11px] font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Campus Recruitment Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
            Structured Campus <br />
            <span className="font-semibold text-emerald-400">Placement Operations</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Connect students, corporate recruitment teams, and university placement offices on a unified platform featuring dynamic eligibility evaluation, interview orchestration, and verified outcome analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/login" className="w-full sm:w-auto spatial-btn-primary px-7 py-3">
              <span>Access Placement Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register/recruiter" className="w-full sm:w-auto spatial-btn-secondary px-6 py-3">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Register Corporate Partner</span>
            </Link>
          </div>
        </section>

        {/* Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">Dynamic Eligibility Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Server-side rule evaluation checks CGPA thresholds, active backlogs, department constraints, deadlines, and skill alignment transparently.
            </p>
          </div>

          <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/25 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">End-to-End Recruitment Pipeline</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Manage candidate shortlisting, multi-round technical interview scheduling, feedback logging, and formal digital offer acceptance.
            </p>
          </div>

          <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">Verified Placement Analytics</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-time batch statistics, department-wise placement breakdowns, immutable audit logs, and direct CSV report exports.
            </p>
          </div>
        </section>

        <footer className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
          <span>CampusFlow Placement & Recruitment Management Platform</span>
          <span>Spring Boot 3 • React 18 • MySQL • Redis</span>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
