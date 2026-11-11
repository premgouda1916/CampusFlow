import React, { useState, useEffect } from 'react';
import { driveService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import {
  Layers,
  PlusCircle,
  Calendar,
  Clock,
  Edit,
  Save,
  Loader2
} from 'lucide-react';

export const PlacementDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    academicYear: '2026-2027',
    startDate: '2026-08-01',
    endDate: '2027-04-30',
    status: 'ONGOING',
    description: '',
  });

  const toast = useToast();

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await driveService.getAllDrives();
      setDrives(res.data || []);
    } catch (err) {
      toast.error('Failed to load placement drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleOpenCreate = () => {
    setEditingDrive(null);
    setFormData({
      title: 'Spring Placement Season 2027',
      academicYear: '2026-2027',
      startDate: '2027-01-10',
      endDate: '2027-05-15',
      status: 'UPCOMING',
      description: 'Second phase campus recruitment drive for final year graduates.',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (drive) => {
    setEditingDrive(drive);
    setFormData({
      title: drive.title,
      academicYear: drive.academicYear,
      startDate: drive.startDate,
      endDate: drive.endDate,
      status: drive.status,
      description: drive.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (editingDrive) {
        await driveService.updateDrive(editingDrive.id, formData);
        toast.success('Placement drive updated.');
      } else {
        await driveService.createDrive(formData);
        toast.success('New placement drive launched.');
      }
      setModalOpen(false);
      fetchDrives();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement Drives & Seasons</h1>
          <p className="text-xs text-slate-500">Configure academic recruitment sessions and date windows.</p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Launch New Drive
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : drives.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Placement Drives Configured</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create an annual or seasonal drive to group corporate job openings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drives.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Academic Year: {d.academicYear}
                  </span>
                  <StatusBadge status={d.status} />
                </div>

                <h3 className="font-bold text-base text-slate-900">{d.title}</h3>
                {d.description && <p className="text-xs text-slate-500 leading-relaxed">{d.description}</p>}

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Start Date:</span>
                    <strong>{new Date(d.startDate).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">End Date:</span>
                    <strong>{new Date(d.endDate).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(d)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Parameters
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drive Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDrive ? 'Edit Placement Drive' : 'Launch New Placement Drive'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Drive Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Academic Year (e.g. 2026-2027) *</label>
              <input
                type="text"
                required
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Commencement Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Closure Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description / Notes</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              {actionLoading ? 'Saving...' : 'Save Placement Drive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlacementDrivesPage;

