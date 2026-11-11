import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, ArrowRight, Loader2, KeyRound, Sparkles, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleDemoFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMsg('');
    toast.info(`Loaded credentials for ${demoRole}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const authData = await login(email, password);
      toast.success(`Welcome back, ${authData.fullName}!`);

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

  return (
    <div className="min-h-screen spatial-environment text-slate-100 flex flex-col justify-center items-center p-4 relative select-none">
      {/* Background Timber Horizon */}
      <div className="spatial-desk-shelf" />

      {/* Floating Safari Window Chrome */}
      <div className="w-full max-w-md h-10 mb-2 px-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] flex items-center justify-between text-slate-400 text-xs z-20 shadow-lg">
        <div className="flex items-center gap-1.5">
          <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-slate-300">
          <Lock className="w-2.5 h-2.5 text-emerald-400" />
          <span>campusflow.edu</span>
          <span className="text-slate-500">/</span>
          <span className="text-blue-400">auth</span>
        </div>
        <RotateCw className="w-3 h-3 text-slate-500" />
      </div>

      {/* Main Floating Spatial Login Window */}
      <div className="w-full max-w-md rounded-[36px] spatial-window specular-rim p-6 sm:p-8 relative z-10 shadow-spatial-window space-y-6">
        
        {/* Brand Monogram & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-spatial-glow">
            CF
          </div>
          <h2 className="text-2xl font-light text-white tracking-tight pt-1">
            Sign in to <strong className="font-bold">CampusFlow</strong>
          </h2>
          <p className="text-xs text-slate-400">
            Spatial Recruitment & Placement Management Platform
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Demo Account Switcher Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" /> 1-Click Demo Accounts:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('arjun.sharma@campusflow.com', 'Student (Arjun)')}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 hover:border-blue-400/50 text-left truncate transition"
            >
              🎓 Student (Arjun)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('priya.nair@campusflow.com', 'Student (Priya)')}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 hover:border-blue-400/50 text-left truncate transition"
            >
              🎓 Student (Priya)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('recruiter.google@campusflow.com', 'Google Recruiter')}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 hover:border-blue-400/50 text-left truncate transition"
            >
              🏢 Google Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('officer@campusflow.com', 'Placement Officer')}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 hover:border-blue-400/50 text-left truncate transition"
            >
              🏛️ Placement Officer
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@campusflow.com', 'System Admin')}
              className="col-span-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 hover:border-blue-400/50 text-center truncate transition"
            >
              ⚙️ Platform Administrator
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0e1320] px-3 text-slate-500 font-bold tracking-widest">Or enter manually</span>
          </div>
        </div>

        {/* Manual Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 pl-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campusflow.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/60 focus:bg-white/[0.08] transition shadow-inner"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 pl-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/60 focus:bg-white/[0.08] transition shadow-inner"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-spatial-glow transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Spatial Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/[0.08] space-y-2">
          <div>
            Student?{' '}
            <Link to="/register/student" className="text-blue-400 hover:text-blue-300 font-semibold">
              Create student account
            </Link>
          </div>
          <div>
            Corporate recruiter?{' '}
            <Link to="/register/recruiter" className="text-blue-400 hover:text-blue-300 font-semibold">
              Register company
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
