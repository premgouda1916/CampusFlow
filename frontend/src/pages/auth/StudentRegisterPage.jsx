import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { departmentService } from '../../services/api';
import { ArrowRight, Loader2 } from 'lucide-react';

export const StudentRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    usn: '',
    departmentCode: 'CSE',
    collegeName: 'M.S. Ramaiah Institute of Technology',
    graduationYear: 2027,
    currentCgpa: '8.50',
    backlogCount: 0,
    skills: 'Java, Spring Boot, MySQL, React',
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { registerStudent } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    departmentService.getDepartments()
      .then((res) => setDepartments(res.data || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        graduationYear: parseInt(formData.graduationYear, 10),
        currentCgpa: parseFloat(formData.currentCgpa),
        backlogCount: parseInt(formData.backlogCount, 10),
      };
      await registerStudent(payload);
      toast.success('Student account created successfully.');
      navigate('/student/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen spatial-environment text-zinc-100 py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl rounded-[32px] spatial-window specular-rim p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="w-11 h-11 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-spatial-glow"
          >
            CF
          </Link>
          <h1 className="text-2xl font-light text-white tracking-tight">
            Create <strong className="font-semibold">Student Profile</strong>
          </h1>
          <p className="text-xs text-zinc-400">
            Already registered?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="spatial-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Arjun Sharma"
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Institutional Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@campusflow.com"
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Password (min 6 chars) *</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">USN / Student ID *</label>
              <input
                type="text"
                name="usn"
                required
                value={formData.usn}
                onChange={handleChange}
                placeholder="1MS21CS001"
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Department *</label>
              <select
                name="departmentCode"
                value={formData.departmentCode}
                onChange={handleChange}
                className="spatial-input"
              >
                {departments.length > 0 ? (
                  departments.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.code} - {d.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="CSE">CSE - Computer Science</option>
                    <option value="ISE">ISE - Information Science</option>
                    <option value="ECE">ECE - Electronics & Comm</option>
                    <option value="AIML">AIML - AI & Machine Learning</option>
                    <option value="MECH">MECH - Mechanical</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="spatial-label">Cumulative CGPA (0 - 10) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="currentCgpa"
                required
                value={formData.currentCgpa}
                onChange={handleChange}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Active Backlogs *</label>
              <input
                type="number"
                min="0"
                name="backlogCount"
                required
                value={formData.backlogCount}
                onChange={handleChange}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Graduation Year *</label>
              <input
                type="number"
                name="graduationYear"
                required
                value={formData.graduationYear}
                onChange={handleChange}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">College / Institution *</label>
              <input
                type="text"
                name="collegeName"
                required
                value={formData.collegeName}
                onChange={handleChange}
                className="spatial-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="spatial-label">Technical Skills (Comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Java, Python, React, SQL, Spring Boot, Git"
                className="spatial-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full spatial-btn-primary py-3 mt-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Profile...
              </>
            ) : (
              <>
                <span>Register Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegisterPage;
