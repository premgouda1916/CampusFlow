import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Lock, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';

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

      // Route based on authenticated role
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">CampusFlow</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-white tracking-tight">
          Sign in to your portal
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Or{' '}
          <Link to="/register/student" className="font-medium text-indigo-400 hover:text-indigo-300">
            register as a new student
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-850 py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-slate-800 space-y-6">
          {searchParams.get('session_expired') && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              Your session expired. Please sign in again.
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Quick Demo Switcher */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> 1-Click Demo Accounts:
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('arjun.sharma@campusflow.com', 'Student (Arjun)')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 hover:border-indigo-500/50 text-left truncate transition"
              >
                🎓 Student (Arjun)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('priya.nair@campusflow.com', 'Student (Priya)')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 hover:border-indigo-500/50 text-left truncate transition"
              >
                🎓 Student (Priya)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('recruiter.google@campusflow.com', 'Google Recruiter')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 hover:border-indigo-500/50 text-left truncate transition"
              >
                🏢 Google Recruiter
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('officer@campusflow.com', 'Placement Officer')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 hover:border-indigo-500/50 text-left truncate transition"
              >
                🏛️ Placement Officer
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@campusflow.com', 'System Admin')}
                className="col-span-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 hover:border-indigo-500/50 text-center truncate transition"
              >
                ⚙️ Platform Administrator
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-850 px-2 text-slate-500 font-semibold">Or enter manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campusflow.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">Hiring company? </span>
            <Link to="/register/recruiter" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              Register corporate profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
