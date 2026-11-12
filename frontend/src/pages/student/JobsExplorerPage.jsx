import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobService, applicationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import EligibilityModal from '../../components/EligibilityModal';
import {
  Search,
  Briefcase,
  MapPin,
  Sparkles,
  CheckCircle2,
  XCircle,
  Building2
} from 'lucide-react';

export const JobsExplorerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [applying, setApplying] = useState(false);

  const toast = useToast();

  const fetchJobs = async (query) => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({
        status: 'PUBLISHED',
        search: (query ?? search).trim() || undefined,
        size: 30,
      });
      setJobs(res.data?.content || []);
    } catch {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const paramQuery = searchParams.get('search') || '';
    setSearch(paramQuery);
    fetchJobs(paramQuery);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      setSearchParams({ search: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const handleCheckEligibility = async (job) => {
    setSelectedJob(job);
    setEligibility(null);
    setEvaluating(true);
    try {
      const res = await jobService.checkEligibility(job.id);
      setEligibility(res.data);
    } catch (err) {
      toast.error(err.message || 'Could not evaluate eligibility');
      setSelectedJob(null);
    } finally {
      setEvaluating(false);
    }
  };

  const handleApplyFromModal = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      await applicationService.applyForJob(selectedJob.id, {
        notes: 'Submitted via CampusFlow eligibility portal',
      });
      toast.success('Application submitted successfully.');
      setEligibility((prev) => (prev ? { ...prev, alreadyApplied: true } : prev));
      fetchJobs(search);
    } catch (err) {
      toast.error(err.message || 'Application submission failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Placement Market
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
            Campus <strong className="font-semibold">Opportunities</strong>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified corporate job postings with real-time dynamic eligibility screening.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, skills, company..."
              className="spatial-input pl-9"
            />
          </div>
          <button type="submit" className="spatial-btn-primary">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <Briefcase className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Job Openings Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try clearing your search filter or check back when companies publish new drives.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl spatial-panel spatial-panel-hover p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                    {job.companyName?.charAt(0)}
                  </div>
                  <div>
                    {job.userEligible === true && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                        <CheckCircle2 className="w-3 h-3" /> Eligible
                      </span>
                    )}
                    {job.userEligible === false && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/25">
                        <XCircle className="w-3 h-3" /> Criteria Not Met
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-base text-white group-hover:text-emerald-300 transition">
                    {job.title}
                  </h3>
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {job.companyName}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-semibold text-emerald-300">
                    {job.salaryPackage}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                    <MapPin className="w-3 h-3 text-zinc-400" /> {job.location}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-400 space-y-1.5 pt-2.5 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span>
                      Min CGPA: <strong className="text-zinc-200">{job.minCgpa}</strong>
                    </span>
                    <span>
                      Max Backlogs: <strong className="text-zinc-200">{job.maxBacklogs}</strong>
                    </span>
                  </div>
                  <div className="truncate">
                    Branches: <span className="text-zinc-200">{job.eligibleDepartments}</span>
                  </div>
                  {job.requiredSkills && (
                    <div className="truncate">
                      Skills: <span className="text-teal-300">{job.requiredSkills}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <Link to={`/student/jobs/${job.id}`} className="spatial-btn-secondary">
                  Details
                </Link>

                <button
                  type="button"
                  onClick={() => handleCheckEligibility(job)}
                  className="flex-1 spatial-btn-primary"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Check Eligibility</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <EligibilityModal
          isOpen={!!selectedJob}
          onClose={() => {
            setSelectedJob(null);
            setEligibility(null);
          }}
          job={selectedJob}
          eligibility={eligibility}
          loading={evaluating}
          onApply={handleApplyFromModal}
          applying={applying}
        />
      )}
    </div>
  );
};

export default JobsExplorerPage;
