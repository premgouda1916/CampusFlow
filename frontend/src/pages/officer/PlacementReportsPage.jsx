import React, { useState, useEffect } from 'react';
import { offerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import {
  FileSpreadsheet,
  Download,
  Building,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const PlacementReportsPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    offerService.getMyOffers // We can load all company offers or get reports
    // Let's load student directory or offers
    fetch('/api/v1/offers/company', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('campusflow_token')}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        setOffers(res?.data?.content || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadCsv = () => {
    const token = localStorage.getItem('campusflow_token');
    fetch('/api/v1/analytics/placement/export-csv', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'campusflow_placement_report.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        toast.success('Placement report CSV downloaded successfully.');
      })
      .catch(() => toast.error('Failed to export CSV report'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement Reports & Export</h1>
          <p className="text-xs text-slate-500">Official university placement records, CTC distributions, and CSV downloads.</p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export Placement Data (CSV)
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Live Campus Placement Registry</h3>
            <p className="text-xs text-slate-400">Formal employment offers and compensation records.</p>
          </div>
        </div>

        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3">
          <FileSpreadsheet className="w-12 h-12 text-indigo-500 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">Download Verified Institutional Placement Dataset</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            The CSV export contains Student Names, USNs, Departments, Hiring Enterprises, Job Roles, CTC Compensation, and Joining Dates formatted for accreditation and university reporting.
          </p>
          <div className="pt-2">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
            >
              <Download className="w-4 h-4" /> Download Complete CSV Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementReportsPage;

