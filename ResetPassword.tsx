import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated (Supabase signs them in automatically via the link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Your reset link is invalid or has expired. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Sign out after password reset to force a fresh login
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-white/5 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2">New Password</h1>
          <p className="text-muted">Set a secure password for your account.</p>
        </div>

        {error && (
          <div className="bg-accent-2/10 border border-accent-2/20 text-accent-2 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                <CheckCircle size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Password Updated</h3>
              <p className="text-muted text-sm leading-relaxed">
                Your password has been successfully reset. Redirecting you to login...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-surface border border-white/5 rounded-xl pl-12 pr-12 py-3 text-text focus:border-accent outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-accent"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-surface border border-white/5 rounded-xl pl-12 pr-4 py-3 text-text focus:border-accent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-background-grad text-white py-3.5 rounded-xl font-bold font-display tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Update Password →'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
