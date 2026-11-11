import React, { useState, useEffect } from 'react';
import { applicationService, jobService, interviewService, offerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Award,
  FileText,
  ExternalLink,
  Loader2,
  Send,
  Building
} from 'lucide-react';

export const RecruiterApplicantsPage = () => {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Status Change Dialog State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeApp, setActiveApp] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [statusComment, setStatusComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Schedule Interview Dialog State
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({
    roundName: 'TECHNICAL_ROUND_1',
    scheduledAt: '2026-11-20T14:00',
    mode: 'ONLINE',
    locationOrLink: 'https://meet.google.com/cfg-campus-flow',
    instructions: 'Technical round on Algorithms, System Architecture and Data Structures.',
  });

  // Issue Offer Dialog State
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerData, setOfferData] = useState({
    jobDesignation: 'Software Development Engineer',
    salaryPackage: '18 LPA',
    joiningDate: '2027-07-15',
    offerExpirationDate: '2026-12-15',
    offerLetterUrl: '',
  });

  const toast = useToast();

  const fetchJobs = async () => {
    try {
      const res = await jobService.getJobs({ companyId: user?.companyId, size: 50 });
      setJobs(res.data.content || []);
    } catch (ignored) {}
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      let res;
      if (selectedJobId) {
        res = await applicationService.getJobApplications(selectedJobId, {
          status: selectedStatus || undefined,
          size: 50,
        });
      } else {
        res = await applicationService.getCompanyApplications({
          status: selectedStatus || undefined,
          size: 50,
        });
      }
      setApplicants(res.data.content || []);
    } catch (err) {
      toast.error('Failed to load candidate applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  useEffect(() => {
    fetchApplicants();
  }, [selectedJobId, selectedStatus]);

  const handleOpenStatusModal = (app, targetStatus) => {
    setActiveApp(app);
    setNewStatus(targetStatus);
    setStatusComment(
      targetStatus === 'SHORTLISTED'
        ? 'Profile meets technical cutoff and strong academic profile.'
        : targetStatus === 'REJECTED'
        ? 'Application does not fulfill current batch requirements.'
        : ''
    );
    setStatusModalOpen(true);
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    setActionLoading(true);
    try {
      await applicationService.updateStatus(activeApp.id, {
        status: newStatus,
        comment: statusComment,
      });
      toast.success(`Application updated to ${newStatus}`);
      setStatusModalOpen(false);
      fetchApplicants();
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenInterviewModal = (app) => {
    setActiveApp(app);
    setInterviewData((prev) => ({
      ...prev,
      jobDesignation: app.jobTitle,
    }));
    setInterviewModalOpen(true);
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    setActionLoading(true);
    try {
      const payload = {
        ...interviewData,
        scheduledAt: interviewData.scheduledAt.length === 16 ? interviewData.scheduledAt + ':00' : interviewData.scheduledAt,
      };
      await interviewService.scheduleInterview(activeApp.id, payload);
      toast.success('Interview scheduled and invitation dispatched to candidate!');
      setInterviewModalOpen(false);
      fetchApplicants();
    } catch (err) {
      toast.error(err.message || 'Interview scheduling failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenOfferModal = (app) => {
    setActiveApp(app);
    setOfferData({
      jobDesignation: app.jobTitle,
      salaryPackage: app.salaryPackage || '18 LPA',
      joiningDate: '2027-07-15',
      offerExpirationDate: '2026-12-31',
      offerLetterUrl: 'https://storage.campusflow.io/offers/formal_offer_' + app.studentUsn + '.pdf',
    });
    setOfferModalOpen(true);
  };

  const handleCreateOfferSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    setActionLoading(true);
    try {
      await offerService.createOffer(activeApp.id, offerData);
      toast.success('Employment offer successfully extended to student!');
      setOfferModalOpen(false);
      fetchApplicants();
    } catch (err) {
      toast.error(err.message || 'Offer issuance failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Applicant Review</h1>
          <p className="text-xs text-slate-500">Screen verified campus candidates, schedule interview rounds and issue offers.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          >
            <option value="">All Job Positions</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Not Selected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Candidate Applications Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your filters or publish open positions to start receiving verified student applications.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {applicants.map((a) => (
            <div key={a.id} className="p-6 hover:bg-slate-50/60 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{a.studentName}</h3>
                  <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-100">
                    USN: {a.studentUsn}
                  </span>
                  <StatusBadge status={a.status} />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
                  <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                    Applying for: {a.jobTitle}
                  </span>
                  <span>Dept: <strong className="text-slate-800">{a.studentDepartment}</strong></span>
                  <span>CGPA: <strong className="text-emerald-700">{a.studentCgpa}</strong></span>
                  <span>Backlogs: <strong className="text-slate-800">{a.studentBacklogs}</strong></span>
                </div>

                {a.studentSkills && (
                  <div className="text-xs text-slate-500 flex flex-wrap gap-1 pt-1">
                    {a.studentSkills.split(',').map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 flex items-center gap-4 pt-1">
                  <span>Applied: {new Date(a.appliedAt).toLocaleDateString()}</span>
                  {a.studentResumeUrl && (
                    <a
                      href={a.studentResumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Resume PDF <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Recruitment Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                {a.status === 'APPLIED' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenStatusModal(a, 'SHORTLISTED')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-sm transition"
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenStatusModal(a, 'REJECTED')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                    >
                      Reject
                    </button>
                  </>
                )}

                {(a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED') && (
                  <button
                    type="button"
                    onClick={() => handleOpenInterviewModal(a)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" /> Schedule Interview
                  </button>
                )}

                {a.status !== 'SELECTED' && a.status !== 'REJECTED' && (
                  <button
                    type="button"
                    onClick={() => handleOpenOfferModal(a)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition"
                  >
                    <Award className="w-3.5 h-3.5" /> Extend Offer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Application: ${activeApp?.studentName}`}
      >
        <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">New State</label>
            <div className="text-sm font-bold text-slate-800">{newStatus}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Internal Recruiter Note / Comment
            </label>
            <textarea
              rows={3}
              required
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 transition"
            >
              {actionLoading ? 'Updating...' : 'Confirm Status Update'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title={`Schedule Interview: ${activeApp?.studentName}`}
      >
        <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Interview Round *</label>
              <select
                value={interviewData.roundName}
                onChange={(e) => setInterviewData({ ...interviewData, roundName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="APTITUDE">Aptitude Assessment</option>
                <option value="TECHNICAL_ROUND_1">Technical Round 1 (Coding)</option>
                <option value="TECHNICAL_ROUND_2">Technical Round 2 (System Design)</option>
                <option value="HR_ROUND">HR Culture Assessment</option>
                <option value="FINAL_INTERVIEW">Final Director Interview</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Scheduled Slot *</label>
              <input
                type="datetime-local"
                required
                value={interviewData.scheduledAt}
                onChange={(e) => setInterviewData({ ...interviewData, scheduledAt: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mode *</label>
              <select
                value={interviewData.mode}
                onChange={(e) => setInterviewData({ ...interviewData, mode: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ONLINE">Online Virtual</option>
                <option value="IN_PERSON">In-Person Campus Venue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Meeting URL or Venue Room *</label>
              <input
                type="text"
                required
                value={interviewData.locationOrLink}
                onChange={(e) => setInterviewData({ ...interviewData, locationOrLink: e.target.value })}
                placeholder="https://meet.google.com/xyz or Seminar Hall 2"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Candidate Preparation Instructions</label>
              <textarea
                rows={2}
                value={interviewData.instructions}
                onChange={(e) => setInterviewData({ ...interviewData, instructions: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setInterviewModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition"
            >
              {actionLoading ? 'Scheduling...' : 'Dispatch Interview Invite'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Issue Offer Modal */}
      <Modal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        title={`Extend Employment Offer: ${activeApp?.studentName}`}
      >
        <form onSubmit={handleCreateOfferSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Offered Role Title *</label>
              <input
                type="text"
                required
                value={offerData.jobDesignation}
                onChange={(e) => setOfferData({ ...offerData, jobDesignation: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Confirmed Compensation Package *</label>
              <input
                type="text"
                required
                value={offerData.salaryPackage}
                onChange={(e) => setOfferData({ ...offerData, salaryPackage: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Joining *</label>
              <input
                type="date"
                required
                value={offerData.joiningDate}
                onChange={(e) => setOfferData({ ...offerData, joiningDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Offer Acceptance Expiration *</label>
              <input
                type="date"
                required
                value={offerData.offerExpirationDate}
                onChange={(e) => setOfferData({ ...offerData, offerExpirationDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOfferModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              {actionLoading ? 'Extending...' : 'Extend Formal Offer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruiterApplicantsPage;

