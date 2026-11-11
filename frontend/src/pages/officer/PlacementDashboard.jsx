import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  GraduationCap,
  Briefcase,
  Users,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const PlacementDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getPlacementOfficerDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Failed to load placement analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Loading Spatial Analytics...</span>
        </div>
      </div>
    );
  }

  const deptChartData = stats?.departmentStats?.map((d) => ({
    name: d.departmentCode,
    placed: d.placedStudents,
    total: d.totalStudents,
    rate: d.placementRate,
  })) || [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Spatial Header */}
      <div className="rounded-3xl spatial-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <GraduationCap className="w-3.5 h-3.5" /> University Placement Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
            Institutional <strong className="font-bold">Placement Analytics</strong>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Real-time aggregate calculations on batch placement rates, department distributions, and corporate partner packages.
          </p>
        </div>

        <div className="relative z-10">
          <Link
            to="/officer/reports"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-spatial-glow transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV Reports
          </Link>
        </div>
      </div>

      {/* Primary KPI Row - Spatial Frosted Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Placement Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">{stats?.placementPercentage}%</div>
          <div className="text-[11px] text-slate-400">
            {stats?.totalPlacedStudents} of {stats?.totalRegisteredStudents} Students Placed
          </div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Highest Package</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-400">{stats?.highestSalaryPackageLpa} LPA</div>
          <div className="text-[11px] text-slate-400">Average: {stats?.averageSalaryPackageLpa} LPA</div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Corporate Partners</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.activeRecruiterCompanies}</div>
          <div className="text-[11px] text-slate-400">{stats?.totalJobsPublished} Jobs Published</div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Offers</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.totalOffersIssued}</div>
          <div className="text-[11px] text-slate-400">Extended across cohort</div>
        </div>
      </div>

      {/* Recharts Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Department-wise Bar Chart */}
        <div className="lg:col-span-2 rounded-3xl spatial-panel p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base text-white">Department Placement Distribution</h3>
            <p className="text-xs text-slate-400">Batch strength vs. placed candidates by academic discipline.</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '12px',
                    backdropFilter: 'blur(20px)',
                  }}
                />
                <Bar dataKey="total" name="Total Students" fill="rgba(255,255,255,0.15)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="placed" name="Placed" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Hiring Enterprises */}
        <div className="rounded-3xl spatial-panel p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">Leading Recruiting Partners</h3>
            <p className="text-xs text-slate-400">Top organizations extending formal campus offers.</p>
          </div>

          <div className="divide-y divide-white/[0.06] flex-1 flex flex-col justify-center">
            {stats?.topHiringCompanies?.map((c, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 text-white font-bold flex items-center justify-center">
                    {c.companyName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{c.companyName}</div>
                    <div className="text-[10px] text-slate-400">{c.averagePackage}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                    {c.offersCount} Offers
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.08]">
            <Link
              to="/officer/students"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition"
            >
              Browse Student Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDashboard;
