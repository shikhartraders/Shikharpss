import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Your email is not confirmed. Please check your inbox or go to your Supabase Dashboard > Authentication > Providers > Email and disable "Confirm email" to allow instant login.');
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      const from = (location.state as any)?.from || '/profile';
      navigate(from);
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
          <h1 className="text-3xl font-extrabold mb-2">Welcome Back</h1>
          <p className="text-muted">
            {(location.state as any)?.message || 'Login to access your free courses'}
          </p>
        </div>

        {error && (
          <div className="bg-accent-2/10 border border-accent-2/20 text-accent-2 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Password</label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-accent hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-background-grad text-white py-3.5 rounded-xl font-bold font-display tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup', { state: location.state })}
            className="text-accent font-semibold hover:underline"
          >
            Sign up for free
          </button>
        </div>
      </motion.div>
    </div>
  );
}
