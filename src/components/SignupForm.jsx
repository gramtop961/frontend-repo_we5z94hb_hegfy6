import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const SignupForm = ({ onLogin, navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    const token = btoa(`${email}:${Date.now()}`);
    const user = { id: email, email, name };
    onLogin({ token, user });
    navigate('/');
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-black/70 p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Create your account</h2>
          <p className="text-sm text-slate-300">Get started with FlowPilot in seconds.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-300">Name</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3">
              <User className="h-4 w-4 text-slate-300" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                placeholder="Your name"
              />
            </div>
          </div>
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
            <UserPlus className="h-4 w-4" /> Create account
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-slate-300">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-indigo-400 hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
