import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, applicationService, interviewService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  CheckCircle2,
  FileCheck2,
  CalendarCheck,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, appsRes, intRes] = await Promise.all([
          analyticsService.getStudentDashboard(),
          applicationService.getMyApplications({ size: 4 }),
          interviewService.getMyInterviews({ size: 3 }),
        ]);
        setStats(dashRes.data);
        setRecentApplications(appsRes.data.content || []);
        setUpcomingInterviews(intRes.data.content || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Placement Season 2026-27 Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-sm text-indigo-200 leading-relaxed">
            You are currently eligible for <span className="font-bold text-white underline">{stats?.eligibleJobsCount || 0}</span> active campus openings based on your department and academic score.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/student/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-indigo-900 hover:bg-indigo-50 shadow-md transition"
            >
              Browse Eligible Jobs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/student/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-indigo-700/60 hover:bg-indigo-700 text-white border border-indigo-500/40 transition"
            >
              Update Academic Profile
            </Link>
          </div>
        </div>

        {/* Profile Completion Bar in Banner */}
        <div className="mt-6 pt-6 border-t border-indigo-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Profile Completion: <strong className="text-white">{stats?.profileCompletionPercentage}%</strong></span>
          </div>
          <div className="w-full sm:w-48 bg-indigo-950/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${stats?.profileCompletionPercentage || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Eligible Jobs</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.eligibleJobsCount}</div>
          <div className="text-[11px] text-slate-400">Of {stats?.totalAvailableJobs} total posted</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Submitted</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.applicationsSubmitted}</div>
          <div className="text-[11px] text-slate-400">{stats?.shortlistedApplications} Shortlisted</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Interviews</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.upcomingInterviews}</div>
          <div className="text-[11px] text-slate-400">Scheduled rounds</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Offers Received</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats?.offersReceived}</div>
          <div className="text-[11px] text-slate-400">Formal employment offers</div>
        </div>
      </div>

      {/* Two Column Grid: Recent Applications & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600" /> Recent Applications
            </h3>
            <Link to="/student/applications" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>

          <div className="flex-1 divide-y divide-slate-100">
            {recentApplications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                You haven't submitted any job applications yet.
              </div>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="p-4 hover:bg-slate-50/70 transition flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-sm text-slate-900">{app.jobTitle}</div>
                    <div className="text-xs text-slate-500">
                      {app.companyName} &bull; <span className="font-medium text-slate-700">{app.salaryPackage}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-purple-600" /> Scheduled Interviews
            </h3>
            <Link to="/student/interviews" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>

          <div className="flex-1 divide-y divide-slate-100">
            {upcomingInterviews.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No interviews scheduled at this time.
              </div>
            ) : (
              upcomingInterviews.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50/70 transition space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm text-slate-900">{item.roundName.replace(/_/g, ' ')}</div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="text-xs text-slate-600">
                    {item.companyName} &bull; {item.jobTitle}
                  </div>
                  <div className="text-xs font-medium text-purple-700">
                    📅 {new Date(item.scheduledAt).toLocaleString()} ({item.mode})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

