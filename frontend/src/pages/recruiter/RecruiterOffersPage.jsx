import React, { useState, useEffect } from 'react';
import { offerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Award,
  Calendar,
  Building,
  User,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const RecruiterOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    offerService.getCompanyOffers({ size: 50 })
      .then((res) => setOffers(res.data.content || []))
      .catch(() => toast.error('Failed to load extended offers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Issued Employment Offers</h1>
        <p className="text-xs text-slate-500">Formal employment offers extended by your company to campus candidates.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Offers Issued Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Extend formal employment offers to shortlisted candidates from the Candidate Review screen.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="p-6 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{offer.studentName}</h3>
                  <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-100">
                    {offer.studentUsn}
                  </span>
                  <StatusBadge status={offer.status} />
                </div>

                <div className="text-xs font-semibold text-slate-700">
                  Offered Role: <strong className="text-slate-900">{offer.jobDesignation}</strong> &bull;{' '}
                  Package: <strong className="text-emerald-700 font-bold">{offer.salaryPackage}</strong>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                  <span>Joining: {new Date(offer.joiningDate).toLocaleDateString()}</span>
                  <span>Expires: {new Date(offer.offerExpirationDate).toLocaleDateString()}</span>
                  <span>Issued: {new Date(offer.issuedAt).toLocaleDateString()}</span>
                  {offer.respondedAt && (
                    <span className="font-semibold text-slate-600">
                      Responded: {new Date(offer.respondedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {offer.offerLetterUrl && (
                  <a
                    href={offer.offerLetterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
                  >
                    Offer Document <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterOffersPage;
