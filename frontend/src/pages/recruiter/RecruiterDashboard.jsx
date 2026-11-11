import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, applicationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  Users,
  CheckCircle2,
  CalendarCheck,
  Award,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Building
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
    return <div className="p-12 text-center text-xs text-slate-400">Loading recruiter dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Building className="w-3.5 h-3.5" /> {user?.companyName || 'Corporate Partner'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruiter Talent Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Manage your company's campus recruitment campaigns, screen qualified students, conduct technical interviews, and issue job offers.
          </p>
        </div>

        <div>
          <Link
            to="/recruiter/jobs/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/30 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" /> Post New Job Opening
          </Link>
        </div>
      </div>

      {/* Stats Funnel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Openings</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.activeJobs}</div>
          <div className="text-[11px] text-slate-400">{stats?.totalJobsPosted} total positions posted</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Applicants</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalApplicants}</div>
          <div className="text-[11px] text-slate-400">{stats?.shortlistedCandidates} Shortlisted</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Interviews</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.scheduledInterviews}</div>
          <div className="text-[11px] text-slate-400">Rounds conducted/scheduled</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Offers Accepted</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats?.offersAccepted}</div>
          <div className="text-[11px] text-slate-400">Of {stats?.offersIssued} extended offers</div>
        </div>
      </div>

      {/* Recent Applicants Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Candidates</h3>
            <p className="text-xs text-slate-400">Candidates who submitted applications for your company roles.</p>
          </div>
          <Link
            to="/recruiter/applicants"
            className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
          >
            Review All Applicants <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-bold">Candidate</th>
                <th className="px-6 py-3 font-bold">Job Role</th>
                <th className="px-6 py-3 font-bold">Dept & CGPA</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No applicants recorded for your positions yet.
                  </td>
                </tr>
              ) : (
                recentApplicants.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{a.studentName}</div>
                      <div className="text-[11px] text-slate-400">{a.studentUsn}</div>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-700">{a.jobTitle}</td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-slate-800">{a.studentDepartment}</span> &bull;{' '}
                      <span className="text-emerald-700 font-bold">{a.studentCgpa} CGPA</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to="/recruiter/applicants"
                        className="text-xs font-semibold text-teal-600 hover:text-teal-800"
                      >
                        Review
                      </Link>
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

export default RecruiterDashboard;

