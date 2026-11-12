import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService, applicationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  MapPin,
  Building2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Send,
  Loader2,
  Sparkles,
  Calendar
} from 'lucide-react';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, eligRes] = await Promise.all([
          jobService.getJobById(id),
          jobService.checkEligibility(id),
        ]);
        setJob(jobRes.data);
        setEligibility(eligRes.data);
      } catch {
        toast.error('Failed to load job details');
        navigate('/student/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationService.applyForJob(id, { notes: 'Submitted from detailed role view' });
      toast.success('Application submitted successfully.');
      setEligibility((prev) => (prev ? { ...prev, alreadyApplied: true } : prev));
    } catch (err) {
      toast.error(err.message || 'Application submission failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading || !job) {
    return (
      <div className="p-12 text-center text-xs text-zinc-400">
        Loading role specification...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      <Link
        to="/student/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-400 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities
      </Link>

      <div className="rounded-3xl spatial-panel p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-200 border border-white/15 text-[11px] font-semibold uppercase tracking-wider">
              {job.jobType}
            </span>
            <StatusBadge status={job.status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Building2 className="w-4 h-4 text-emerald-400" /> {job.companyName}
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <MapPin className="w-4 h-4" /> {job.location}
            </span>
            <span className="font-semibold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/25">
              {job.salaryPackage}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center space-y-3 min-w-[220px]">
          {eligibility?.alreadyApplied ? (
            <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 bg-emerald-500/15 px-3.5 py-2 rounded-xl border border-emerald-500/25">
              <CheckCircle2 className="w-4 h-4" /> Application Submitted
            </div>
          ) : eligibility?.eligible ? (
            <button
              type="button"
              onClick={handleApply}
              disabled={applying}
              className="w-full spatial-btn-primary py-3"
            >
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{applying ? 'Applying...' : 'Submit Application'}</span>
            </button>
          ) : (
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300 bg-rose-500/15 px-3.5 py-1.5 rounded-xl border border-rose-500/25">
                <XCircle className="w-4 h-4" /> Criteria Not Met
              </span>
              <p className="text-[11px] text-zinc-400">Review breakdown on the right</p>
            </div>
          )}
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl spatial-panel p-6 sm:p-7 space-y-3">
            <h3 className="text-sm font-semibold text-white border-b border-white/[0.08] pb-3">
              Role Description & Scope
            </h3>
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          <div className="rounded-3xl spatial-panel p-6 sm:p-7 space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/[0.08] pb-3">
              Academic & Technical Prerequisites
            </h3>
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <div className="text-zinc-400">Minimum CGPA</div>
                <div className="text-base font-semibold text-white mt-0.5">{job.minCgpa} / 10.0</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <div className="text-zinc-400">Max Active Backlogs</div>
                <div className="text-base font-semibold text-white mt-0.5">{job.maxBacklogs} allowed</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <div className="text-zinc-400">Qualifying Batch</div>
                <div className="text-base font-semibold text-white mt-0.5">{job.graduationYear}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <div className="text-zinc-400">Eligible Branches</div>
                <div className="text-base font-semibold text-white mt-0.5">{job.eligibleDepartments}</div>
              </div>
            </div>

            {job.requiredSkills && (
              <div className="pt-2">
                <span className="text-xs font-medium text-zinc-400 block mb-2">
                  Required Technical Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.split(',').map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.05] text-zinc-200 border border-white/10"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-3xl spatial-panel p-6 space-y-4 sticky top-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Eligibility Check
              </h4>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 rounded-full tabular-nums">
                {Math.round(eligibility?.overallMatchScore ?? 0)}% Match
              </span>
            </div>

            <div className="space-y-3">
              {eligibility?.criteriaEvaluations?.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-zinc-100">{c.criterionName || c.ruleName}</div>
                    <div className="text-[11px] text-zinc-400">{c.message}</div>
                  </div>
                </div>
              ))}
            </div>

            {eligibility?.missingSkills?.length > 0 && (
              <div className="pt-3 border-t border-white/[0.08]">
                <span className="text-[11px] font-semibold text-amber-300 block mb-2">
                  Missing Skills ({eligibility.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {eligibility.missingSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-[11px] bg-amber-500/15 text-amber-300 border border-amber-500/25"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
