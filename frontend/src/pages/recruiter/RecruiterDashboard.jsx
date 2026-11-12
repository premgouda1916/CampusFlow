import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, applicationService, recruiterService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  Users,
  CalendarCheck,
  Award,
  ArrowRight,
  PlusCircle,
  Building2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, appsRes, profRes] = await Promise.all([
          analyticsService.getRecruiterDashboard(),
          applicationService.getCompanyApplications({ size: 5 }),
          recruiterService.getMyProfile(),
        ]);
        setStats(dashRes.data);
        setRecentApplicants(appsRes.data?.content || []);
        setRecruiterProfile(profRes.data);
      } catch (err) {
        console.error('Failed to load recruiter dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">Loading recruiter operations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.08] text-zinc-200 border border-white/15">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {recruiterProfile?.companyName || user?.companyName || 'Corporate Partner'}
            </span>
            {recruiterProfile && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  recruiterProfile.approved
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                }`}
              >
                {recruiterProfile.approved ? (
                  <>
                    <ShieldCheck className="w-3 h-3" /> Verified Recruiter
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" /> Pending Officer Approval
                  </>
                )}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Recruiter <strong className="font-semibold">Talent Operations</strong>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            Screen eligible campus candidates, coordinate technical evaluation rounds, and extend formal offers.
          </p>
        </div>

        <Link to="/recruiter/jobs/new" className="spatial-btn-primary py-3 px-6 shrink-0">
          <PlusCircle className="w-4 h-4" />
          <span>Create Job Opening</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Openings</span>
            <div className="p-2 rounded-xl bg-white/[0.06] text-zinc-300 border border-white/10">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white tabular-nums">
            {stats?.activeJobs ?? 0}
          </div>
          <div className="text-[11px] text-zinc-400">
            {stats?.totalJobsPosted ?? 0} total positions posted
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-600 text-white shadow-spatial-glow border border-emerald-400/35 space-y-2">
          <div className="flex items-center justify-between text-emerald-50">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Applicant Pool</span>
            <div className="p-2 rounded-xl bg-white/15">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tabular-nums">
            {stats?.totalApplicants ?? 0}
          </div>
          <div className="text-[11px] text-emerald-50">
            {stats?.shortlistedCandidates ?? 0} Shortlisted candidates
          </div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Interviews</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white tabular-nums">
            {stats?.scheduledInterviews ?? 0}
          </div>
          <div className="text-[11px] text-zinc-400">Scheduled evaluation rounds</div>
        </div>

        <div className="p-5 rounded-2xl spatial-panel spatial-panel-hover space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Offers Issued</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-emerald-400 tabular-nums">
            {stats?.offersIssued ?? 0}
          </div>
          <div className="text-[11px] text-zinc-400">
            {stats?.offersAccepted ?? 0} Offers accepted
          </div>
        </div>
      </div>

      <div className="rounded-3xl spatial-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-white">Recent Candidate Submissions</h3>
            <p className="text-xs text-zinc-400">Students who satisfied all job eligibility checks.</p>
          </div>
          <Link
            to="/recruiter/applicants"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            Review All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApplicants.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            No candidate submissions yet. Publish an opening to begin receiving applications.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {recentApplicants.map((app) => (
              <div
                key={app.id}
                className="py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-white/[0.03] px-2.5 rounded-xl transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 text-white font-semibold flex items-center justify-center shrink-0">
                    {app.studentName?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{app.studentName}</div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {app.jobTitle} • CGPA <strong className="text-zinc-200">{app.studentCgpa}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={app.status} />
                  <Link
                    to="/recruiter/applicants"
                    className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white transition"
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
