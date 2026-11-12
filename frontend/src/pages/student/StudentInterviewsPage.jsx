import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  CalendarCheck,
  Building2,
  Clock,
  Video,
  ExternalLink
} from 'lucide-react';

export const StudentInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    interviewService.getMyInterviews({ size: 50 })
      .then((res) => setInterviews(res.data?.content || []))
      .catch(() => toast.error('Could not load interviews'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          Assessments
        </span>
        <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
          Interview <strong className="font-semibold">Schedule</strong>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Technical and HR interview rounds scheduled by corporate recruiters.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="p-16 text-center rounded-3xl spatial-panel space-y-3">
          <CalendarCheck className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Scheduled Interviews</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            When recruiters shortlist your profile and schedule an assessment slot, details will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl spatial-panel spatial-panel-hover p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  {item.roundName?.replace(/_/g, ' ')}
                </span>
                <StatusBadge status={item.status} />
              </div>

              <div>
                <h3 className="font-semibold text-base text-white">{item.jobTitle}</h3>
                <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {item.companyName}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-xs space-y-2 text-zinc-300">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{new Date(item.scheduledAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-teal-400" />
                  <span>Mode: <strong className="text-white">{item.mode}</strong></span>
                </div>
                <div className="pt-1">
                  <span className="text-zinc-400 block text-[11px] mb-0.5">Location / Meeting Link</span>
                  {item.locationOrLink?.startsWith('http') ? (
                    <a
                      href={item.locationOrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium inline-flex items-center gap-1 break-all"
                    >
                      {item.locationOrLink} <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="font-medium text-zinc-100">{item.locationOrLink}</span>
                  )}
                </div>
              </div>

              {item.instructions && (
                <div className="text-xs text-amber-200/90 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/25">
                  <strong className="text-amber-300 block mb-0.5">Instructions</strong>
                  {item.instructions}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentInterviewsPage;
