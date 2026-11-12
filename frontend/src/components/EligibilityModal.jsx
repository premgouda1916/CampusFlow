import React from 'react';
import Modal from './Modal';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, Send } from 'lucide-react';

export const EligibilityModal = ({
  isOpen,
  onClose,
  job,
  eligibility,
  eligibilityData,
  loading,
  onApply,
  applying,
}) => {
  if (!isOpen) return null;

  const data = eligibility || eligibilityData;
  const title = data?.jobTitle || job?.title || 'Eligibility Evaluation';

  if (loading || !data) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Evaluating Eligibility" maxWidth="max-w-xl">
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">
            Running institutional eligibility checks...
          </span>
        </div>
      </Modal>
    );
  }

  const {
    eligible,
    overallMatchScore = 0,
    criteriaEvaluations = [],
    rejectionReasons = [],
    missingSkills = [],
    matchedSkills = [],
    alreadyApplied,
  } = data;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Eligibility Assessment${job?.companyName ? ` — ${job.companyName}` : ''}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Top Summary */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
            eligible
              ? 'bg-emerald-500/[0.08] border-emerald-500/25'
              : 'bg-rose-500/[0.08] border-rose-500/25'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              {eligible ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <XCircle className="w-3.5 h-3.5" /> Criteria Not Met
                </span>
              )}
              {alreadyApplied && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-zinc-200 border border-white/20">
                  Already Applied
                </span>
              )}
            </div>
            <h4 className="text-base font-semibold text-white">{title}</h4>
            <p className="text-xs text-zinc-300">
              {eligible
                ? 'Your academic credentials satisfy all role requirements.'
                : 'One or more institutional criteria were not met for this role.'}
            </p>
          </div>

          <div className="text-center px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 shrink-0">
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">
              {Math.round(overallMatchScore)}%
            </div>
            <div className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
              Profile Fit
            </div>
          </div>
        </div>

        {/* Unfulfilled Conditions */}
        {!eligible && rejectionReasons.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-500/[0.08] border border-rose-500/25 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4" /> Unfulfilled Requirements
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 text-zinc-300 pl-1">
              {rejectionReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Criteria Breakdown */}
        <div className="space-y-2">
          <h5 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Criterion Breakdown
          </h5>
          <div className="border border-white/10 rounded-2xl divide-y divide-white/[0.06] overflow-hidden bg-white/[0.02]">
            {criteriaEvaluations.map((c, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-white">{c.criterionName || c.ruleName}</div>
                    <div className="text-[11px] text-zinc-400">{c.message}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-zinc-500">Req: {c.requiredValue}</div>
                  <div className={`font-mono font-semibold ${c.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {c.studentValue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl spatial-panel space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Matched Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[11px]"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-zinc-500 text-[11px]">No direct skill overlap</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl spatial-panel space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Missing Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.length > 0 ? (
                missingSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[11px]"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-emerald-400 text-[11px]">All required skills satisfied</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
          <button type="button" onClick={onClose} className="spatial-btn-secondary">
            Close
          </button>

          {eligible && !alreadyApplied && onApply && (
            <button
              type="button"
              onClick={onApply}
              disabled={applying}
              className="spatial-btn-primary"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{applying ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EligibilityModal;
