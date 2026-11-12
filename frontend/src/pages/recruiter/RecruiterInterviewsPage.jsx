import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import {
  CalendarCheck,
  Clock,
  ExternalLink,
  Edit3
} from 'lucide-react';

export const RecruiterInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeInterview, setActiveInterview] = useState(null);
  const [feedbackStatus, setFeedbackStatus] = useState('COMPLETED');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await interviewService.getCompanyInterviews({ size: 50 });
      setInterviews(res.data?.content || []);
    } catch {
      toast.error('Failed to load company interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleOpenFeedback = (interview) => {
    setActiveInterview(interview);
    setFeedbackStatus(interview.status || 'COMPLETED');
    setFeedbackNotes(interview.feedback || '');
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!activeInterview) return;

    setActionLoading(true);
    try {
      await interviewService.updateFeedback(activeInterview.id, {
        status: feedbackStatus,
        feedback: feedbackNotes,
      });
      toast.success('Interview outcome and notes saved.');
      setFeedbackModalOpen(false);
      fetchInterviews();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          Candidate Evaluation
        </span>
        <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
          Interview <strong className="font-semibold">Coordination</strong>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Scheduled candidate assessments across recruitment rounds.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <CalendarCheck className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Scheduled Interviews</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Schedule candidate evaluation rounds directly from the Candidate Review view.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl spatial-panel spatial-panel-hover p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/25">
                    {item.roundName?.replace(/_/g, ' ')}
                  </span>
                  <StatusBadge status={item.status} />
                </div>

                <div>
                  <h3 className="font-semibold text-base text-white">{item.studentName}</h3>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Role: <strong className="text-zinc-200">{item.jobTitle}</strong> • USN {item.studentUsn}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-xs space-y-1.5 text-zinc-300">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>{new Date(item.scheduledAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Mode: </span>
                    <strong className="text-white">{item.mode}</strong>
                  </div>
                  <div className="truncate">
                    <span className="text-zinc-400">Meeting: </span>
                    {item.locationOrLink?.startsWith('http') ? (
                      <a
                        href={item.locationOrLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        {item.locationOrLink} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-zinc-100 font-medium">{item.locationOrLink}</span>
                    )}
                  </div>
                </div>

                {item.feedback && (
                  <div className="text-xs text-zinc-300 bg-white/[0.04] p-3 rounded-xl border border-white/[0.08]">
                    <strong className="text-zinc-200 block mb-0.5">Feedback</strong>
                    {item.feedback}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenFeedback(item)}
                  className="spatial-btn-secondary"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Record Outcome & Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title={`Interview Assessment — ${activeInterview?.studentName || ''}`}
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label className="spatial-label">Status Outcome</label>
            <select
              value={feedbackStatus}
              onChange={(e) => setFeedbackStatus(e.target.value)}
              className="spatial-input"
            >
              <option value="COMPLETED">Completed</option>
              <option value="RESCHEDULED">Rescheduled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="spatial-label">Interviewer Notes & Rating</label>
            <textarea
              rows={3}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="Technical strengths, problem-solving approach, recommendation..."
              className="spatial-input"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
            <button type="button" onClick={() => setFeedbackModalOpen(false)} className="spatial-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={actionLoading} className="spatial-btn-primary">
              {actionLoading ? 'Saving...' : 'Save Feedback'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruiterInterviewsPage;
