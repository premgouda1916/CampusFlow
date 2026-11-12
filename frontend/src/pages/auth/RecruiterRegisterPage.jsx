import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ArrowRight, Loader2 } from 'lucide-react';

export const RecruiterRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    companyWebsite: '',
    industry: 'Technology & Cloud',
    location: 'Bangalore, India',
    designation: 'Talent Acquisition Lead',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { registerRecruiter } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await registerRecruiter(formData);
      toast.success('Recruiter registration submitted for placement cell review.');
      navigate('/recruiter/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen spatial-environment text-zinc-100 py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl rounded-[32px] spatial-window specular-rim p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="w-11 h-11 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-spatial-glow"
          >
            CF
          </Link>
          <h1 className="text-2xl font-light text-white tracking-tight">
            Register <strong className="font-semibold">Corporate Recruiter</strong>
          </h1>
          <p className="text-xs text-zinc-400">
            Already verified?{' '}
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
                placeholder="Vikramaditya Sen"
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Corporate Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="recruiter@company.com"
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
                placeholder="+91 98765 12345"
                className="spatial-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="spatial-label">Company / Organization Name *</label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Cisco Systems, Atlassian, Adobe"
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Company Website</label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://company.com"
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Industry / Domain</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Office Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="spatial-input"
              />
            </div>

            <div>
              <label className="spatial-label">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="spatial-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full spatial-btn-primary py-3 mt-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <span>Submit Recruiter Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecruiterRegisterPage;
