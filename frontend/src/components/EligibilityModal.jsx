import React from 'react';
import Modal from './Modal';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, Send, Award, Clock } from 'lucide-react';

export const EligibilityModal = ({ isOpen, onClose, job, eligibilityData, loading, onApply, applying }) => {
  if (!isOpen) return null;

  const title = job?.title || 'Eligibility Evaluation';

  if (loading || !eligibilityData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Evaluating Spatial Eligibility..." maxWidth="max-w-xl">
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Running Dynamic Invariant Checks...</span>
        </div>
      </Modal>
    );
  }

  const {
    eligible,
    matchScorePercentage = 0,
    criteriaBreakdown = [],
    rejectionReasons = [],
    missingSkills = [],
    matchedSkills = [],
    alreadyApplied,
    deadlinePassed,
  } = eligibilityData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Eligibility Assessment • ${job?.companyName || ''}`} maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Top Status Card */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between relative overflow-hidden ${
            eligible
              ? 'bg-emerald-950/40 border-emerald-500/30 text-white'
              : 'bg-rose-950/40 border-rose-500/30 text-white'
          }`}
        >
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2">
              {eligible ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fully Eligible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  <XCircle className="w-4 h-4 text-rose-400" /> Criteria Not Met
                </span>
              )}
              {alreadyApplied && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Already Applied
                </span>
              )}
            </div>
            <h4 className="text-lg font-bold text-white pt-1">{title}</h4>
            <p className="text-xs text-slate-300">
              {eligible
                ? 'Your academic credentials satisfy all company and institutional requirements.'
                : 'One or more prerequisite requirements were not satisfied.'}
            </p>
          </div>

          {/* Profile Match Score Pill */}
          <div className="text-center p-3 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md relative z-10 min-w-[90px]">
            <div className="text-2xl font-black text-blue-400">{Math.round(matchScorePercentage)}%</div>
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Profile Fit</div>
          </div>
        </div>

        {/* Rejection Reasons if Ineligible */}
        {!eligible && rejectionReasons.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-400">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Failed Invariants:
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 pl-1">
              {rejectionReasons.map((reason, idx) => (
                <li key={idx} className="text-slate-300">{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Criteria Breakdown Grid */}
        <div className="space-y-2">
          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
            Institutional Criterion Breakdown
          </h5>
          <div className="border border-white/10 rounded-2xl divide-y divide-white/[0.06] overflow-hidden bg-white/[0.02]">
            {criteriaBreakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-white/[0.04] transition text-xs">
                <div className="flex items-start gap-2.5">
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-white">{c.criterion}</div>
                    <div className="text-[11px] text-slate-400">Requirement: {c.requirement}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-semibold ${c.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {c.studentValue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Alignment */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl spatial-panel space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Matched Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-[11px]">No skill overlap detected</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl spatial-panel space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Missing Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.length > 0 ? (
                missingSkills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-emerald-400 text-[11px]">All required skills satisfied ✓</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition"
          >
            Close
          </button>

          {eligible && !alreadyApplied && (
            <button
              onClick={onApply}
              disabled={applying}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide flex items-center gap-2 shadow-spatial-glow transition disabled:opacity-50"
            >
              {applying ? (
                <span>Submitting Application...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm & Submit Application</span>
                </>
              )}
            </button>
          )}

          {alreadyApplied && (
            <span className="text-xs text-blue-400 font-semibold px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20">
              Application is under recruiter review
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EligibilityModal;
