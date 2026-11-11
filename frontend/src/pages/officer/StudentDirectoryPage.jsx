import React, { useState, useEffect } from 'react';
import { studentService, departmentService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  FileText,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const StudentDirectoryPage = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [placedFilter, setPlacedFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    departmentService.getDepartments()
      .then((res) => setDepartments(res.data || []))
      .catch(() => {});
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.listStudents({
        departmentId: selectedDept || undefined,
        isPlaced: placedFilter !== '' ? placedFilter === 'true' : undefined,
        size: 50,
      });
      setStudents(res.data.content || []);
    } catch (err) {
      toast.error('Failed to load student directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedDept, placedFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Student Directory</h1>
          <p className="text-xs text-slate-500">Academic credentials, CGPA records, and candidate placement statuses.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>

          <select
            value={placedFilter}
            onChange={(e) => setPlacedFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="">All Placement States</option>
            <option value="true">Placed Only</option>
            <option value="false">Unplaced / Available</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-bold">Student Name & USN</th>
                <th className="px-6 py-3 font-bold">Department</th>
                <th className="px-6 py-3 font-bold">CGPA & Backlogs</th>
                <th className="px-6 py-3 font-bold">Skills</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No students matching specified criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{s.fullName}</div>
                      <div className="text-[11px] text-slate-400">{s.usn} &bull; {s.email}</div>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-700">{s.departmentCode}</td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-emerald-700">{s.currentCgpa} CGPA</span> &bull;{' '}
                      <span className="text-slate-500">{s.backlogCount} Backlogs</span>
                    </td>
                    <td className="px-6 py-3.5 max-w-xs truncate text-slate-600">
                      {s.skills || 'None'}
                    </td>
                    <td className="px-6 py-3.5">
                      {s.placed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Placed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {s.resumeUrl ? (
                        <a
                          href={s.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" /> Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-300">No file</span>
                      )}
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

export default StudentDirectoryPage;

