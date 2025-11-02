import React from 'react';
import Spline from '@splinetool/react-spline';

const Hero = () => {
  return (
    <section className="relative w-full h-[320px] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 to-black">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/30 to-black/80" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow">
          FlowPilot
        </h1>
        <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-200/90">
          An AI-powered workflow optimizer that helps small teams plan, execute, and improve their work.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/20">
            AI insights
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/20">
            Task management
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/20">
            Weekly reports
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
