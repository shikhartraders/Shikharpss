import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-white/5 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl"
      >
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8 text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Reset Password</h1>
          <p className="text-muted">Enter your email and we'll send you a link to reset your password.</p>
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
              <h3 className="text-xl font-bold">Check your inbox</h3>
              <p className="text-muted text-sm leading-relaxed">
                We've sent a password reset link to <span className="text-text font-semibold">{email}</span>.
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="text-accent font-semibold hover:underline text-sm"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface border border-white/5 rounded-xl pl-12 pr-4 py-3 text-text focus:border-accent outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-background-grad text-white py-3.5 rounded-xl font-bold font-display tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Reset Link →'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
