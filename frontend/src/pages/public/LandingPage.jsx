import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Lock,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen spatial-environment text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 relative select-none">
      {/* Background Timber Horizon Shelf */}
      <div className="spatial-desk-shelf" />

      {/* Floating Spatial Chrome Bar */}
      <div className="w-full max-w-6xl h-11 mb-3 px-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] flex items-center justify-between text-slate-400 text-xs z-20 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] text-slate-500">AA</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-1 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs font-medium tracking-wide shadow-inner">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>campusflow.edu</span>
          <span className="text-slate-500">/</span>
          <span className="text-blue-400">spatial-experience</span>
          <RotateCw className="w-2.5 h-2.5 opacity-60 ml-1" />
        </div>

        <div className="flex items-center gap-2">
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* Main Spatial Window */}
      <div className="w-full max-w-6xl flex-1 rounded-[36px] spatial-window specular-rim p-6 sm:p-10 flex flex-col justify-between relative z-10 shadow-spatial-window">
        {/* Navigation */}
        <header className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center text-white font-black text-base shadow-spatial-glow">
              CF
            </div>
            <span className="font-light text-xl tracking-tight text-white">
              Campus<strong className="font-bold">Flow</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/[0.06]"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl shadow-spatial-glow transition"
            >
              Launch Portal
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 sm:py-16 text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Spatial Placement Architecture
          </div>

          <h1 className="text-4xl sm:text-6xl font-extralight tracking-tight text-white leading-tight">
            Next-Generation <br />
            <span className="font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Campus Recruitment
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Immerse students, corporate talent acquisition teams, and university placement cells in a unified spatial environment featuring real-time dynamic eligibility verification and automated interview pipelines.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-spatial-glow transition transform hover:-translate-y-0.5"
            >
              <span>Explore 1-Click Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register/recruiter"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-xs text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition"
            >
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Register Company</span>
            </Link>
          </div>
        </section>

        {/* 3 Spatial Glass Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Dynamic Eligibility Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rules-based pre-screening evaluates CGPA, backlogs, department matching, and required skills with detailed criteria breakdowns.
            </p>
          </div>

          <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Recruitment Orchestration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Shortlist candidates, schedule multi-round technical interviews with Google Meet integration, and issue digital offer letters.
            </p>
          </div>

          <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Institutional Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live placement rate analytics, department placement distributions, top recruiter metrics, and 1-click CSV report export.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/[0.08] text-center text-xs text-slate-500">
          CampusFlow Spatial UI Platform • Engineered with Spring Boot 3, React 18, and VisionOS Glassmorphism
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
