import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/api';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Activity,
  Layers
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
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">Loading system governance console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/25">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            System <strong className="font-semibold">Administration & Security</strong>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            Monitor platform accounts, enterprise verification queues, active requisitions, and immutable audit logs.
          </p>
        </div>

        <Link to="/officer/approvals" className="spatial-btn-primary py-3 px-6 shrink-0">
          Review Pending Approvals
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-xl bg-white/[0.06] text-zinc-300 border border-white/10">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white tabular-nums">{stats?.totalUsers ?? 0}</div>
          <div className="text-[11px] text-zinc-400">
            {stats?.totalStudents ?? 0} Students • {stats?.totalRecruiters ?? 0} Recruiters
          </div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Enterprises</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white tabular-nums">{stats?.verifiedCompanies ?? 0}</div>
          <div className="text-[11px] text-zinc-400">
            {stats?.pendingCompanyApprovals ?? 0} Pending verification
          </div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Applications</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white tabular-nums">{stats?.totalApplications ?? 0}</div>
          <div className="text-[11px] text-zinc-400">Across {stats?.totalJobs ?? 0} job openings</div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-600 text-white shadow-spatial-glow border border-emerald-400/35 space-y-2">
          <div className="flex items-center justify-between text-emerald-50">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Audit Records</span>
            <div className="p-2 rounded-xl bg-white/15">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tabular-nums">{stats?.totalAuditLogs ?? 0}</div>
          <div className="text-[11px] text-emerald-50">Immutable security ledger</div>
        </div>
      </div>

      <div className="rounded-3xl spatial-panel overflow-hidden">
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" /> Platform Audit Trail Stream
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Immutable ledger of sensitive operations and status transitions.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-white/[0.08]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Action</th>
                <th className="px-6 py-3.5 font-semibold">User</th>
                <th className="px-6 py-3.5 font-semibold">Entity</th>
                <th className="px-6 py-3.5 font-semibold">Description</th>
                <th className="px-6 py-3.5 font-semibold">IP Address</th>
                <th className="px-6 py-3.5 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] font-mono">
              {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-500 font-sans">
                    No audit log entries recorded.
                  </td>
                </tr>
              ) : (
                stats.recentActivity.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.03] transition">
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-zinc-100 bg-white/[0.06] border border-white/10 px-2.5 py-0.5 rounded-lg text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-sans text-zinc-200">{log.userEmail || 'System'}</td>
                    <td className="px-6 py-3.5 text-emerald-400 font-semibold">{log.entityType}</td>
                    <td className="px-6 py-3.5 font-sans text-zinc-400 max-w-xs truncate">{log.description}</td>
                    <td className="px-6 py-3.5 text-zinc-500">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="px-6 py-3.5 text-right text-zinc-400 font-sans whitespace-nowrap">
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
