import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  CalendarCheck,
  Building,
  MapPin,
  Clock,
  Video,
  FileText,
  ExternalLink
} from 'lucide-react';

export const StudentInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    interviewService.getMyInterviews({ size: 50 })
      .then((res) => setInterviews(res.data.content || []))
      .catch(() => toast.error('Could not load interviews'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interview Schedule</h1>
        <p className="text-xs text-slate-500">Live technical and HR interview rounds scheduled by corporate recruiters.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Scheduled Interviews</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When recruiters shortlist your application and allocate a time slot, interview invitations will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                  {item.roundName?.replace(/_/g, ' ')}
                </span>
                <StatusBadge status={item.status} />
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{item.jobTitle}</h3>
                <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> {item.companyName}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>{new Date(item.scheduledAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-500" />
                  <span>Mode: <strong className="text-slate-800">{item.mode}</strong></span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-400 block text-[11px]">Location / Meeting Link:</span>
                  {item.locationOrLink?.startsWith('http') ? (
                    <a
                      href={item.locationOrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1 truncate max-w-full"
                    >
                      {item.locationOrLink} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-medium text-slate-800">{item.locationOrLink}</span>
                  )}
                </div>
              </div>

              {item.instructions && (
                <div className="text-xs text-slate-500 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <strong className="text-amber-800 block mb-0.5">Instructions:</strong>
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
