import React, { useEffect, useMemo, useState } from 'react';
import { LogOut } from 'lucide-react';

import Hero from './components/Hero';
import AuthPanel from './components/AuthPanel';
import TaskBoard from './components/TaskBoard';
import AssistantPanel from './components/AssistantPanel';

const readSession = () => {
  try {
    const raw = localStorage.getItem('flowpilot_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeSession = (session) => {
  if (!session) localStorage.removeItem('flowpilot_session');
  else localStorage.setItem('flowpilot_session', JSON.stringify(session));
};

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  const handleLogin = ({ token, user }) => {
    const sess = { token, user, createdAt: Date.now() };
    setSession(sess);
    writeSession(sess);
  };

  const handleLogout = () => {
    setSession(null);
    writeSession(null);
  };

  // Read tasks for assistant panel aggregation
  const tasks = useMemo(() => {
    try {
      const raw = localStorage.getItem('flowpilot_tasks');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [session]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 shadow-inner" />
            <div>
              <h1 className="text-lg font-semibold text-white">FlowPilot</h1>
              <p className="text-xs text-slate-300">Workflow optimizer for small teams</p>
            </div>
          </div>
          {session?.token && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          )}
        </header>

        {/* Hero with Spline */}
        <Hero />

        {/* Auth & App sections */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <AuthPanel session={session} onLogin={handleLogin} onLogout={handleLogout} />
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
              This MVP runs fully in your browser with local session and task storage. Backend, database, and AI APIs can be wired up next.
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <TaskBoard session={session} />
            <AssistantPanel tasks={tasks} session={session} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
