import React, { useState, useEffect } from 'react';
import { applicationService, jobService, interviewService, offerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import {
  Users,
  CalendarCheck,
  Award,
  FileText,
  ExternalLink
} from 'lucide-react';

const addDaysIsoDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const RecruiterApplicantsPage = () => {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeApp, setActiveApp] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [statusComment, setStatusComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({
    roundName: 'TECHNICAL_ROUND_1',
    scheduledAt: `${addDaysIsoDate(3)}T14:00`,
    mode: 'ONLINE',
    locationOrLink: 'https://meet.google.com/cfg-campus-flow',
    instructions: 'Technical round on Algorithms, System Architecture and Data Structures.',
  });

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerData, setOfferData] = useState({
    jobDesignation: 'Software Development Engineer',
    salaryPackage: '18 LPA',
    joiningDate: addDaysIsoDate(120),
    offerExpirationDate: addDaysIsoDate(21),
    offerLetterUrl: '',
  });

  const toast = useToast();

  const fetchJobs = async () => {
    try {
      const res = await jobService.getJobs({ companyId: user?.companyId, size: 50 });
      setJobs(res.data?.content || []);
    } catch {
      // Optional filter list
    }
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
      setApplicants(res.data?.content || []);
    } catch {
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
        ? 'Profile meets technical cutoff and academic prerequisites.'
        : targetStatus === 'REJECTED'
        ? 'Application does not align with current round criteria.'
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
    setInterviewData({
      roundName: 'TECHNICAL_ROUND_1',
      scheduledAt: `${addDaysIsoDate(3)}T14:00`,
      mode: 'ONLINE',
      locationOrLink: 'https://meet.google.com/cfg-campus-flow',
      instructions: `Technical round for ${app.jobTitle}.`,
    });
    setInterviewModalOpen(true);
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    setActionLoading(true);
    try {
      const payload = {
        ...interviewData,
        scheduledAt: interviewData.scheduledAt.length === 16
          ? `${interviewData.scheduledAt}:00`
          : interviewData.scheduledAt,
      };
      await interviewService.scheduleInterview(activeApp.id, payload);
      toast.success('Interview scheduled and candidate notified.');
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
      joiningDate: addDaysIsoDate(120),
      offerExpirationDate: addDaysIsoDate(21),
      offerLetterUrl: `https://storage.campusflow.io/offers/formal_offer_${app.studentUsn}.pdf`,
    });
    setOfferModalOpen(true);
  };

  const handleCreateOfferSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    setActionLoading(true);
    try {
      await offerService.createOffer(activeApp.id, offerData);
      toast.success('Employment offer extended to student.');
      setOfferModalOpen(false);
      fetchApplicants();
    } catch (err) {
      toast.error(err.message || 'Offer issuance failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Talent Screening
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
            Candidate <strong className="font-semibold">Applicant Review</strong>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Screen verified campus candidates, schedule interview rounds, and issue offers.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="spatial-input w-auto min-w-[200px]"
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
            className="spatial-input w-auto min-w-[160px]"
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <Users className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Candidate Applications Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try resetting your filters or publish open positions to receive eligible student applications.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl spatial-panel divide-y divide-white/[0.07] overflow-hidden">
          {applicants.map((a) => (
            <div
              key={a.id}
              className="p-5 sm:p-6 hover:bg-white/[0.03] transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-semibold text-base text-white">{a.studentName}</h3>
                  <span className="text-[11px] text-zinc-300 font-medium px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10">
                    USN: {a.studentUsn}
                  </span>
                  <StatusBadge status={a.status} />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                  <span className="text-teal-300 font-semibold bg-teal-500/15 px-2.5 py-0.5 rounded-lg border border-teal-400/25">
                    Role: {a.jobTitle}
                  </span>
                  <span className="text-zinc-400">
                    Dept: <strong className="text-zinc-100">{a.studentDepartment}</strong>
                  </span>
                  <span className="text-zinc-400">
                    CGPA: <strong className="text-emerald-400">{a.studentCgpa}</strong>
                  </span>
                  <span className="text-zinc-400">
                    Backlogs: <strong className="text-zinc-100">{a.studentBacklogs}</strong>
                  </span>
                </div>

                {a.studentSkills && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {a.studentSkills.split(',').map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-zinc-400 flex items-center gap-4 pt-1">
                  <span>Applied: {new Date(a.appliedAt).toLocaleDateString()}</span>
                  {a.studentResumeUrl && (
                    <a
                      href={a.studentResumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Resume <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
                {a.status === 'APPLIED' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenStatusModal(a, 'SHORTLISTED')}
                      className="spatial-btn-primary"
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenStatusModal(a, 'REJECTED')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition"
                    >
                      Reject
                    </button>
                  </>
                )}

                {(a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED') && (
                  <button
                    type="button"
                    onClick={() => handleOpenInterviewModal(a)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 shadow-lg transition"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" /> Schedule Interview
                  </button>
                )}

                {a.status !== 'SELECTED' && a.status !== 'REJECTED' && a.status !== 'WITHDRAWN' && (
                  <button
                    type="button"
                    onClick={() => handleOpenOfferModal(a)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition"
                  >
                    <Award className="w-3.5 h-3.5" /> Extend Offer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Application — ${activeApp?.studentName || ''}`}
      >
        <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
          <div>
            <label className="spatial-label">Target Status</label>
            <div className="pt-1">
              <StatusBadge status={newStatus} />
            </div>
          </div>

          <div>
            <label className="spatial-label">Recruiter Review Note</label>
            <textarea
              rows={3}
              required
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              className="spatial-input"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
            <button type="button" onClick={() => setStatusModalOpen(false)} className="spatial-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={actionLoading} className="spatial-btn-primary">
              {actionLoading ? 'Updating...' : 'Confirm Status Update'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title={`Schedule Interview — ${activeApp?.studentName || ''}`}
      >
        <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="spatial-label">Interview Round *</label>
              <select
                value={interviewData.roundName}
                onChange={(e) => setInterviewData({ ...interviewData, roundName: e.target.value })}
                className="spatial-input"
              >
                <option value="APTITUDE">Aptitude Assessment</option>
                <option value="TECHNICAL_ROUND_1">Technical Round 1 (Coding)</option>
                <option value="TECHNICAL_ROUND_2">Technical Round 2 (System Design)</option>
                <option value="HR_ROUND">HR Culture Assessment</option>
                <option value="FINAL_INTERVIEW">Final Director Interview</option>
              </select>
            </div>

            <div>
              <label className="spatial-label">Scheduled Slot *</label>
              <input
                type="datetime-local"
                required
                value={interviewData.scheduledAt}
                onChange={(e) => setInterviewData({ ...interviewData, scheduledAt: e.target.value })}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Mode *</label>
              <select
                value={interviewData.mode}
                onChange={(e) => setInterviewData({ ...interviewData, mode: e.target.value })}
                className="spatial-input"
              >
                <option value="ONLINE">Online Virtual</option>
                <option value="IN_PERSON">In-Person Campus Venue</option>
              </select>
            </div>

            <div>
              <label className="spatial-label">Meeting URL or Venue *</label>
              <input
                type="text"
                required
                value={interviewData.locationOrLink}
                onChange={(e) => setInterviewData({ ...interviewData, locationOrLink: e.target.value })}
                className="spatial-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="spatial-label">Candidate Instructions</label>
              <textarea
                rows={2}
                value={interviewData.instructions}
                onChange={(e) => setInterviewData({ ...interviewData, instructions: e.target.value })}
                className="spatial-input"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
            <button type="button" onClick={() => setInterviewModalOpen(false)} className="spatial-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={actionLoading} className="spatial-btn-primary">
              {actionLoading ? 'Scheduling...' : 'Dispatch Interview Invite'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        title={`Extend Offer — ${activeApp?.studentName || ''}`}
      >
        <form onSubmit={handleCreateOfferSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="spatial-label">Offered Role Title *</label>
              <input
                type="text"
                required
                value={offerData.jobDesignation}
                onChange={(e) => setOfferData({ ...offerData, jobDesignation: e.target.value })}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Compensation Package *</label>
              <input
                type="text"
                required
                value={offerData.salaryPackage}
                onChange={(e) => setOfferData({ ...offerData, salaryPackage: e.target.value })}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Joining Date *</label>
              <input
                type="date"
                required
                value={offerData.joiningDate}
                onChange={(e) => setOfferData({ ...offerData, joiningDate: e.target.value })}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Offer Expiration Date *</label>
              <input
                type="date"
                required
                value={offerData.offerExpirationDate}
                onChange={(e) => setOfferData({ ...offerData, offerExpirationDate: e.target.value })}
                className="spatial-input"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
            <button type="button" onClick={() => setOfferModalOpen(false)} className="spatial-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={actionLoading} className="spatial-btn-primary">
              {actionLoading ? 'Extending...' : 'Extend Formal Offer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruiterApplicantsPage;
