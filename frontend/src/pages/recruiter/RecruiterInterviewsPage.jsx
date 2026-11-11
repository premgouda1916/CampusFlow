import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import {
  CalendarCheck,
  Clock,
  Video,
  User,
  CheckCircle2,
  XCircle,
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
      setInterviews(res.data.content || []);
    } catch (err) {
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
      toast.success('Interview outcome and notes updated.');
      setFeedbackModalOpen(false);
      fetchInterviews();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interview Coordination</h1>
        <p className="text-xs text-slate-500">Scheduled candidate assessments across all recruitment rounds.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Scheduled Interviews</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Schedule candidate evaluation rounds directly from the Candidate Review table.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                  {item.roundName?.replace(/_/g, ' ')}
                </span>
                <StatusBadge status={item.status} />
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{item.studentName}</h3>
                <div className="text-xs font-medium text-slate-500">
                  Role: <strong className="text-slate-800">{item.jobTitle}</strong> &bull; USN: {item.studentUsn}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>{new Date(item.scheduledAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400">Mode: </span>
                  <strong className="text-slate-800">{item.mode}</strong>
                </div>
                <div className="truncate">
                  <span className="text-slate-400">Meeting: </span>
                  {item.locationOrLink?.startsWith('http') ? (
                    <a
                      href={item.locationOrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      {item.locationOrLink} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-800 font-medium">{item.locationOrLink}</span>
                  )}
                </div>
              </div>

              {item.feedback && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong className="text-slate-700 block">Feedback:</strong>
                  {item.feedback}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenFeedback(item)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Record Outcome & Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Outcome Modal */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title={`Interview Assessment: ${activeInterview?.studentName}`}
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status Outcome</label>
            <select
              value={feedbackStatus}
              onChange={(e) => setFeedbackStatus(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            >
              <option value="COMPLETED">Completed</option>
              <option value="RESCHEDULED">Rescheduled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Interviewer Notes & Rating</label>
            <textarea
              rows={3}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="Technical strengths, problem-solving speed, areas for improvement..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFeedbackModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition"
            >
              {actionLoading ? 'Saving...' : 'Save Feedback'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruiterInterviewsPage;

