import React, { useState, useEffect } from 'react';
import { offerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Award,
  ExternalLink
} from 'lucide-react';

export const RecruiterOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    offerService.getCompanyOffers({ size: 50 })
      .then((res) => setOffers(res.data?.content || []))
      .catch(() => toast.error('Failed to load extended offers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          Compensation & Hiring
        </span>
        <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
          Issued <strong className="font-semibold">Employment Offers</strong>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Formal employment offers extended by your organization to campus candidates.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <Award className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Offers Issued Yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Extend formal employment offers to shortlisted candidates from the Candidate Review view.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl spatial-panel divide-y divide-white/[0.07] overflow-hidden">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="p-5 sm:p-6 hover:bg-white/[0.03] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-semibold text-base text-white">{offer.studentName}</h3>
                  <span className="text-[11px] text-zinc-300 font-medium px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10">
                    {offer.studentUsn}
                  </span>
                  <StatusBadge status={offer.status} />
                </div>

                <div className="text-xs text-zinc-300">
                  Offered Role: <strong className="text-white">{offer.jobDesignation}</strong> •{' '}
                  Package: <strong className="text-emerald-400 font-semibold">{offer.salaryPackage}</strong>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400">
                  <span>Joining: {new Date(offer.joiningDate).toLocaleDateString()}</span>
                  <span>Expires: {new Date(offer.offerExpirationDate).toLocaleDateString()}</span>
                  <span>Issued: {new Date(offer.issuedAt).toLocaleDateString()}</span>
                  {offer.respondedAt && (
                    <span className="font-medium text-zinc-200">
                      Responded: {new Date(offer.respondedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {offer.offerLetterUrl && (
                <a
                  href={offer.offerLetterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="spatial-btn-secondary self-start md:self-center"
                >
                  <span>Offer Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterOffersPage;
