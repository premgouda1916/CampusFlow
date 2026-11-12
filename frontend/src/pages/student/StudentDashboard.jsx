import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  analyticsService,
  applicationService,
  interviewService,
  jobService,
  studentService
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, profRes, jobsRes, intRes, appsRes] = await Promise.all([
          analyticsService.getStudentDashboard(),
          studentService.getMyProfile(),
          jobService.getJobs({ status: 'PUBLISHED', size: 4 }),
          interviewService.getMyInterviews({ size: 4 }),
          applicationService.getMyApplications({ size: 4 }),
        ]);
        setStats(dashRes.data);
        setProfile(profRes.data);
        setJobs(jobsRes.data?.content || []);
        setInterviews(intRes.data?.content || []);
        setApplications(appsRes.data?.content || []);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
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
          <span className="text-xs text-zinc-400 font-medium">Loading placement overview...</span>
        </div>
      </div>
    );
  }

  const completionPct = Math.round(stats?.profileCompletionPercentage ?? 0);
  const circumference = 2 * Math.PI * 62;
  const strokeOffset = circumference - (completionPct / 100) * circumference;

  const skillCount = profile?.skills
    ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean).length
    : 0;

  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        {/* Column 1: Placement Readiness Overview (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl spatial-panel p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Candidate Overview
              </span>
              {profile?.placed ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  <CheckCircle2 className="w-3 h-3" /> Placed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.06] text-zinc-300 border border-white/10">
                  {profile?.departmentCode || 'Batch'} • {profile?.graduationYear}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight pt-1">
              Placement <strong className="font-semibold">Readiness</strong>
            </h1>
            <p className="text-xs text-zinc-400">
              {user?.fullName} • USN {profile?.usn}
            </p>
          </div>

          {/* Interactive SVG Readiness Core */}
          <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 144 144">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  fill="none"
                  stroke="url(#readinessGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-semibold text-white tabular-nums">{completionPct}%</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Profile Ready
                </span>
              </div>
            </div>

            <div className="w-full space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cumulative CGPA
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {profile?.currentCgpa ?? '0.00'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" /> Active Backlogs
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {profile?.backlogCount ?? 0}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Resume Status
                </span>
                <span className={`font-semibold ${profile?.resumeUrl ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {profile?.resumeUrl ? 'Uploaded' : 'Missing'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs relative z-10">
            <span className="text-zinc-400">
              {skillCount} Verified Technical Skills
            </span>
            <Link
              to="/student/profile"
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 transition"
            >
              Manage Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Column 2: Pipeline Metrics 2x2 Grid (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Recruitment Metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="rounded-2xl spatial-panel spatial-panel-hover p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[11px] font-medium">Available Roles</span>
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-white tabular-nums">
                  {stats?.totalAvailableJobs ?? 0}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Published drives</div>
              </div>
            </div>

            {/* Highlighted Action Card */}
            <Link
              to="/student/jobs"
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 p-4 flex flex-col justify-between text-white shadow-spatial-glow border border-emerald-400/35 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-50">Eligible Roles</span>
                <Zap className="w-3.5 h-3.5 text-emerald-100" />
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">
                  {stats?.eligibleJobsCount ?? 0}
                </div>
                <div className="text-[11px] text-emerald-50 flex items-center gap-1 mt-0.5">
                  <span>Ready to apply</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </Link>

            <Link
              to="/student/applications"
              className="rounded-2xl spatial-panel spatial-panel-hover p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[11px] font-medium">Applications</span>
                <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-white tabular-nums">
                  {stats?.applicationsSubmitted ?? 0}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {stats?.shortlistedApplications ?? 0} Shortlisted
                </div>
              </div>
            </Link>

            <Link
              to="/student/offers"
              className="rounded-2xl spatial-panel spatial-panel-hover p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[11px] font-medium">Offers Received</span>
                <Award className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-emerald-400 tabular-nums">
                  {stats?.offersReceived ?? 0}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {stats?.upcomingInterviews ?? 0} Upcoming interviews
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Column 3: Schedule & Activity (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Schedule & Activity</span>
          </div>

          <div className="rounded-3xl spatial-panel p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>
                    {interviews.length > 0 ? 'Upcoming Interviews' : 'Recent Applications'}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 tabular-nums">
                  {interviews.length > 0 ? interviews.length : applications.length}
                </span>
              </div>

              {interviews.length > 0 ? (
                <div className="space-y-2.5">
                  {interviews.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {item.companyName}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">{item.jobTitle}</div>
                      <div className="text-[10px] text-emerald-300 font-mono">
                        {new Date(item.scheduledAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : applications.length > 0 ? (
                <div className="space-y-2.5">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {app.companyName}
                        </span>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">{app.jobTitle}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No scheduled interviews or active applications yet.
                </div>
              )}
            </div>

            <Link
              to={interviews.length > 0 ? '/student/interviews' : '/student/applications'}
              className="w-full spatial-btn-primary py-2.5"
            >
              <span>{interviews.length > 0 ? 'View Interview Schedule' : 'View All Applications'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Openings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active Campus Openings</span>
          </div>
          <Link
            to="/student/jobs"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition"
          >
            Browse all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl spatial-panel p-8 text-center text-xs text-zinc-500">
            No published campus job openings available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/student/jobs/${job.id}`)}
                className={`rounded-2xl p-4 flex flex-col justify-between min-h-[150px] cursor-pointer spatial-panel spatial-panel-hover group ${
                  job.userEligible ? 'border-emerald-500/25' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                    {job.companyName?.charAt(0)}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      job.userEligible
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                        : 'bg-white/[0.05] text-zinc-400 border-white/10'
                    }`}
                  >
                    {job.userEligible ? 'Eligible' : 'Review Criteria'}
                  </span>
                </div>

                <div className="pt-3 space-y-1">
                  <div className="text-[11px] text-zinc-400 truncate">{job.companyName}</div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition line-clamp-1">
                    {job.title}
                  </h3>
                </div>

                <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-400">{job.salaryPackage}</div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {job.location}
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] group-hover:bg-emerald-600 text-zinc-300 group-hover:text-white flex items-center justify-center transition">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
