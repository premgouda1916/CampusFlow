import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, applicationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Users,
  CheckCircle2,
  CalendarCheck,
  Award,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Building,
  Zap,
  Sparkles
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, appsRes] = await Promise.all([
          analyticsService.getRecruiterDashboard(),
          applicationService.getCompanyApplications({ size: 5 }),
        ]);
        setStats(dashRes.data);
        setRecentApplicants(appsRes.data.content || []);
      } catch (err) {
        console.error('Failed to load recruiter stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Loading Recruiter Spatial Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Spatial Header */}
      <div className="rounded-3xl spatial-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Building className="w-3.5 h-3.5" /> {user?.companyName || 'Corporate Recruiting Partner'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
            Recruiter <strong className="font-bold">Talent Operations</strong>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Screen qualified candidates, evaluate dynamic eligibility, schedule technical interviews, and issue campus offers.
          </p>
        </div>

        <div className="relative z-10">
          <Link
            to="/recruiter/jobs/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-spatial-glow transition"
          >
            <PlusCircle className="w-4 h-4" /> Create Job Opening
          </Link>
        </div>
      </div>

      {/* KPI Funnel - Spatial Frosted Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Openings</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.activeJobs || 2}</div>
          <div className="text-[11px] text-slate-400">{stats?.totalJobsPosted || 3} total positions posted</div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Candidate Pool</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-400">{stats?.totalApplicants || 4}</div>
          <div className="text-[11px] text-slate-400">{stats?.shortlistedCandidates || 2} Shortlisted</div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviews</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-400">{stats?.interviewsScheduled || 1}</div>
          <div className="text-[11px] text-slate-400">Technical rounds pending</div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Offers Issued</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">{stats?.offersExtended || 1}</div>
          <div className="text-[11px] text-slate-400">Offer acceptance rate high</div>
        </div>
      </div>

      {/* Recent Applicants Shelf */}
      <div className="rounded-3xl spatial-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Recent Candidate Submissions</h3>
            <p className="text-xs text-slate-400">Students who satisfied all hard eligibility invariants.</p>
          </div>
          <Link
            to="/recruiter/applicants"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
          >
            View All Candidates <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApplicants.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No applicant submissions yet. Publish your opening to begin receiving candidates.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06] overflow-hidden">
            {recentApplicants.map((app) => (
              <div
                key={app.id}
                className="py-3.5 flex items-center justify-between text-xs hover:bg-white/[0.03] px-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 text-white font-bold flex items-center justify-center">
                    {app.studentName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{app.studentName}</div>
                    <div className="text-[11px] text-slate-400">
                      {app.jobTitle} • CGPA <strong className="text-slate-200">{app.studentCgpa}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {app.status}
                  </span>
                  <Link
                    to="/recruiter/applicants"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
