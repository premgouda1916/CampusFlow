import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import {
  FileCheck2,
  Building,
  Calendar,
  Clock,
  History,
  AlertTriangle,
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
      setApplications(res.data.content || []);
    } catch (err) {
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
    } catch (err) {
      toast.error('Could not load history');
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This cannot be undone.')) return;
    try {
      await applicationService.withdrawApplication(appId);
      toast.success('Application withdrawn');
      fetchApplications();
    } catch (err) {
      toast.error(err.message || 'Could not withdraw application');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Job Applications</h1>
        <p className="text-xs text-slate-500">Track real-time candidate progression and recruiter review updates.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Applications Submitted</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explore verified campus openings and apply to positions matching your profile.
          </p>
          <Link
            to="/student/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
          >
            Explore Openings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          {applications.map((app) => (
            <div key={app.id} className="p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-lg">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{app.jobTitle}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <div className="text-xs font-semibold text-slate-600 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-900">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> {app.companyName}
                  </span>
                  <span>💰 {app.salaryPackage}</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400" /> {app.location}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Submitted on {new Date(app.appliedAt).toLocaleDateString()}
                  {app.reviewedAt && ` • Reviewed on ${new Date(app.reviewedAt).toLocaleDateString()}`}
                </div>
                {app.notes && (
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    Note: {app.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start md:self-center">
                <button
                  type="button"
                  onClick={() => handleViewHistory(app)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  <History className="w-3.5 h-3.5" /> Timeline
                </button>
                {(app.status === 'APPLIED' || app.status === 'UNDER_REVIEW') && (
                  <button
                    type="button"
                    onClick={() => handleWithdraw(app.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Audit Timeline: ${activeApp?.jobTitle}`}
      >
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Chronological audit log of state changes recorded on your application record.
          </div>

          <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6">
            {selectedHistory.map((h) => (
              <div key={h.id} className="relative">
                <div className="w-3 h-3 rounded-full bg-indigo-600 absolute -left-[31px] top-1 ring-4 ring-white" />
                <div className="font-semibold text-xs text-slate-800 flex items-center gap-2">
                  <span>{h.toStatus?.replace(/_/g, ' ')}</span>
                  {h.fromStatus && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      (from {h.fromStatus.replace(/_/g, ' ')})
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Updated by: <strong className="text-slate-700">{h.changedByUserName}</strong> on{' '}
                  {new Date(h.changedAt).toLocaleString()}
                </div>
                {h.comment && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 border border-slate-100">
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
