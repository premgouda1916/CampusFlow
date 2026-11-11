import React, { useState, useEffect } from 'react';
import { recruiterService, companyService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  ExternalLink,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export const RecruiterApprovalsPage = () => {
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, compRes] = await Promise.all([
        recruiterService.getPendingRecruiters({ size: 50 }),
        companyService.getCompanies({ size: 50 }),
      ]);
      setPendingRecruiters(recRes.data.content || []);
      setCompanies(compRes.data.content || []);
    } catch (err) {
      toast.error('Failed to load pending accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveRecruiter = async (id, approved) => {
    try {
      await recruiterService.approveRecruiter(id, approved);
      toast.success(approved ? 'Recruiter approved successfully!' : 'Recruiter access revoked.');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleVerifyCompany = async (id, verified) => {
    try {
      await companyService.verifyCompany(id, verified);
      toast.success(verified ? 'Company verified!' : 'Company verification updated.');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Corporate Verification & Approvals</h1>
        <p className="text-xs text-slate-500">
          Review corporate enterprise credentials before permitting campus recruitment activities.
        </p>
      </div>

      {/* Pending Recruiters Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" /> Pending Recruiter Profiles
            </h3>
            <p className="text-xs text-slate-400">Recruiters requiring access authorization.</p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
            {pendingRecruiters.length} Pending
          </span>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-400">Loading pending requests...</div>
        ) : pendingRecruiters.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No pending recruiter approval requests.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingRecruiters.map((r) => (
              <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-slate-900">{r.fullName}</div>
                  <div className="text-xs text-slate-500">
                    {r.email} &bull; Designation: <strong className="text-slate-800">{r.designation}</strong>
                  </div>
                  <div className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> Enterprise: {r.companyName}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApproveRecruiter(r.id, false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveRecruiter(r.id, true)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Recruiter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registered Companies Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-600" /> Registered Enterprises
          </h3>
          <p className="text-xs text-slate-400">Verified companies authorized to publish job openings.</p>
        </div>

        <div className="divide-y divide-slate-100">
          {companies.map((c) => (
            <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{c.name}</span>
                  {c.verified ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Partner
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Unverified
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {c.industry} &bull; {c.location}
                </div>
                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    {c.website} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleVerifyCompany(c.id, !c.verified)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition border ${
                    c.verified
                      ? 'text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200'
                      : 'text-white bg-teal-600 hover:bg-teal-500 border-teal-600 shadow-sm'
                  }`}
                >
                  {c.verified ? 'Revoke Verification' : 'Verify Enterprise'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruiterApprovalsPage;

