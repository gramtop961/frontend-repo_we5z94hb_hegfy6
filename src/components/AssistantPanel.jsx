import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Send, MessageSquare, BarChart3, Calendar } from 'lucide-react';

const AssistantPanel = ({ tasks = [], session }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I am your FlowPilot assistant. Ask me for insights, blockers, or a summary of current progress.',
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const stats = useMemo(() => {
    const summary = tasks.reduce(
      (acc, t) => {
        acc.total += 1;
        acc.status[t.status] = (acc.status[t.status] || 0) + 1;
        if (t.assignee) acc.byAssignee[t.assignee] = (acc.byAssignee[t.assignee] || 0) + 1;
        return acc;
      },
      { total: 0, status: {}, byAssignee: {} }
    );
    return summary;
  }, [tasks]);

  const fakeAI = async (prompt) => {
    // Dummy LLM: create a short insight using current task stats
    const todo = stats.status['To-do'] || 0;
    const doing = stats.status['In Progress'] || 0;
    const done = stats.status['Done'] || 0;
    const focus = doing > todo ? 'maintain momentum' : 'prioritize starting blocked items';
    const line = `Insight: ${done} done, ${doing} in progress, ${todo} to-do. Suggestion: ${focus}.`;
    await new Promise((r) => setTimeout(r, 600));
    return `${line}\nYou asked: "${prompt}"`;
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    const userMsg = { role: 'user', content: text, ts: Date.now() };
    setMessages((m) => [...m, userMsg, { role: 'assistant', content: 'Thinking…', ts: Date.now(), typing: true }]);
    const reply = await fakeAI(text);
    setMessages((m) => m.map((msg) => (msg.typing ? { ...msg, content: reply, typing: false } : msg)));
  };

  const generateWeeklySummary = () => {
    const period = 'this week';
    const todo = stats.status['To-do'] || 0;
    const doing = stats.status['In Progress'] || 0;
    const done = stats.status['Done'] || 0;
    const topAssignee = Object.entries(stats.byAssignee || {})
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    const summary = `Weekly report (${period}): ${done} tasks completed, ${doing} in progress, ${todo} pending. ${
      topAssignee ? `Top contributor: ${topAssignee}. ` : ''
    }Focus next week: reduce carry-overs and unblock high-priority items.`;

    setMessages((m) => [
      ...m,
      { role: 'assistant', content: summary, ts: Date.now() },
    ]);
  };

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="text-base font-semibold">Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateWeeklySummary}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20"
          >
            <BarChart3 className="h-4 w-4" /> Weekly Summary
          </button>
        </div>
      </div>

      <div className="h-64 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`mb-2 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for insights, blockers, or planning help…"
          className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <Send className="h-4 w-4" /> Send
        </button>
      </form>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
        <Calendar className="h-3.5 w-3.5" /> Local-only MVP preview. Sign in to personalize your session.
      </div>
    </div>
  );
};

export default AssistantPanel;
