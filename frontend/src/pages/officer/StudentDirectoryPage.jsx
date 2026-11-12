import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { studentService, departmentService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  FileText,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const StudentDirectoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [placedFilter, setPlacedFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    departmentService.getDepartments()
      .then((res) => setDepartments(res.data || []))
      .catch(() => {});
  }, []);

  const fetchStudents = async (activeSearch) => {
    setLoading(true);
    try {
      const res = await studentService.listStudents({
        departmentId: selectedDept || undefined,
        isPlaced: placedFilter !== '' ? placedFilter === 'true' : undefined,
        search: (activeSearch ?? searchTerm).trim() || undefined,
        size: 50,
      });
      setStudents(res.data?.content || []);
    } catch {
      toast.error('Failed to load student directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const paramQuery = searchParams.get('search') || '';
    setSearchTerm(paramQuery);
    fetchStudents(paramQuery);
  }, [selectedDept, placedFilter, searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      setSearchParams({ search: trimmed });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl spatial-panel p-5 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Student Records
          </span>
          <h1 className="text-2xl font-light text-white tracking-tight mt-0.5">
            Institutional <strong className="font-semibold">Student Directory</strong>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Academic credentials, CGPA records, skills, and placement outcomes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, USN, skill..."
                className="spatial-input pl-8 w-44 sm:w-52"
              />
            </div>
          </form>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="spatial-input w-auto min-w-[160px]"
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
            className="spatial-input w-auto min-w-[150px]"
          >
            <option value="">All States</option>
            <option value="true">Placed Only</option>
            <option value="false">Available Only</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl spatial-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-white/[0.08]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Student & USN</th>
                <th className="px-6 py-3.5 font-semibold">Department</th>
                <th className="px-6 py-3.5 font-semibold">CGPA & Backlogs</th>
                <th className="px-6 py-3.5 font-semibold">Skills</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-400">
                    Loading student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                    No students matching specified criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.03] transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{s.fullName}</div>
                      <div className="text-[11px] text-zinc-400">{s.usn} • {s.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-200">{s.departmentCode}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-emerald-400">{s.currentCgpa} CGPA</span> •{' '}
                      <span className="text-zinc-400">{s.backlogCount} Backlogs</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-zinc-300">
                      {s.skills || 'None'}
                    </td>
                    <td className="px-6 py-4">
                      {s.placed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                          <CheckCircle2 className="w-3 h-3" /> Placed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.06] text-zinc-300 border border-white/10">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {s.resumeUrl ? (
                        <a
                          href={s.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" /> Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-zinc-500">No file</span>
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
