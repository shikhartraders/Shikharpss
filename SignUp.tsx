import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      if (error.message.includes('confirmation email')) {
        setError('Email confirmation is currently disabled or failing. Please go to your Supabase Dashboard > Authentication > Providers > Email and disable "Confirm email" to allow instant sign-up.');
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      // If sign up is successful, check if we should redirect
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
          <h1 className="text-3xl font-extrabold mb-2">Join Shikhar PS</h1>
          <p className="text-muted">Start your free learning journey today</p>
        </div>

        {error && (
          <div className="bg-accent-2/10 border border-accent-2/20 text-accent-2 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all"
              placeholder="Piyush Pandey"
            />
          </div>

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
            <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Password</label>
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
            {loading ? 'Creating account...' : 'Create Free Account →'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login', { state: location.state })}
            className="text-accent font-semibold hover:underline"
          >
            Login here
          </button>
        </div>
      </motion.div>
    </div>
  );
}
