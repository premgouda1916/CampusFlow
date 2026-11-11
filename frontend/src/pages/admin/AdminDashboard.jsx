import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/api';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Activity,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAdminDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Failed to load admin metrics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading system administration console...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            System Administration & Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Monitor real-time platform user activity, corporate accounts, database integrity, and security audit logs.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/officer/approvals"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition"
          >
            Review Approvals
          </Link>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalUsers}</div>
          <div className="text-[11px] text-slate-400">
            {stats?.totalStudents} Students &bull; {stats?.totalRecruiters} Recruiters
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Enterprises</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.verifiedCompanies}</div>
          <div className="text-[11px] text-slate-400">
            {stats?.pendingCompanyApprovals} Pending Approvals
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Applications</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalApplications}</div>
          <div className="text-[11px] text-slate-400">Across {stats?.totalJobs} jobs</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Audit Records</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalAuditLogs}</div>
          <div className="text-[11px] text-slate-400">Security event history</div>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-600" /> Platform Audit Trail Stream
            </h3>
            <p className="text-xs text-slate-400">Immutable ledger of sensitive operations and status transitions.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-bold">Action</th>
                <th className="px-6 py-3 font-bold">User</th>
                <th className="px-6 py-3 font-bold">Entity</th>
                <th className="px-6 py-3 font-bold">Description</th>
                <th className="px-6 py-3 font-bold">IP Address</th>
                <th className="px-6 py-3 font-bold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {stats?.recentActivity?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No recent audit log entries recorded.
                  </td>
                </tr>
              ) : (
                stats?.recentActivity?.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-sans text-slate-700">{log.userEmail || 'System'}</td>
                    <td className="px-6 py-3 text-indigo-700 font-bold">{log.entityType}</td>
                    <td className="px-6 py-3 font-sans text-slate-600 max-w-xs truncate">{log.description}</td>
                    <td className="px-6 py-3 text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="px-6 py-3 text-right text-slate-400 font-sans">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
