import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  PlusCircle,
  Users,
  CheckCircle2,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react';

export const RecruiterJobsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({
        companyId: user?.companyId,
        search: searchParams.get('search') || undefined,
        size: 50,
      });
      setJobs(res.data?.content || []);
    } catch {
      toast.error('Failed to load company openings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user, searchParams]);

  const handlePublish = async (id) => {
    try {
      await jobService.publishJob(id);
      toast.success('Job published to student portal.');
      fetchJobs();
    } catch (err) {
      toast.error(err.message || 'Publishing failed');
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm('Close this job vacancy to new applications?')) return;
    try {
      await jobService.closeJob(id);
      toast.success('Job marked as closed.');
      fetchJobs();
    } catch (err) {
      toast.error(err.message || 'Closing failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draft job posting?')) return;
    try {
      await jobService.deleteJob(id);
      toast.success('Job deleted.');
      fetchJobs();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Talent Requisitions
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
            Company <strong className="font-semibold">Job Openings</strong>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage job descriptions, eligibility criteria, and publication state for {user?.companyName || 'your enterprise'}.
          </p>
        </div>

        <Link to="/recruiter/jobs/new" className="spatial-btn-primary self-start sm:self-auto">
          <PlusCircle className="w-4 h-4" />
          <span>Create Opening</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <Briefcase className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Job Postings Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Create your company's first campus recruitment job vacancy with custom eligibility criteria.
          </p>
          <div className="pt-2">
            <Link to="/recruiter/jobs/new" className="spatial-btn-primary">
              Create Opening
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl spatial-panel divide-y divide-white/[0.07] overflow-hidden">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-5 sm:p-6 hover:bg-white/[0.03] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-semibold text-base text-white">{job.title}</h3>
                  <StatusBadge status={job.status} />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                  <span className="font-semibold text-emerald-300">{job.salaryPackage}</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  <span className="text-zinc-400">
                    Min CGPA: <strong className="text-zinc-100">{job.minCgpa}</strong>
                  </span>
                  <span className="text-zinc-400">
                    Branches: <strong className="text-zinc-100">{job.eligibleDepartments}</strong>
                  </span>
                </div>

                <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                  <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1 text-zinc-200 font-medium bg-white/[0.06] border border-white/15 px-2.5 py-0.5 rounded-full">
                    <Users className="w-3 h-3 text-emerald-400" /> {job.totalApplicants} Applicants
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                {job.status === 'DRAFT' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePublish(job.id)}
                      className="spatial-btn-primary"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      title="Delete Draft"
                      className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/15 border border-white/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}

                {job.status === 'PUBLISHED' && (
                  <button
                    type="button"
                    onClick={() => handleClose(job.id)}
                    className="spatial-btn-secondary"
                  >
                    Close Job
                  </button>
                )}

                <Link
                  to={`/recruiter/jobs/edit/${job.id}`}
                  className="p-2 rounded-xl text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 transition"
                  title="Edit Opening"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <Link
                  to="/recruiter/applicants"
                  className="spatial-btn-primary"
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
