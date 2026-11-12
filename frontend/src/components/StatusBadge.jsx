import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const statusConfig = {
    // Application statuses
    APPLIED: { style: 'bg-zinc-100/10 text-zinc-200 border-zinc-400/25', label: 'Applied' },
    UNDER_REVIEW: { style: 'bg-amber-500/15 text-amber-300 border-amber-400/25', label: 'Under Review' },
    SHORTLISTED: { style: 'bg-teal-500/15 text-teal-300 border-teal-400/25', label: 'Shortlisted' },
    INTERVIEW_SCHEDULED: { style: 'bg-amber-500/15 text-amber-300 border-amber-400/25', label: 'Interview Scheduled' },
    SELECTED: { style: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25', label: 'Selected' },
    REJECTED: { style: 'bg-rose-500/15 text-rose-300 border-rose-400/25', label: 'Not Selected' },
    WITHDRAWN: { style: 'bg-white/[0.06] text-zinc-400 border-white/15', label: 'Withdrawn' },

    // Job statuses
    DRAFT: { style: 'bg-white/[0.06] text-zinc-300 border-white/15', label: 'Draft' },
    PUBLISHED: { style: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25', label: 'Published' },
    CLOSED: { style: 'bg-white/[0.06] text-zinc-400 border-white/15', label: 'Closed' },
    CANCELLED: { style: 'bg-rose-500/15 text-rose-300 border-rose-400/25', label: 'Cancelled' },

    // Interview statuses
    SCHEDULED: { style: 'bg-teal-500/15 text-teal-300 border-teal-400/25', label: 'Scheduled' },
    COMPLETED: { style: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25', label: 'Completed' },
    RESCHEDULED: { style: 'bg-amber-500/15 text-amber-300 border-amber-400/25', label: 'Rescheduled' },

    // Offer statuses
    OFFERED: { style: 'bg-teal-500/15 text-teal-300 border-teal-400/25', label: 'Offer Extended' },
    ACCEPTED: { style: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25', label: 'Offer Accepted' },
    EXPIRED: { style: 'bg-white/[0.06] text-zinc-400 border-white/15', label: 'Expired' },

    // Drive statuses
    UPCOMING: { style: 'bg-amber-500/15 text-amber-300 border-amber-400/25', label: 'Upcoming' },
    ONGOING: { style: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25', label: 'Ongoing' },
  };

  const config = statusConfig[status] || {
    style: 'bg-white/[0.06] text-zinc-300 border-white/15',
    label: status.replace(/_/g, ' '),
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border backdrop-blur-md ${config.style}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
