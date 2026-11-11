import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService, applicationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import EligibilityModal from '../../components/EligibilityModal';
import StatusBadge from '../../components/StatusBadge';
import {
  Search,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
  Building
} from 'lucide-react';

export const JobsExplorerPage = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Eligibility Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [applying, setApplying] = useState(false);

  const toast = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({
        status: 'PUBLISHED',
        search: search.trim() || undefined,
        size: 30,
      });
      setJobs(res.data.content || []);
    } catch (err) {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleCheckEligibility = async (job) => {
    setSelectedJob(job);
    setEvaluating(true);
    try {
      const res = await jobService.checkEligibility(job.id);
      setEligibilityData(res.data);
    } catch (err) {
      toast.error(err.message || 'Could not verify eligibility');
    } finally {
      setEvaluating(false);
    }
  };

  const handleApplyFromModal = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      await applicationService.applyForJob(selectedJob.id, { notes: 'Submitted via CampusFlow portal' });
      toast.success('Application submitted successfully!');
      setEligibilityData((prev) => ({ ...prev, alreadyApplied: true }));
      fetchJobs();
    } catch (err) {
      toast.error(err.message || 'Application submission failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Campus Placement Opportunities
          </h1>
          <p className="text-xs text-slate-500">
            Explore verified corporate openings with automatic eligibility pre-screening.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, skill, company..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Job Openings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or check back later for newly published drives.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {job.companyName.charAt(0)}
                  </div>
                  <div>
                    {job.userEligible === true && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Eligible
                      </span>
                    )}
                    {job.userEligible === false && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-600" /> Ineligible
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition">
                    {job.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> {job.companyName}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800">
                    💰 {job.salaryPackage}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border text-slate-600">
                    <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400">Min CGPA:</span> <strong className="text-slate-700">{job.minCgpa}</strong> &bull;{' '}
                    <span className="text-slate-400">Depts:</span> <strong className="text-slate-700">{job.eligibleDepartments}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Deadline:</span>{' '}
                    <span className="font-medium text-slate-700">
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCheckEligibility(job)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition text-center"
                >
                  Check Eligibility
                </button>
                <Link
                  to={`/student/jobs/${job.id}`}
                  className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 transition"
                  title="View full description"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Eligibility Modal with Dynamic Engine breakdown */}
      <EligibilityModal
        isOpen={!!selectedJob}
        onClose={() => {
          setSelectedJob(null);
          setEligibilityData(null);
        }}
        eligibility={eligibilityData}
        onApply={handleApplyFromModal}
        applying={applying}
      />
    </div>
  );
};

export default JobsExplorerPage;
