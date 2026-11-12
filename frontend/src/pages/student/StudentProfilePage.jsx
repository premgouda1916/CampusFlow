import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  FileText,
  Upload,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Save
} from 'lucide-react';

export const StudentProfilePage = () => {
  const { updateUserState } = useAuth();
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
    } catch {
      toast.error('Could not load student profile');
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
        graduationYear: parseInt(formData.graduationYear, 10),
        currentCgpa: parseFloat(formData.currentCgpa),
        backlogCount: parseInt(formData.backlogCount, 10),
      };
      const res = await studentService.updateMyProfile(payload);
      setProfile(res.data);
      updateUserState({ fullName: res.data.fullName });
      toast.success('Academic profile updated successfully.');
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
      toast.success('Resume uploaded successfully.');
      setProfile((prev) => ({ ...prev, resumeUrl: res.data }));
    } catch (err) {
      toast.error(err.message || 'Resume upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-zinc-400">
        Loading academic profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          Candidate Portfolio
        </span>
        <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
          Academic <strong className="font-semibold">Profile & Resume</strong>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          This data powers the Dynamic Eligibility Engine during campus recruitment screenings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="rounded-3xl spatial-panel p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-2xl mx-auto">
              {profile?.fullName?.charAt(0)}
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-semibold text-base text-white">{profile?.fullName}</h3>
              <div className="text-xs text-zinc-400">{profile?.email}</div>
              <div className="inline-block mt-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.08] text-zinc-200 border border-white/15">
                USN: {profile?.usn}
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-3.5 text-xs space-y-2 text-zinc-400">
              <div className="flex justify-between">
                <span>Department</span>
                <strong className="text-zinc-100">{profile?.departmentCode}</strong>
              </div>
              <div className="flex justify-between">
                <span>Placement State</span>
                {profile?.placed ? (
                  <span className="text-emerald-400 font-semibold">Placed</span>
                ) : (
                  <span className="text-zinc-200 font-medium">Available</span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl spatial-panel p-6 space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Resume Document
            </h4>

            {profile?.resumeUrl ? (
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Resume on file
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">PDF / DOC format</div>
                </div>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl text-emerald-400 hover:bg-white/[0.08] transition"
                  title="Open Resume"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="text-xs text-amber-300 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/25">
                No resume uploaded yet. Upload your PDF resume so recruiters can review your profile.
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
              <div className="w-full py-2.5 px-4 rounded-xl border border-dashed border-emerald-400/40 hover:border-emerald-400/70 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition">
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

        <div className="lg:col-span-2">
          <div className="rounded-3xl spatial-panel p-6 sm:p-8 space-y-6">
            <h3 className="font-semibold text-sm text-white border-b border-white/[0.08] pb-3.5 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" /> Edit Profile & Credentials
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="spatial-label">Display Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="spatial-input"
                  />
                </div>

                <div>
                  <label className="spatial-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="spatial-input"
                  />
                </div>

                <div>
                  <label className="spatial-label">Cumulative CGPA (0 - 10) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="currentCgpa"
                    required
                    value={formData.currentCgpa}
                    onChange={handleChange}
                    className="spatial-input"
                  />
                </div>

                <div>
                  <label className="spatial-label">Active Backlog Count *</label>
                  <input
                    type="number"
                    min="0"
                    name="backlogCount"
                    required
                    value={formData.backlogCount}
                    onChange={handleChange}
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

                <div>
                  <label className="spatial-label">Institution / University</label>
                  <input
                    type="text"
                    name="collegeName"
                    required
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="spatial-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="spatial-label">Technical Skills (Comma-separated)</label>
                  <textarea
                    rows={3}
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Java, Spring Boot, MySQL, React, Docker, Git"
                    className="spatial-input leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                <button type="submit" disabled={saving} className="spatial-btn-primary">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Academic Changes</span>
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
