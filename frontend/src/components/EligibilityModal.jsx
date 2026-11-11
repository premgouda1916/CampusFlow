import React from 'react';
import Modal from './Modal';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, Send, Award, Clock } from 'lucide-react';

export const EligibilityModal = ({ isOpen, onClose, eligibility, onApply, applying }) => {
  if (!eligibility) return null;

  const {
    jobTitle,
    eligible,
    overallMatchScore,
    criteriaEvaluations = [],
    rejectionReasons = [],
    missingSkills = [],
    matchedSkills = [],
    alreadyApplied,
    deadlinePassed,
  } = eligibility;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eligibility & Fit Assessment" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Top Header Card */}
        <div
          className={`p-6 rounded-2xl border flex items-center justify-between ${
            eligible
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-200'
              : 'bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-rose-200'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {eligible ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fully Eligible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                  <XCircle className="w-4 h-4 text-rose-600" /> Criteria Not Met
                </span>
              )}
              {alreadyApplied && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Already Applied
                </span>
              )}
            </div>
            <h4 className="text-lg font-bold text-slate-900">{jobTitle}</h4>
            <p className="text-xs text-slate-500">
              {eligible
                ? 'Your academic background and credentials fulfill all institutional criteria.'
                : 'One or more prerequisite requirements were not satisfied for this role.'}
            </p>
          </div>

          <div className="text-center bg-white/80 backdrop-blur p-3 rounded-xl border shadow-sm">
            <div className="text-2xl font-black text-indigo-600">{overallMatchScore}%</div>
            <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Profile Match</div>
          </div>
        </div>

        {/* Rejection Alert if Ineligible */}
        {!eligible && rejectionReasons.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Unfulfilled Conditions:
            </div>
            <ul className="list-disc list-inside text-xs space-y-0.5 pl-1">
              {rejectionReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Individual Criteria Table */}
        <div>
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Institutional Criterion Breakdown
          </h5>
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-sm">
            {criteriaEvaluations.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 hover:bg-slate-50/60 transition">
                <div className="flex items-start gap-3">
                  {c.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium text-slate-800">{c.ruleName}</div>
                    <div className="text-xs text-slate-500">{c.message}</div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="text-slate-400">Req: <span className="text-slate-700 font-medium">{c.requiredValue}</span></div>
                  <div className="text-slate-400">You: <span className={c.passed ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>{c.studentValue}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Compatibility */}
        {(matchedSkills.length > 0 || missingSkills.length > 0) && (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Technical Skill Analysis
            </h5>

            {matchedSkills.length > 0 && (
              <div>
                <span className="text-xs font-medium text-emerald-700 block mb-1.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Matched Skills ({matchedSkills.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {missingSkills.length > 0 && (
              <div>
                <span className="text-xs font-medium text-amber-700 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Skills Desired by Recruiter ({missingSkills.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Close
          </button>

          {eligible && !alreadyApplied && !deadlinePassed && (
            <button
              type="button"
              onClick={onApply}
              disabled={applying}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
              {applying ? 'Submitting Application...' : 'Apply for this Position'}
            </button>
          )}

          {alreadyApplied && (
            <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500" /> Application on Record
            </div>
          )}

          {deadlinePassed && (
            <div className="text-sm font-medium text-rose-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Application Window Closed
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EligibilityModal;

