import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  FileSpreadsheet,
  Download
} from 'lucide-react';

export const PlacementReportsPage = () => {
  const [offers, setOffers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    Promise.all([
      analyticsService.getPlacementOffers(),
      analyticsService.getPlacementOfficerDashboard(),
    ])
      .then(([offersRes, dashRes]) => {
        setOffers(offersRes.data || []);
        setSummary(dashRes.data || null);
      })
      .catch(() => toast.error('Failed to load placement report dataset'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadCsv = () => {
    const token = localStorage.getItem('campusflow_token');
    fetch('/api/v1/analytics/placement/export-csv', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Export failed');
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'campusflow_placement_report.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        toast.success('Placement report CSV downloaded.');
      })
      .catch(() => toast.error('Failed to export CSV report'));
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Institutional Reporting
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
            Placement <strong className="font-semibold">Reports & CSV Export</strong>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified campus placement records, CTC compensation outcomes, and official CSV downloads.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="spatial-btn-primary self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Dataset</span>
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl spatial-panel">
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">Placement Rate</div>
            <div className="text-xl font-semibold text-emerald-400 mt-1 tabular-nums">
              {summary.placementPercentage}%
            </div>
          </div>
          <div className="p-4 rounded-2xl spatial-panel">
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">Average Package</div>
            <div className="text-xl font-semibold text-white mt-1 tabular-nums">
              {summary.averageSalaryPackageLpa} LPA
            </div>
          </div>
          <div className="p-4 rounded-2xl spatial-panel">
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">Highest Package</div>
            <div className="text-xl font-semibold text-emerald-300 mt-1 tabular-nums">
              {summary.highestSalaryPackageLpa} LPA
            </div>
          </div>
          <div className="p-4 rounded-2xl spatial-panel">
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">Offers Recorded</div>
            <div className="text-xl font-semibold text-white mt-1 tabular-nums">
              {offers.length}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl spatial-panel overflow-hidden">
        <div className="p-6 border-b border-white/[0.08]">
          <h3 className="font-semibold text-base text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Verified Placement Offers Ledger
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Live database preview of all records included in the CSV export.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-white/[0.08]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Student</th>
                <th className="px-6 py-3.5 font-semibold">USN</th>
                <th className="px-6 py-3.5 font-semibold">Company</th>
                <th className="px-6 py-3.5 font-semibold">Role</th>
                <th className="px-6 py-3.5 font-semibold">Package</th>
                <th className="px-6 py-3.5 font-semibold">Joining Date</th>
                <th className="px-6 py-3.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-zinc-400">
                    Loading placement dataset...
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-zinc-500">
                    No employment offers recorded yet.
                  </td>
                </tr>
              ) : (
                offers.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.03] transition">
                    <td className="px-6 py-4 font-semibold text-white">{o.studentName}</td>
                    <td className="px-6 py-4 font-mono text-zinc-300">{o.studentUsn}</td>
                    <td className="px-6 py-4 font-medium text-zinc-200">{o.companyName}</td>
                    <td className="px-6 py-4 text-zinc-300">{o.jobDesignation}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">{o.salaryPackage}</td>
                    <td className="px-6 py-4 text-zinc-400">
                      {o.joiningDate ? new Date(o.joiningDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlacementReportsPage;
