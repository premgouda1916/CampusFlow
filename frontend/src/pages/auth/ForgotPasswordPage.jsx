import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Loader2, KeyRound, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await authService.resetPassword({ email, newPassword });
      toast.success('Password updated successfully. You can now sign in.');
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen spatial-environment text-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md rounded-[32px] spatial-window specular-rim p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="w-11 h-11 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-spatial-glow"
          >
            CF
          </Link>
          <h1 className="text-xl font-light text-white tracking-tight">
            Reset <strong className="font-semibold">Password</strong>
          </h1>
          <p className="text-xs text-zinc-400">
            Enter your registered email address and a new password
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="spatial-label">Registered Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@campusflow.com"
              className="spatial-input"
            />
          </div>

          <div>
            <label className="spatial-label">New Password (min 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="spatial-input"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full spatial-btn-primary py-3">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/[0.08]">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
