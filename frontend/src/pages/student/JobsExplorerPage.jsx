import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService, applicationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import EligibilityModal from '../../components/EligibilityModal';
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
  Building,
  Zap,
  Clock,
  Layers
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
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Spatial Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl spatial-panel">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-spatial-glow" />
            <span>Placement Market</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
            Campus <strong className="font-bold">Opportunities</strong>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified corporate openings with dynamic eligibility pre-screening engine.
          </p>
        </div>

        {/* Spatial Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, skills, company..."
              className="w-full pl-9 pr-3.5 py-2 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/60 focus:bg-white/[0.08] transition shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-spatial-glow transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-white/[0.03] border border-white/[0.05]"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <Briefcase className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Job Openings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or check back later for newly published placement drives.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl spatial-panel spatial-panel-hover p-5 flex flex-col justify-between space-y-4 relative group min-h-[300px]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white font-black text-base shadow-inner group-hover:scale-105 transition">
                    {job.companyName.charAt(0)}
                  </div>
                  <div>
                    {job.userEligible === true && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Eligible
                      </span>
                    )}
                    {job.userEligible === false && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                        <XCircle className="w-3 h-3 text-rose-400" /> Ineligible
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition">
                    {job.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" /> {job.companyName}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs pt-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/[0.06] border border-white/10 font-mono font-bold text-emerald-400">
                    💰 {job.salaryPackage}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                  </span>
                </div>

                {/* Eligibility requirements */}
                <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span>Min CGPA: <strong className="text-slate-200">{job.minimumCgpa}</strong></span>
                    <span>Max Backlogs: <strong className="text-slate-200">{job.maxBacklogs}</strong></span>
                  </div>
                  <div>
                    Dept: <span className="text-slate-300">{job.eligibleDepartmentCodes?.join(', ') || 'All Branches'}</span>
                  </div>
                  {job.requiredSkills && (
                    <div className="truncate">
                      Skills: <span className="text-blue-300">{job.requiredSkills}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <Link
                  to={`/student/jobs/${job.id}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition"
                >
                  Details
                </Link>

                <button
                  onClick={() => handleCheckEligibility(job)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-spatial-glow transition"
                >
                  <Sparkles className="w-3 h-3 text-cyan-200" />
                  <span>Check Eligibility</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Eligibility Modal */}
      {selectedJob && (
        <EligibilityModal
          isOpen={!!selectedJob}
          onClose={() => {
            setSelectedJob(null);
            setEligibilityData(null);
          }}
          job={selectedJob}
          eligibilityData={eligibilityData}
          loading={evaluating}
          onApply={handleApplyFromModal}
          applying={applying}
        />
      )}
    </div>
  );
};

export default JobsExplorerPage;
