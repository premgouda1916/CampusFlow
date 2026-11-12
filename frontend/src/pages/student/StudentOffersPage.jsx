import React, { useState, useEffect } from 'react';
import { offerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Award,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const StudentOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await offerService.getMyOffers({ size: 50 });
      setOffers(res.data?.content || []);
    } catch {
      toast.error('Failed to load employment offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleRespond = async (offerId, action) => {
    const verb = action === 'ACCEPT' ? 'accept' : 'decline';
    if (!window.confirm(`Are you sure you want to ${verb} this employment offer?`)) return;

    setActionLoading(true);
    try {
      await offerService.respondToOffer(offerId, action);
      toast.success(action === 'ACCEPT' ? 'Offer accepted. Congratulations!' : 'Offer declined.');
      fetchOffers();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          Placement Outcomes
        </span>
        <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
          Employment <strong className="font-semibold">Offers</strong>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Formal offer letters and compensation packages extended to your profile.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <Award className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Offers Extended Yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Once you clear interview assessments, formal offer letters issued by recruiters will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {offers.map((offer) => {
            const isExpired = Boolean(offer.expired || offer.isExpired);
            return (
              <div
                key={offer.id}
                className={`p-6 sm:p-8 rounded-3xl spatial-panel space-y-6 ${
                  offer.status === 'ACCEPTED' ? 'border-emerald-500/35 bg-emerald-500/[0.05]' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/[0.08] text-zinc-200 border border-white/15">
                        <Sparkles className="w-3 h-3 text-emerald-400" /> Formal Offer
                      </span>
                      <StatusBadge status={offer.status} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">
                      {offer.jobDesignation}
                    </h3>
                    <div className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-400" /> {offer.companyName}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
                      {offer.salaryPackage}
                    </div>
                    <div className="text-xs text-zinc-400">Annual CTC Package</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-zinc-400 block">Expected Joining</span>
                    <strong className="text-white font-semibold mt-1 block">
                      {new Date(offer.joiningDate).toLocaleDateString()}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-zinc-400 block">Response Deadline</span>
                    <strong className="text-white font-semibold mt-1 block">
                      {new Date(offer.offerExpirationDate).toLocaleDateString()}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-zinc-400 block">Issued On</span>
                    <strong className="text-white font-semibold mt-1 block">
                      {new Date(offer.issuedAt).toLocaleDateString()}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-zinc-400 block">Offer Letter</span>
                    {offer.offerLetterUrl ? (
                      <a
                        href={offer.offerLetterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold mt-1 inline-flex items-center gap-1"
                      >
                        Download Letter <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-zinc-400 font-medium mt-1 block">Standard Contract</span>
                    )}
                  </div>
                </div>

                {offer.status === 'OFFERED' && !isExpired && (
                  <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Please respond before {new Date(offer.offerExpirationDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleRespond(offer.id, 'REJECT')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition disabled:opacity-50"
                      >
                        Decline Offer
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleRespond(offer.id, 'ACCEPT')}
                        className="spatial-btn-primary"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept Employment Offer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentOffersPage;
