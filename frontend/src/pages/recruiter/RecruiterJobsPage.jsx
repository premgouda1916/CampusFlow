import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  PlusCircle,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  ExternalLink,
  Edit
} from 'lucide-react';

export const RecruiterJobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({
        companyId: user?.companyId,
        size: 50,
      });
      setJobs(res.data.content || []);
    } catch (err) {
      toast.error('Failed to load company openings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const handlePublish = async (id) => {
    try {
      await jobService.publishJob(id);
      toast.success('Job published to student portal!');
      fetchJobs();
    } catch (err) {
      toast.error(err.message || 'Publishing failed');
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm('Are you sure you want to close this job vacancy?')) return;
    try {
      await jobService.closeJob(id);
      toast.success('Job marked as closed.');
      fetchJobs();
    } catch (err) {
      toast.error(err.message || 'Closing failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Company Job Postings</h1>
          <p className="text-xs text-slate-500">Manage placement openings and applicant pipelines for {user?.companyName}.</p>
        </div>

        <Link
          to="/recruiter/jobs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-600/20 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Create Opening
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Job Postings Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your company's first campus recruitment job vacancy with custom eligibility criteria.
          </p>
          <Link
            to="/recruiter/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 transition"
          >
            Create Job Now
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{job.title}</h3>
                  <StatusBadge status={job.status} />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                  <span className="text-slate-800 font-bold">💰 {job.salaryPackage}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </span>
                  <span>Min CGPA: <strong>{job.minCgpa}</strong></span>
                  <span>Depts: <strong>{job.eligibleDepartments}</strong></span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                    <Users className="w-3 h-3" /> {job.totalApplicants} Applicants
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-start md:self-center">
                {job.status === 'DRAFT' && (
                  <button
                    type="button"
                    onClick={() => handlePublish(job.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Publish
                  </button>
                )}

                {job.status === 'PUBLISHED' && (
                  <button
                    type="button"
                    onClick={() => handleClose(job.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                  >
                    Close Job
                  </button>
                )}

                <Link
                  to={`/recruiter/jobs/edit/${job.id}`}
                  className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-slate-100 border border-slate-200 transition"
                  title="Edit Opening"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <Link
                  to="/recruiter/applicants"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition"
                >
                  Review ({job.totalApplicants})
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobsPage;

