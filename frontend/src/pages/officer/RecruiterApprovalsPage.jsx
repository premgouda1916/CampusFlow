import React, { useState, useEffect } from 'react';
import { recruiterService, companyService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  UserCheck
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
      setPendingRecruiters(recRes.data?.content || []);
      setCompanies(compRes.data?.content || []);
    } catch {
      toast.error('Failed to load verification queue');
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
      toast.success(approved ? 'Recruiter approved successfully.' : 'Recruiter access revoked.');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleVerifyCompany = async (id, verified) => {
    try {
      await companyService.verifyCompany(id, verified);
      toast.success(verified ? 'Company verified.' : 'Company verification revoked.');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          Governance & Compliance
        </span>
        <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
          Corporate <strong className="font-semibold">Verification & Approvals</strong>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Verify corporate partner credentials before permitting campus job publication.
        </p>
      </div>

      <div className="rounded-3xl spatial-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div>
            <h3 className="font-semibold text-base text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Pending Recruiter Profiles
            </h3>
            <p className="text-xs text-zinc-400">Recruiters awaiting placement cell authorization.</p>
          </div>
          <span className="text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-400/25 px-3 py-1 rounded-full">
            {pendingRecruiters.length} Pending
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Loading verification queue...</div>
        ) : pendingRecruiters.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            All recruiter accounts have been reviewed.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {pendingRecruiters.map((r) => (
              <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-white">{r.fullName}</div>
                  <div className="text-xs text-zinc-400">
                    {r.email} • Designation: <strong className="text-zinc-200">{r.designation}</strong>
                  </div>
                  <div className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Enterprise: {r.companyName}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApproveRecruiter(r.id, false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveRecruiter(r.id, true)}
                    className="spatial-btn-primary"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Recruiter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl spatial-panel p-6 space-y-4">
        <div className="border-b border-white/[0.08] pb-3.5">
          <h3 className="font-semibold text-base text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" /> Registered Enterprises
          </h3>
          <p className="text-xs text-zinc-400">Only verified companies are allowed to publish campus jobs.</p>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {companies.map((c) => (
            <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-semibold text-sm text-white">{c.name}</span>
                  {c.verified ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                      Verified Partner
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                      Unverified
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-400">
                  {c.industry} • {c.location}
                </div>
                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    {c.website} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyCompany(c.id, !c.verified)}
                className={c.verified ? 'spatial-btn-secondary' : 'spatial-btn-primary'}
              >
                {c.verified ? 'Revoke Verification' : 'Verify Enterprise'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruiterApprovalsPage;
