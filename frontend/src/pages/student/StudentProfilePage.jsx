import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Save
} from 'lucide-react';

export const StudentProfilePage = () => {
  const { user, updateUserState } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    collegeName: '',
    graduationYear: 2027,
    currentCgpa: '',
    backlogCount: 0,
    skills: '',
  });

  const toast = useToast();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await studentService.getMyProfile();
      const p = res.data;
      setProfile(p);
      setFormData({
        fullName: p.fullName || '',
        phone: p.phone || '',
        collegeName: p.collegeName || '',
        graduationYear: p.graduationYear || 2027,
        currentCgpa: p.currentCgpa != null ? p.currentCgpa.toString() : '',
        backlogCount: p.backlogCount || 0,
        skills: p.skills || '',
      });
    } catch (err) {
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        graduationYear: parseInt(formData.graduationYear),
        currentCgpa: parseFloat(formData.currentCgpa),
        backlogCount: parseInt(formData.backlogCount),
      };
      const res = await studentService.updateMyProfile(payload);
      setProfile(res.data);
      updateUserState({ fullName: res.data.fullName });
      toast.success('Academic profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume file must be under 5MB');
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await studentService.uploadResume(data);
      toast.success('Resume uploaded successfully!');
      setProfile((prev) => ({ ...prev, resumeUrl: res.data }));
    } catch (err) {
      toast.error(err.message || 'Resume upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading student profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Profile & Resume</h1>
        <p className="text-xs text-slate-500">
          This data powers the Dynamic Eligibility Engine during campus recruitment screenings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Readonly Identifiers & Resume Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-2xl mx-auto">
              {profile?.fullName?.charAt(0)}
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">{profile?.fullName}</h3>
              <div className="text-xs text-slate-400">{profile?.email}</div>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                USN: {profile?.usn}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <strong className="text-slate-800">{profile?.departmentCode}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Placement State:</span>
                {profile?.placed ? (
                  <span className="text-emerald-700 font-bold">Placed</span>
                ) : (
                  <span className="text-slate-500">Available</span>
                )}
              </div>
            </div>
          </div>

          {/* Resume Upload Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Resume Document
            </h4>

            {profile?.resumeUrl ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resume on file
                  </div>
                  <div className="text-[10px] text-slate-400">PDF / DOC format</div>
                </div>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                  title="View document"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                No resume uploaded yet. Recruiters cannot review your candidate portfolio!
              </div>
            )}

            <label className="block w-full cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploading}
                className="hidden"
              />
              <div className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-2 transition">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Upload New Resume (Max 5MB)
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Right 2 Cols: Edit Academic Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" /> Edit Profile & Credentials
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Current Cumulative CGPA (0 - 10) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="currentCgpa"
                    required
                    value={formData.currentCgpa}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Active Backlog Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="backlogCount"
                    required
                    value={formData.backlogCount}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Graduation Batch Year *
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    required
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    required
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Technical Skills (Comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Java, Python, Spring Boot, MySQL, React, Docker, Git"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Academic Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;

