import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import {
  FileCheck2,
  Building2,
  Clock,
  History,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [activeApp, setActiveApp] = useState(null);

  const toast = useToast();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getMyApplications({ size: 50 });
      setApplications(res.data?.content || []);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleViewHistory = async (app) => {
    setActiveApp(app);
    try {
      const res = await applicationService.getApplicationHistory(app.id);
      setSelectedHistory(res.data || []);
      setHistoryModalOpen(true);
    } catch {
      toast.error('Could not load application timeline');
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) return;
    try {
      await applicationService.withdrawApplication(appId);
      toast.success('Application withdrawn');
      fetchApplications();
    } catch (err) {
      toast.error(err.message || 'Could not withdraw application');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          Application Tracker
        </span>
        <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
          My <strong className="font-semibold">Job Applications</strong>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Track real-time candidate progression and recruiter status updates.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <FileCheck2 className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Applications Submitted</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Explore verified campus openings and apply to positions matching your profile.
          </p>
          <div className="pt-2">
            <Link to="/student/jobs" className="spatial-btn-primary">
              <span>Explore Openings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl spatial-panel divide-y divide-white/[0.07] overflow-hidden">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-5 sm:p-6 hover:bg-white/[0.03] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-semibold text-base text-white">{app.jobTitle}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <div className="text-xs text-zinc-300 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {app.companyName}
                  </span>
                  <span className="text-emerald-300 font-semibold">{app.salaryPackage}</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3 h-3" /> {app.location}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Submitted {new Date(app.appliedAt).toLocaleDateString()}
                  {app.reviewedAt && ` • Reviewed ${new Date(app.reviewedAt).toLocaleDateString()}`}
                </div>
                {app.notes && (
                  <div className="text-xs text-zinc-300 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/[0.06]">
                    Note: {app.notes}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleViewHistory(app)}
                  className="spatial-btn-secondary"
                >
                  <History className="w-3.5 h-3.5" /> Timeline
                </button>
                {(app.status === 'APPLIED' || app.status === 'UNDER_REVIEW') && (
                  <button
                    type="button"
                    onClick={() => handleWithdraw(app.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Status Timeline — ${activeApp?.jobTitle || ''}`}
      >
        <div className="space-y-4">
          <div className="text-xs text-zinc-400">
            Chronological log of status transitions recorded on your application.
          </div>

          <div className="relative pl-6 border-l border-emerald-500/35 space-y-6 my-2">
            {selectedHistory.map((h) => (
              <div key={h.id} className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[29px] top-1 ring-4 ring-[#18181b]" />
                <div className="font-semibold text-xs text-white flex items-center gap-2">
                  <span>{h.toStatus?.replace(/_/g, ' ')}</span>
                  {h.fromStatus && (
                    <span className="text-[11px] text-zinc-500 font-normal">
                      (from {h.fromStatus.replace(/_/g, ' ')})
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Updated by <strong className="text-zinc-200">{h.changedByUserName}</strong> on{' '}
                  {new Date(h.changedAt).toLocaleString()}
                </div>
                {h.comment && (
                  <div className="text-xs text-zinc-300 bg-white/[0.04] p-2.5 rounded-xl mt-1.5 border border-white/[0.08]">
                    "{h.comment}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyApplicationsPage;
