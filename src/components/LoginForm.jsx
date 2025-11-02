import React, { useState } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';

const LoginForm = ({ onLogin, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    const token = btoa(`${email}:${Date.now()}`);
    const user = { id: email, email, name: email.split('@')[0] };
    onLogin({ token, user });
    navigate('/');
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-black/70 p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Welcome back</h2>
          <p className="text-sm text-slate-300">Sign in to manage your workflows and get AI insights.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-300">Email</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3">
              <Mail className="h-4 w-4 text-slate-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                placeholder="you@company.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-300">Password</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3">
              <Lock className="h-4 w-4 text-slate-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
          >
            <LogIn className="h-4 w-4" /> Sign in
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-slate-300">
          New here?{' '}
          <button onClick={() => navigate('/register')} className="text-indigo-400 hover:underline">
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
