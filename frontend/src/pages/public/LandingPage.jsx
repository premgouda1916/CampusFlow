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
  FileSpreadsheet
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <nav className="h-20 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            CampusFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white transition px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link
            to="/register/student"
            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl shadow-md shadow-indigo-600/30 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Next-Gen Enterprise Placement Suite
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Smart Campus Placement & <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-teal-300 bg-clip-text text-transparent">
            Recruitment Orchestration
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Eliminate fragmented spreadsheets and manual coordination. Connect students, corporate talent teams, and university placement cells with real-time dynamic eligibility verification and recruitment automation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/25 transition transform hover:-translate-y-0.5"
          >
            Access Portal Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register/recruiter"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition"
          >
            <Briefcase className="w-4 h-4" /> Register as Recruiter
          </Link>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Dynamic Eligibility Engine</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Multi-rule candidate screening verifying CGPA, backlogs, batch year, department compatibility, and technical skill overlap with detailed criteria breakdown.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">End-to-End Recruitment</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Manage complete hiring cycles: job postings, shortlisting, multi-round technical interview scheduling, and formal offer letter acceptance tracking.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Institutional Analytics</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Real-time calculations for placement percentages, department-wise recruitment distribution, average compensation packages, and 1-click CSV report exports.
          </p>
        </div>
      </section>

      {/* 4 Roles Overview */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Four Unified Portals in One System</h2>
          <p className="text-sm text-slate-400">Tailored dashboards and role-based access control</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase text-indigo-400">Students</div>
            <h4 className="font-bold text-white">Placement Hub</h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Academic & Resume Profile</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Instant Eligibility Preview</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Track Application Stages</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Accept/Decline Offers</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase text-teal-400">Recruiters</div>
            <h4 className="font-bold text-white">Hiring Portal</h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Post Job Openings</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Screen & Shortlist</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Schedule Interview Slots</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Issue Employment Offers</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase text-amber-400">Placement Cell</div>
            <h4 className="font-bold text-white">Officer Console</h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Verify Recruiter Accounts</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Manage Annual Drives</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Monitor All Applications</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Export CSV Placement Data</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase text-rose-400">Administrators</div>
            <h4 className="font-bold text-white">System Governance</h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> User Role Assignment</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Security Audit Log Stream</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Department Taxonomy</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> System-wide Analytics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <p>CampusFlow &copy; 2026. Enterprise Java Full Stack Architecture powered by Spring Boot 3 & React.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
