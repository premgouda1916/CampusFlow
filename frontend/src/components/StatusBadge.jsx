import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const statusConfig = {
    // Application statuses
    APPLIED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Applied' },
    UNDER_REVIEW: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Under Review' },
    SHORTLISTED: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Shortlisted' },
    INTERVIEW_SCHEDULED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Interview Scheduled' },
    SELECTED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Selected' },
    REJECTED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Not Selected' },
    WITHDRAWN: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', label: 'Withdrawn' },

    // Job statuses
    DRAFT: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', label: 'Draft' },
    PUBLISHED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Published' },
    CLOSED: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', label: 'Closed' },
    CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Cancelled' },

    // Interview statuses
    SCHEDULED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Scheduled' },
    COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Completed' },
    RESCHEDULED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Rescheduled' },

    // Offer statuses
    OFFERED: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Offer Extended' },
    ACCEPTED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Offer Accepted' },
    EXPIRED: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', label: 'Expired' },
  };

  const config = statusConfig[status] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    label: status.replace(/_/g, ' '),
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-75"></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
