import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  KeyRound,
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck
} from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleDemoFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMsg('');
    toast.info(`Credentials loaded for ${demoRole}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const authData = await login(email, password);
      toast.success(`Signed in as ${authData.fullName}`);

      switch (authData.role) {
        case 'STUDENT':
          navigate('/student/dashboard');
          break;
        case 'RECRUITER':
          navigate('/recruiter/dashboard');
          break;
        case 'PLACEMENT_OFFICER':
          navigate('/officer/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'arjun.sharma@campusflow.com', label: 'Student (Arjun)', role: 'Student — Arjun Sharma', icon: GraduationCap },
    { email: 'priya.nair@campusflow.com', label: 'Student (Priya)', role: 'Student — Priya Nair', icon: GraduationCap },
    { email: 'recruiter.google@campusflow.com', label: 'Google Recruiter', role: 'Recruiter — Google', icon: Briefcase },
    { email: 'officer@campusflow.com', label: 'Placement Officer', role: 'Placement Officer', icon: Building2 },
    { email: 'admin@campusflow.com', label: 'System Administrator', role: 'Administrator', icon: ShieldCheck, span: true },
  ];

  return (
    <div className="min-h-screen spatial-environment text-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md rounded-[32px] spatial-window specular-rim p-6 sm:p-8 shadow-spatial-window space-y-6">

        <div className="text-center space-y-2">
          <Link
            to="/"
            className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-spatial-glow"
          >
            CF
          </Link>
          <h1 className="text-xl font-light text-white tracking-tight pt-1">
            Sign in to <strong className="font-semibold">CampusFlow</strong>
          </h1>
          <p className="text-xs text-zinc-400">
            Campus Placement & Recruitment Management
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" /> Quick Role Access
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {demoAccounts.map((acct) => {
              const Icon = acct.icon;
              return (
                <button
                  key={acct.email}
                  type="button"
                  onClick={() => handleDemoFill(acct.email, acct.role)}
                  className={`${acct.span ? 'col-span-2 justify-center' : ''} flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-zinc-200 border border-white/[0.09] hover:border-emerald-400/40 text-left transition`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{acct.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#18181b] px-3 text-zinc-500 font-semibold tracking-wider">Credentials</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="spatial-label">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campusflow.com"
                className="spatial-input pl-10"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-emerald-400 hover:text-emerald-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="spatial-input pl-10"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full spatial-btn-primary py-3">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400 pt-3 border-t border-white/[0.08] space-y-1.5">
          <div>
            Student registration:{' '}
            <Link to="/register/student" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Create student account
            </Link>
          </div>
          <div>
            Corporate partner:{' '}
            <Link to="/register/recruiter" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Register recruiter profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
