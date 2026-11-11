import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jobService, driveService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Briefcase,
  ArrowLeft,
  Save,
  Loader2,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';

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
    applicationDeadline: '2026-12-31T23:59',
    placementDriveId: '',
  });

  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    driveService.getAllDrives()
      .then((res) => {
        setDrives(res.data || []);
        if (res.data?.length > 0 && !formData.placementDriveId) {
          setFormData((prev) => ({ ...prev, placementDriveId: res.data[0].id }));
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
            applicationDeadline: j.applicationDeadline ? j.applicationDeadline.substring(0, 16) : '',
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
        maxBacklogs: parseInt(formData.maxBacklogs),
        graduationYear: parseInt(formData.graduationYear),
        applicationDeadline: formData.applicationDeadline.length === 16
          ? formData.applicationDeadline + ':00'
          : formData.applicationDeadline,
        placementDriveId: formData.placementDriveId ? parseInt(formData.placementDriveId) : null,
      };

      if (isEdit) {
        await jobService.updateJob(id, payload);
        toast.success('Job posting updated successfully!');
      } else {
        await jobService.createJob(payload);
        toast.success('Draft job posting created! Review and publish when ready.');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading opening...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Company Openings
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isEdit ? 'Edit Job Opening' : 'Create Campus Job Opening'}
          </h1>
          <p className="text-xs text-slate-500">
            Define role parameters and criteria for the automated Dynamic Eligibility Engine.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Role Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Job Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Software Development Engineer (Backend)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Employment Type *
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Intern + Full-time">Intern + Full-time PPO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Salary Package (CTC) *
                </label>
                <input
                  type="text"
                  name="salaryPackage"
                  required
                  value={formData.salaryPackage}
                  onChange={handleChange}
                  placeholder="e.g. 18 LPA, 24 LPA"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Work Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Bangalore, Hyderabad, Remote"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Application Deadline *
                </label>
                <input
                  type="datetime-local"
                  name="applicationDeadline"
                  required
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              {drives.length > 0 && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Associated Placement Drive
                  </label>
                  <select
                    name="placementDriveId"
                    value={formData.placementDriveId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
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
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Role Description & Expectations *
                </label>
                <textarea
                  rows={4}
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Outline responsibilities, team structure, tech stack, and selection procedure..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed font-medium"
                />
              </div>
            </div>
          </div>

          {/* Eligibility Rules */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> 2. Institutional Eligibility Criteria
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Minimum Qualifying CGPA (0 - 10) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="minCgpa"
                  required
                  value={formData.minCgpa}
                  onChange={handleChange}
                  placeholder="7.50"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Maximum Allowable Active Backlogs *
                </label>
                <input
                  type="number"
                  min="0"
                  name="maxBacklogs"
                  required
                  value={formData.maxBacklogs}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Eligible Academic Departments (Comma-separated) *
                </label>
                <input
                  type="text"
                  name="eligibleDepartments"
                  required
                  value={formData.eligibleDepartments}
                  onChange={handleChange}
                  placeholder="CSE,ISE,AIML,ECE"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Graduation Batch Year *
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  required
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="2027"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Required Technical Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  placeholder="Java, Spring Boot, MySQL, Docker, Kubernetes"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/recruiter/jobs"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-600/30 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? 'Save Changes' : 'Create Job Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobPage;

