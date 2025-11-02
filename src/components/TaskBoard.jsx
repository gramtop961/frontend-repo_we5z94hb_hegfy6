import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Pencil, CheckCircle2, Clock, ListTodo, Users } from 'lucide-react';

const defaultStatuses = ['To-do', 'In Progress', 'Done'];

const readTasks = () => {
  try {
    const raw = localStorage.getItem('flowpilot_tasks');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeTasks = (tasks) => {
  localStorage.setItem('flowpilot_tasks', JSON.stringify(tasks));
};

const TaskBoard = ({ session }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(session?.user?.email || '');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('To-do');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setTasks(readTasks());
  }, []);

  useEffect(() => {
    writeTasks(tasks);
  }, [tasks]);

  const resetForm = () => {
    setTitle('');
    setAssignee(session?.user?.email || '');
    setDesc('');
    setStatus('To-do');
    setEditingId(null);
  };

  const upsertTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      setTasks((prev) => prev.map((t) => (t.id === editingId ? { ...t, title, assignee, description: desc, status } : t)));
    } else {
      const id = crypto.randomUUID();
      setTasks((prev) => [
        ...prev,
        {
          id,
          title: title.trim(),
          description: desc.trim(),
          assignee: assignee.trim(),
          status,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    resetForm();
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setAssignee(task.assignee);
    setDesc(task.description || '');
    setStatus(task.status);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) resetForm();
  };

  const moveStatus = (task, dir) => {
    const idx = defaultStatuses.indexOf(task.status);
    const nextIdx = Math.min(defaultStatuses.length - 1, Math.max(0, idx + dir));
    const nextStatus = defaultStatuses[nextIdx];
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
  };

  const grouped = useMemo(() => {
    return defaultStatuses.reduce((acc, s) => ({ ...acc, [s]: tasks.filter((t) => t.status === s) }), {});
  }, [tasks]);

  const Stat = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-white">
      <Icon className="h-5 w-5" />
      <div>
        <p className="text-xs text-slate-300">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={ListTodo} label="Total" value={tasks.length} />
        <Stat icon={Clock} label="In Progress" value={grouped['In Progress']?.length || 0} />
        <Stat icon={CheckCircle2} label="Done" value={grouped['Done']?.length || 0} />
        <Stat icon={Users} label="Assigned to me" value={tasks.filter((t) => t.assignee === session?.user?.email).length} />
      </div>

      <form onSubmit={upsertTask} className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
        <h3 className="mb-3 text-base font-semibold">{editingId ? 'Edit Task' : 'Create Task'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assignee (email)"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {defaultStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <Plus className="h-4 w-4" /> {editingId ? 'Update' : 'Add Task'}
          </button>
        </div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description (optional)"
          className="mt-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows={3}
        />
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {defaultStatuses.map((s) => (
          <div key={s} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <h4 className="mb-2 text-sm font-semibold text-white">{s}</h4>
            <div className="space-y-2">
              {grouped[s]?.length ? (
                grouped[s].map((t) => (
                  <div key={t.id} className="rounded-lg border border-white/10 bg-black/30 p-3 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{t.title}</p>
                        {t.description && (
                          <p className="mt-1 text-xs text-slate-300">{t.description}</p>
                        )}
                        <p className="mt-2 text-xs text-slate-400">Assignee: {t.assignee || 'Unassigned'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveStatus(t, -1)}
                          title="Move left"
                          className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                        >
                          ◀
                        </button>
                        <button
                          onClick={() => moveStatus(t, 1)}
                          title="Move right"
                          className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                        >
                          ▶
                        </button>
                        <button
                          onClick={() => editTask(t)}
                          title="Edit"
                          className="rounded-md bg-white/10 p-2 hover:bg-white/20"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(t.id)}
                          title="Delete"
                          className="rounded-md bg-red-500/20 p-2 text-red-200 hover:bg-red-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No tasks in this column.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
