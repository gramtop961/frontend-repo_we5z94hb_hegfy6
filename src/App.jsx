import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TaskBoard from './components/TaskBoard';
import AssistantPanel from './components/AssistantPanel';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

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

const useHashRoute = () => {
  const getPath = () => decodeURI(window.location.hash.replace(/^#/, '')) || '/';
  const [path, setPath] = useState(getPath());
  useEffect(() => {
    const onChange = () => setPath(getPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const navigate = (to) => {
    window.location.hash = to.startsWith('/') ? `#${to}` : `#/${to}`;
  };
  return { path, navigate };
};

function App() {
  const [session, setSession] = useState(null);
  const { path, navigate } = useHashRoute();

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
    navigate('/login');
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

  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_20%_-10%,#312e81_0%,transparent_60%),radial-gradient(1000px_600px_at_120%_10%,#0ea5e9_0%,transparent_60%),linear-gradient(to_bottom,#020617_0%,#000_100%)]">
      <Navbar session={session} onLogout={handleLogout} navigate={navigate} />

      <div className="mx-auto max-w-6xl px-4 pb-10">
        {!isAuthRoute && (
          <>
            <Hero />
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <TaskBoard session={session} />
                <AssistantPanel tasks={tasks} session={session} />
              </div>
              <aside className="md:col-span-1">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
                  <h3 className="text-base font-semibold">Welcome to FlowPilot</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Create and track tasks, chat with the AI assistant for insights, and generate weekly summaries. Sign in to personalize your experience.
                  </p>
                  {!session?.token && (
                    <div className="mt-3 space-x-2">
                      <button onClick={() => navigate('/login')} className="rounded-lg bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/20">Login</button>
                      <button onClick={() => navigate('/register')} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white hover:bg-indigo-700">Sign Up</button>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </>
        )}

        {isAuthRoute && (
          <div className="flex min-h-[70vh] items-center justify-center">
            {path.startsWith('/login') ? (
              <LoginForm onLogin={handleLogin} navigate={navigate} />
            ) : (
              <SignupForm onLogin={handleLogin} navigate={navigate} />
            )}
          </div>
        )}
      </div>

      <footer className="mt-6 border-t border-white/10 py-6 text-center text-xs text-slate-400">
        Built with love for small teams — FlowPilot MVP
      </footer>
    </div>
  );
}

export default App;
