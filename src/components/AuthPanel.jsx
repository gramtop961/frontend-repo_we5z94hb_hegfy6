import React, { useState, useEffect } from 'react';
import { User, LogIn, UserPlus } from 'lucide-react';

const AuthPanel = ({ session, onLogin, onLogout }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    // Simulate JWT issuance for MVP local testing
    const token = btoa(`${email}:${Date.now()}`);
    const user = { id: email, email, name: mode === 'signup' ? name : email.split('@')[0] };

    onLogin({ token, user });
    setName('');
    setEmail('');
    setPassword('');
  };

  if (session?.token) {
    return (
      <div className="w-full rounded-xl border border-slate-200/10 bg-white/5 p-4 md:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-300">Signed in as</p>
              <p className="text-base font-medium">{session.user.name}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <LogIn className="h-4 w-4 rotate-180" />
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-slate-200/10 bg-white/5 p-4 md:p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Welcome</h2>
        <div className="flex gap-2">
          <button
            className={`rounded-md px-3 py-1 text-sm ${mode === 'login' ? 'bg-white/20' : 'bg-white/5'} hover:bg-white/20`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`rounded-md px-3 py-1 text-sm ${mode === 'signup' ? 'bg-white/20' : 'bg-white/5'} hover:bg-white/20`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs text-slate-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Your name"
            />
          </div>
        )}
        <div>
          <label className="block text-xs text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {mode === 'signup' ? (
            <>
              <UserPlus className="h-4 w-4" /> Create account
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" /> Sign in
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AuthPanel;
