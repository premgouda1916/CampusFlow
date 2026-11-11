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
  PieChart,
  Pie,
  Cell
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
  ArrowRight
} from 'lucide-react';

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6'];

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
    return <div className="p-12 text-center text-xs text-slate-400">Loading placement intelligence...</div>;
  }

  const deptChartData = stats?.departmentStats?.map((d) => ({
    name: d.departmentCode,
    placed: d.placedStudents,
    total: d.totalStudents,
    rate: d.placementRate,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <GraduationCap className="w-3.5 h-3.5" /> University Placement Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Placement Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Real-time aggregate data on student placement rates, department distributions, and corporate partner packages.
          </p>
        </div>

        <div>
          <Link
            to="/officer/reports"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV Reports
          </Link>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Placement Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats?.placementPercentage}%</div>
          <div className="text-[11px] text-slate-400">
            {stats?.totalPlacedStudents} of {stats?.totalRegisteredStudents} Students Placed
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Highest Package</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-600">{stats?.highestSalaryPackageLpa} LPA</div>
          <div className="text-[11px] text-slate-400">Average: {stats?.averageSalaryPackageLpa} LPA</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Corporate Partners</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.activeRecruiterCompanies}</div>
          <div className="text-[11px] text-slate-400">{stats?.totalJobsPublished} Jobs Published</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Offers</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalOffersIssued}</div>
          <div className="text-[11px] text-slate-400">Extended across batch</div>
        </div>
      </div>

      {/* Recharts Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department-wise Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Department Placement Distribution</h3>
              <p className="text-xs text-slate-400">Total vs placed candidates by academic department.</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="total" name="Total Batch" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
                <Bar dataKey="placed" name="Placed" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Hiring Enterprises */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">Leading Recruiters</h3>
            <p className="text-xs text-slate-400">Top organizations extending formal campus offers.</p>
          </div>

          <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-center">
            {stats?.topHiringCompanies?.map((c, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center">
                    {c.companyName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{c.companyName}</div>
                    <div className="text-[10px] text-slate-400">{c.averagePackage}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {c.offersCount} Offers
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/officer/students"
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition"
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

