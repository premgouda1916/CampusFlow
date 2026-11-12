import React, { useState, useEffect } from 'react';
import { driveService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import {
  Layers,
  PlusCircle,
  Edit
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
    } catch {
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
      description: 'Second phase campus recruitment drive for graduating batch.',
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
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Academic Calendar
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
            Placement <strong className="font-semibold">Drives & Seasons</strong>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure institutional recruitment seasons and active date windows.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="spatial-btn-primary self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Drive</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : drives.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <Layers className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Placement Drives Configured</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Create an annual or seasonal drive to organize corporate job openings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {drives.map((d) => (
            <div
              key={d.id}
              className="rounded-3xl spatial-panel spatial-panel-hover p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/[0.08] text-zinc-200 border border-white/15">
                    {d.academicYear}
                  </span>
                  <StatusBadge status={d.status} />
                </div>

                <h3 className="font-semibold text-base text-white">{d.title}</h3>
                {d.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed">{d.description}</p>
                )}

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-xs flex items-center justify-between text-zinc-300">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Start Date</span>
                    <strong className="text-white">{new Date(d.startDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500 block text-[10px] uppercase">End Date</span>
                    <strong className="text-white">{new Date(d.endDate).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(d)}
                  className="spatial-btn-secondary"
                >
                  <Edit className="w-3.5 h-3.5 text-emerald-400" /> Edit Parameters
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDrive ? 'Edit Placement Drive' : 'Launch New Placement Drive'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="spatial-label">Drive Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="spatial-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="spatial-label">Academic Year (e.g. 2026-2027) *</label>
              <input
                type="text"
                required
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="spatial-input"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="spatial-label">Commencement Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Closure Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="spatial-input"
              />
            </div>
          </div>

          <div>
            <label className="spatial-label">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="spatial-input"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="spatial-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={actionLoading} className="spatial-btn-primary">
              {actionLoading ? 'Saving...' : 'Save Placement Drive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlacementDrivesPage;
