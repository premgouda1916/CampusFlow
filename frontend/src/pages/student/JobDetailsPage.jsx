import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService, applicationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  MapPin,
  Calendar,
  Building,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Loader2,
  Sparkles,
  Award
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
      } catch (err) {
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
      await applicationService.applyForJob(id, { notes: 'Submitted from detailed view' });
      toast.success('Application submitted successfully!');
      setEligibility((prev) => ({ ...prev, alreadyApplied: true }));
    } catch (err) {
      toast.error(err.message || 'Application submission failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading || !job) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading vacancy details...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        to="/student/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Openings
      </Link>

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              {job.jobType}
            </span>
            <StatusBadge status={job.status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1 text-slate-900 font-bold">
              <Building className="w-4 h-4 text-slate-400" /> {job.companyName}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" /> {job.location}
            </span>
            <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              💰 {job.salaryPackage}
            </span>
          </div>
        </div>

        {/* Action card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-3 min-w-[220px]">
          {eligibility?.alreadyApplied ? (
            <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
              <CheckCircle2 className="w-4 h-4" /> Applied on Record
            </div>
          ) : eligibility?.eligible ? (
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 disabled:opacity-50 transition"
            >
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {applying ? 'Applying...' : 'Submit Application'}
            </button>
          ) : (
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                <XCircle className="w-4 h-4" /> Ineligible to Apply
              </span>
              <p className="text-[11px] text-slate-400">See criteria breakdown below</p>
            </div>
          )}
          <div className="text-[11px] text-slate-400">
            Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Requirements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Role Description & Scope
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Academic & Skill Prerequisites
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 font-medium">Minimum CGPA</div>
                <div className="text-base font-black text-slate-900 mt-0.5">{job.minCgpa} / 10.0</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 font-medium">Max Active Backlogs</div>
                <div className="text-base font-black text-slate-900 mt-0.5">{job.maxBacklogs} allowed</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 font-medium">Qualifying Batch Year</div>
                <div className="text-base font-black text-slate-900 mt-0.5">{job.graduationYear}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 font-medium">Eligible Departments</div>
                <div className="text-base font-black text-slate-900 mt-0.5">{job.eligibleDepartments}</div>
              </div>
            </div>

            {job.requiredSkills && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 block mb-2">Required Technical Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.split(',').map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Live Dynamic Eligibility Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Dynamic Eligibility
              </h4>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {eligibility?.overallMatchScore}% Match
              </span>
            </div>

            {eligibility?.criteriaEvaluations?.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs py-1">
                {c.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-slate-800">{c.ruleName}</div>
                  <div className="text-[11px] text-slate-500">{c.message}</div>
                </div>
              </div>
            ))}

            {eligibility?.missingSkills?.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-amber-700 block mb-1.5">
                  Missing Skills ({eligibility.missingSkills.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {eligibility.missingSkills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
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
