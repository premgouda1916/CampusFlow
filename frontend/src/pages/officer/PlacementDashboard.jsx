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
  ResponsiveContainer
} from 'recharts';
import {
  GraduationCap,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Building2,
  Sparkles,
  ArrowRight
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
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">Loading placement analytics...</span>
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
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.08] text-zinc-200 border border-white/15">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> University Placement Cell
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Institutional <strong className="font-semibold">Placement Analytics</strong>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            Real-time aggregated placement rates, department distributions, and corporate partner compensation metrics.
          </p>
        </div>

        <Link to="/officer/reports" className="spatial-btn-primary py-3 px-6 shrink-0">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV Reports</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-600 text-white shadow-spatial-glow border border-emerald-400/35 space-y-2">
          <div className="flex items-center justify-between text-emerald-50">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Placement Rate</span>
            <div className="p-2 rounded-xl bg-white/15">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tabular-nums">{stats?.placementPercentage ?? 0}%</div>
          <div className="text-[11px] text-emerald-50">
            {stats?.totalPlacedStudents ?? 0} of {stats?.totalRegisteredStudents ?? 0} Students Placed
          </div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Highest Package</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-emerald-400 tabular-nums">
            {stats?.highestSalaryPackageLpa ?? 0} LPA
          </div>
          <div className="text-[11px] text-zinc-400">
            Average: {stats?.averageSalaryPackageLpa ?? 0} LPA
          </div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Corporate Partners</span>
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/20">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white tabular-nums">
            {stats?.activeRecruiterCompanies ?? 0}
          </div>
          <div className="text-[11px] text-zinc-400">
            {stats?.totalJobsPublished ?? 0} Jobs Published
          </div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Offers</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white tabular-nums">
            {stats?.totalOffersIssued ?? 0}
          </div>
          <div className="text-[11px] text-zinc-400">Extended across batch</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl spatial-panel p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-base text-white">Department Placement Distribution</h3>
            <p className="text-xs text-zinc-400">Batch strength vs. placed candidates by academic department.</p>
          </div>

          <div className="h-72 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(24, 24, 27, 0.96)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="total" name="Total Students" fill="rgba(255,255,255,0.16)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="placed" name="Placed" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl spatial-panel p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base text-white">Leading Recruiting Partners</h3>
            <p className="text-xs text-zinc-400">Organizations extending formal campus offers.</p>
          </div>

          <div className="divide-y divide-white/[0.06] flex-1 flex flex-col justify-center">
            {!stats?.topHiringCompanies || stats.topHiringCompanies.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                No offers recorded yet.
              </div>
            ) : (
              stats.topHiringCompanies.map((c, i) => (
                <div key={i} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 text-white font-semibold flex items-center justify-center">
                      {c.companyName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{c.companyName}</div>
                      <div className="text-[10px] text-zinc-400">{c.averagePackage}</div>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                    {c.offersCount} Offers
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.08]">
            <Link to="/officer/students" className="w-full spatial-btn-secondary py-2.5">
              <span>Browse Student Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDashboard;
