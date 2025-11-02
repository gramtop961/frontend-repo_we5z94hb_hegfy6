import React from 'react';
import { LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = ({ session, onLogout, navigate }) => {
  return (
    <nav className="sticky top-0 z-20 mb-4 rounded-xl border border-white/10 bg-gradient-to-r from-slate-950/80 to-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-3"
        >
          <div className="h-9 w-9 rounded-lg bg-indigo-600 shadow-inner transition-transform group-hover:scale-105" />
          <div className="text-left">
            <h1 className="text-base font-semibold text-white leading-tight">FlowPilot</h1>
            <p className="text-[10px] text-slate-300">AI workflow optimizer</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {!session?.token ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20"
              >
                <LogIn className="h-4 w-4" /> Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow hover:bg-indigo-700"
              >
                <UserPlus className="h-4 w-4" /> Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </button>
              <div className="hidden sm:block text-xs text-slate-300 mr-1">
                {session.user.name}
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500/80 px-3 py-2 text-xs font-medium text-white hover:bg-red-600"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
