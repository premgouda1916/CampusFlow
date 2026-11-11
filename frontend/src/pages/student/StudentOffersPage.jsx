import React, { useState, useEffect } from 'react';
import { offerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Award,
  Building,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
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
      setOffers(res.data.content || []);
    } catch (err) {
      toast.error('Failed to load offers');
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
      toast.success(action === 'ACCEPT' ? 'Congratulations! Offer accepted!' : 'Offer declined.');
      fetchOffers();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employment Offers</h1>
        <p className="text-xs text-slate-500">Formal placement letters and compensation packages extended to your profile.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1].map((i) => (
            <div key={i} className="h-44 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Offers Extended Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Once you clear interview assessments, extended corporate offer letters will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition space-y-6 ${
                offer.status === 'ACCEPTED'
                  ? 'bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white border-emerald-200'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Formal Offer
                    </span>
                    <StatusBadge status={offer.status} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {offer.jobDesignation}
                  </h3>
                  <div className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-400" /> {offer.companyName}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                    {offer.salaryPackage}
                  </div>
                  <div className="text-xs font-medium text-slate-400">Annual CTC Package</div>
                </div>
              </div>

              {/* Offer Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block">Expected Joining</span>
                  <strong className="text-slate-900 font-bold mt-1 block">
                    {new Date(offer.joiningDate).toLocaleDateString()}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block">Response Deadline</span>
                  <strong className="text-slate-900 font-bold mt-1 block">
                    {new Date(offer.offerExpirationDate).toLocaleDateString()}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block">Issued On</span>
                  <strong className="text-slate-900 font-bold mt-1 block">
                    {new Date(offer.issuedAt).toLocaleDateString()}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block">Offer Letter</span>
                  {offer.offerLetterUrl ? (
                    <a
                      href={offer.offerLetterUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline font-bold mt-1 inline-flex items-center gap-1"
                    >
                      Download Letter <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-500 font-medium mt-1 block">Standard Contract</span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              {offer.status === 'OFFERED' && !offer.isExpired && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Please respond before {new Date(offer.offerExpirationDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleRespond(offer.id, 'REJECT')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition disabled:opacity-50"
                    >
                      Decline Offer
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleRespond(offer.id, 'ACCEPT')}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Employment Offer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentOffersPage;
