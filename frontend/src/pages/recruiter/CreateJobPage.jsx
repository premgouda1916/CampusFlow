import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jobService, driveService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Save,
  Loader2,
  ShieldCheck
} from 'lucide-react';

const getDefaultFutureDeadline = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return `${d.toISOString().slice(0, 10)}T23:59`;
};

export const CreateJobPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: 'Full-time',
    location: 'Bangalore, India',
    salaryPackage: '18 LPA',
    minCgpa: '7.50',
    maxBacklogs: 0,
    eligibleDepartments: 'CSE,ISE,AIML',
    graduationYear: 2027,
    requiredSkills: 'Java, Spring Boot, MySQL, Docker, React',
    applicationDeadline: getDefaultFutureDeadline(),
    placementDriveId: '',
  });

  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    driveService.getAllDrives()
      .then((res) => {
        const list = res.data || [];
        setDrives(list);
        if (list.length > 0 && !isEdit) {
          setFormData((prev) => ({ ...prev, placementDriveId: list[0].id }));
        }
      })
      .catch(() => {});

    if (isEdit) {
      jobService.getJobById(id)
        .then((res) => {
          const j = res.data;
          setFormData({
            title: j.title || '',
            description: j.description || '',
            jobType: j.jobType || 'Full-time',
            location: j.location || '',
            salaryPackage: j.salaryPackage || '',
            minCgpa: j.minCgpa != null ? j.minCgpa.toString() : '7.50',
            maxBacklogs: j.maxBacklogs || 0,
            eligibleDepartments: j.eligibleDepartments || 'CSE,ISE,AIML',
            graduationYear: j.graduationYear || 2027,
            requiredSkills: j.requiredSkills || '',
            applicationDeadline: j.applicationDeadline ? j.applicationDeadline.substring(0, 16) : getDefaultFutureDeadline(),
            placementDriveId: j.placementDriveId || '',
          });
        })
        .catch(() => {
          toast.error('Failed to load opening details');
          navigate('/recruiter/jobs');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        minCgpa: parseFloat(formData.minCgpa),
        maxBacklogs: parseInt(formData.maxBacklogs, 10),
        graduationYear: parseInt(formData.graduationYear, 10),
        applicationDeadline: formData.applicationDeadline.length === 16
          ? `${formData.applicationDeadline}:00`
          : formData.applicationDeadline,
        placementDriveId: formData.placementDriveId ? parseInt(formData.placementDriveId, 10) : null,
      };

      if (isEdit) {
        await jobService.updateJob(id, payload);
        toast.success('Job posting updated successfully.');
      } else {
        await jobService.createJob(payload);
        toast.success('Draft job posting created. Publish when ready.');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 text-center text-xs text-zinc-400">
        Loading role configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-400 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Company Openings
      </Link>

      <div className="rounded-3xl spatial-panel p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Requisition Builder
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
            {isEdit ? 'Edit' : 'Create'} <strong className="font-semibold">Job Opening</strong>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure role parameters and prerequisites evaluated by the Eligibility Engine.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-white/[0.08] pb-2">
              1. Role Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="spatial-label">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Software Development Engineer (Backend)"
                  className="spatial-input"
                />
              </div>

              <div>
                <label className="spatial-label">Employment Type *</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="spatial-input"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Intern + Full-time">Intern + Full-time PPO</option>
                </select>
              </div>

              <div>
                <label className="spatial-label">Salary Package (CTC) *</label>
                <input
                  type="text"
                  name="salaryPackage"
                  required
                  value={formData.salaryPackage}
                  onChange={handleChange}
                  placeholder="18 LPA"
                  className="spatial-input"
                />
              </div>

              <div>
                <label className="spatial-label">Work Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="spatial-input"
                />
              </div>

              <div>
                <label className="spatial-label">Application Deadline *</label>
                <input
                  type="datetime-local"
                  name="applicationDeadline"
                  required
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="spatial-input"
                />
              </div>

              {drives.length > 0 && (
                <div className="sm:col-span-2">
                  <label className="spatial-label">Associated Placement Drive</label>
                  <select
                    name="placementDriveId"
                    value={formData.placementDriveId}
                    onChange={handleChange}
                    className="spatial-input"
                  >
                    <option value="">None / Open Season</option>
                    {drives.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title} ({d.academicYear})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="spatial-label">Role Description & Expectations *</label>
                <textarea
                  rows={4}
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Outline responsibilities, tech stack, and selection workflow..."
                  className="spatial-input leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-white/[0.08] pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. Eligibility Prerequisites
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="spatial-label">Minimum CGPA (0 - 10) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="minCgpa"
                  required
                  value={formData.minCgpa}
                  onChange={handleChange}
                  className="spatial-input"
                />
              </div>

              <div>
                <label className="spatial-label">Maximum Active Backlogs *</label>
                <input
                  type="number"
                  min="0"
                  name="maxBacklogs"
                  required
                  value={formData.maxBacklogs}
                  onChange={handleChange}
                  className="spatial-input"
                />
              </div>

              <div>
                <label className="spatial-label">Eligible Branches (Comma-separated) *</label>
                <input
                  type="text"
                  name="eligibleDepartments"
                  required
                  value={formData.eligibleDepartments}
                  onChange={handleChange}
                  placeholder="CSE,ISE,AIML,ECE"
                  className="spatial-input"
                />
              </div>

              <div>
                <label className="spatial-label">Graduation Batch Year *</label>
                <input
                  type="number"
                  name="graduationYear"
                  required
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="spatial-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="spatial-label">Required Technical Skills (Comma-separated)</label>
                <input
                  type="text"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  placeholder="Java, Spring Boot, MySQL, Docker"
                  className="spatial-input"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <Link to="/recruiter/jobs" className="spatial-btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="spatial-btn-primary">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isEdit ? 'Save Changes' : 'Create Job Opening'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobPage;
