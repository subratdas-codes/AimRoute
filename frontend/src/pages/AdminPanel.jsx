import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as adminService from "../services/adminService";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    questions: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    results: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    colleges: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    chevron: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    ),
    logout: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    eye: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <Icon name="close" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
const Confirm = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="trash" />
      </div>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type }) => (
  <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all
    ${type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
    {msg}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon name={icon} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" {...props} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white" {...props}>
      {children}
    </select>
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ text, color = "purple" }) => {
  const colors = {
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
    pink: "bg-pink-100 text-pink-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {text}
    </span>
  );
};

const levelColor = { "10th": "blue", "12th": "green", graduation: "orange", pg: "purple" };

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
const DashboardSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAdminStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading stats...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats?.total_users} color="bg-purple-100 text-purple-600" icon="users" />
        <StatCard label="Quiz Results" value={stats?.total_results} color="bg-blue-100 text-blue-600" icon="results" />
        <StatCard label="Questions" value={stats?.total_questions} color="bg-emerald-100 text-emerald-600" icon="questions" />
        <StatCard label="Colleges" value={stats?.total_colleges} color="bg-orange-100 text-orange-600" icon="colleges" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Attempts by Level</h3>
          <div className="space-y-3">
            {stats?.level_breakdown?.map(({ level, count }) => (
              <div key={level}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 capitalize">{level}</span>
                  <span className="text-gray-500">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${Math.min((count / (stats.total_results || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Careers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Top Career Matches</h3>
          <div className="space-y-3">
            {stats?.top_careers?.map(({ career, count }, i) => (
              <div key={career} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 flex-1">{career}</span>
                <Badge text={count} color="purple" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Recently Joined Users</h3>
        <div className="space-y-2">
          {stats?.recent_users?.map(u => (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center">
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Users
// ═══════════════════════════════════════════════════════════════════════════════
const UsersSection = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [modal, setModal] = useState(null); // null | "create" | "edit" | "view"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [confirm, setConfirm] = useState(null);
  const [viewData, setViewData] = useState(null);
  const limit = 10;

  const load = useCallback(() => {
    adminService.getUsers({ skip, limit, search }).then(r => {
      setUsers(r.data.users);
      setTotal(r.data.total);
    });
  }, [skip, search]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    try {
      await adminService.createUser(form);
      showToast("User created!", "success");
      setModal(null);
      setForm({ name: "", email: "", password: "" });
      load();
    } catch (e) {
      showToast(e.response?.data?.detail || "Error", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {};
      if (form.name) payload.name = form.name;
      if (form.email) payload.email = form.email;
      if (form.password) payload.password = form.password;
      await adminService.updateUser(selected.id, payload);
      showToast("User updated!", "success");
      setModal(null);
      load();
    } catch (e) {
      showToast(e.response?.data?.detail || "Error", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      showToast("User deleted!", "success");
      setConfirm(null);
      load();
    } catch (e) {
      showToast("Error deleting user", "error");
    }
  };

  const openView = async (u) => {
    const r = await adminService.getUser(u.id);
    setViewData(r.data);
    setModal("view");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" /></span>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setSkip(0); }}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={() => { setForm({ name: "", email: "", password: "" }); setModal("create"); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 whitespace-nowrap"
        >
          <Icon name="plus" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">ID</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3 text-gray-500">#{u.id}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600">{u.email}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openView(u)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500" title="View">
                      <Icon name="eye" />
                    </button>
                    <button onClick={() => { setSelected(u); setForm({ name: u.name, email: u.email, password: "" }); setModal("edit"); }}
                      className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500" title="Edit">
                      <Icon name="edit" />
                    </button>
                    <button onClick={() => setConfirm({ id: u.id, label: u.name })}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400" title="Delete">
                      <Icon name="trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-10 text-gray-400">No users found</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {skip + 1}–{Math.min(skip + limit, total)} of {total}</span>
        <div className="flex gap-2">
          <button disabled={skip === 0} onClick={() => setSkip(s => Math.max(0, s - limit))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
          <button disabled={skip + limit >= total} onClick={() => setSkip(s => s + limit)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      </div>

      {/* Create Modal */}
      {modal === "create" && (
        <Modal title="Create New User" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
            <Field label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
            <Field label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            <button onClick={handleCreate} className="w-full py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
              Create User
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === "edit" && (
        <Modal title="Edit User" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Field label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Field label="New Password (optional)" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Leave blank to keep current" />
            <button onClick={handleEdit} className="w-full py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {modal === "view" && viewData && (
        <Modal title={`User — ${viewData.name}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Name</p>
                <p className="font-medium">{viewData.name}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Email</p>
                <p className="font-medium">{viewData.email}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                <p className="text-gray-500 text-xs mb-1">Total Quiz Attempts</p>
                <p className="font-bold text-purple-600 text-lg">{viewData.total_attempts}</p>
              </div>
            </div>
            {viewData.results?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Quiz History</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {viewData.results.map(r => (
                    <div key={r.id} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl text-xs">
                      <Badge text={r.level} color={levelColor[r.level] || "gray"} />
                      <span className="text-gray-700 font-medium">{r.top_career}</span>
                      <span className="text-gray-400 ml-auto">{r.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      {confirm && (
        <Confirm
          message={`Delete user "${confirm.label}"? All their results will also be deleted.`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Questions
// ═══════════════════════════════════════════════════════════════════════════════
const QuestionsSection = ({ showToast }) => {
  const [questions, setQuestions] = useState([]);
  const [levelFilter, setLevelFilter] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ level: "10th", question_text: "", order_index: 0, is_start: false });
  const [optForm, setOptForm] = useState({ option_text: "", category_tag: "", next_question_id: "" });
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    adminService.getQuestions(levelFilter || undefined).then(r => setQuestions(r.data));
  }, [levelFilter]);

  useEffect(() => { load(); }, [load]);

  const handleCreateQ = async () => {
    try {
      await adminService.createQuestion({ ...form, order_index: Number(form.order_index) });
      showToast("Question created!", "success");
      setModal(null);
      load();
    } catch { showToast("Error creating question", "error"); }
  };

  const handleEditQ = async () => {
    try {
      await adminService.updateQuestion(selected.id, {
        question_text: form.question_text,
        order_index: Number(form.order_index),
        is_start: form.is_start,
      });
      showToast("Question updated!", "success");
      setModal(null);
      load();
    } catch { showToast("Error updating question", "error"); }
  };

  const handleDeleteQ = async (id) => {
    try {
      await adminService.deleteQuestion(id);
      showToast("Question deleted!", "success");
      setConfirm(null);
      load();
    } catch { showToast("Error deleting question", "error"); }
  };

  const handleAddOption = async (qid) => {
    try {
      await adminService.createOption({
        question_id: qid,
        option_text: optForm.option_text,
        category_tag: optForm.category_tag,
        next_question_id: optForm.next_question_id ? Number(optForm.next_question_id) : null,
      });
      showToast("Option added!", "success");
      setOptForm({ option_text: "", category_tag: "", next_question_id: "" });
      load();
    } catch { showToast("Error adding option", "error"); }
  };

  const handleDeleteOpt = async (id) => {
    try {
      await adminService.deleteOption(id);
      showToast("Option deleted!", "success");
      load();
    } catch { showToast("Error deleting option", "error"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {["", "10th", "12th", "graduation", "pg"].map(l => (
            <button key={l}
              onClick={() => setLevelFilter(l)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === l ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {l || "All"}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setForm({ level: "10th", question_text: "", order_index: 0, is_start: false }); setModal("createQ"); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 whitespace-nowrap"
        >
          <Icon name="plus" /> Add Question
        </button>
      </div>

      <div className="space-y-3">
        {questions.map(q => (
          <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge text={q.level} color={levelColor[q.level] || "gray"} />
                  {q.is_start && <Badge text="Start" color="green" />}
                  <span className="text-xs text-gray-400">Q#{q.id} · Order {q.order_index}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 leading-snug">{q.question_text}</p>
                <p className="text-xs text-gray-400 mt-1">{q.options?.length || 0} options</p>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <button onClick={e => { e.stopPropagation(); setSelected(q); setForm({ level: q.level, question_text: q.question_text, order_index: q.order_index, is_start: q.is_start }); setModal("editQ"); }}
                  className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500">
                  <Icon name="edit" />
                </button>
                <button onClick={e => { e.stopPropagation(); setConfirm({ id: q.id, label: `Q#${q.id}` }); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
                  <Icon name="trash" />
                </button>
                <span className={`transition-transform ${expanded === q.id ? "rotate-90" : ""} text-gray-400`}>
                  <Icon name="chevron" />
                </span>
              </div>
            </div>

            {expanded === q.id && (
              <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
                {/* Options list */}
                <div className="space-y-2">
                  {q.options?.map(opt => (
                    <div key={opt.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded-xl p-2.5">
                      <span className="text-gray-700 flex-1 font-medium">{opt.option_text}</span>
                      <Badge text={opt.category_tag} color="blue" />
                      {opt.next_question_id && <span className="text-gray-400">→ Q#{opt.next_question_id}</span>}
                      <button onClick={() => handleDeleteOpt(opt.id)} className="p-1 rounded hover:bg-red-100 text-red-400">
                        <Icon name="trash" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add option form */}
                <div className="bg-purple-50 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-semibold text-purple-700">Add Option</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input placeholder="Option text" value={optForm.option_text}
                      onChange={e => setOptForm(f => ({ ...f, option_text: e.target.value }))}
                      className="px-2.5 py-1.5 border border-purple-200 rounded-lg text-xs focus:outline-none" />
                    <input placeholder="Category tag" value={optForm.category_tag}
                      onChange={e => setOptForm(f => ({ ...f, category_tag: e.target.value }))}
                      className="px-2.5 py-1.5 border border-purple-200 rounded-lg text-xs focus:outline-none" />
                    <input placeholder="Next Q# (optional)" type="number" value={optForm.next_question_id}
                      onChange={e => setOptForm(f => ({ ...f, next_question_id: e.target.value }))}
                      className="px-2.5 py-1.5 border border-purple-200 rounded-lg text-xs focus:outline-none" />
                  </div>
                  <button onClick={() => handleAddOption(q.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700">
                    <Icon name="plus" /> Add Option
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {questions.length === 0 && (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">No questions found</div>
        )}
      </div>

      {/* Create Q Modal */}
      {modal === "createQ" && (
        <Modal title="Create Question" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Select label="Level" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
              {["10th", "12th", "graduation", "pg"].map(l => <option key={l}>{l}</option>)}
            </Select>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
              <textarea rows={3} value={form.question_text} onChange={e => setForm(f => ({ ...f, question_text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <Field label="Order Index" type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_start} onChange={e => setForm(f => ({ ...f, is_start: e.target.checked }))} className="w-4 h-4 accent-purple-600" />
              <span className="text-gray-700">Is Start Question</span>
            </label>
            <button onClick={handleCreateQ} className="w-full py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
              Create Question
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Q Modal */}
      {modal === "editQ" && (
        <Modal title="Edit Question" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
              <textarea rows={3} value={form.question_text} onChange={e => setForm(f => ({ ...f, question_text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <Field label="Order Index" type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_start} onChange={e => setForm(f => ({ ...f, is_start: e.target.checked }))} className="w-4 h-4 accent-purple-600" />
              <span className="text-gray-700">Is Start Question</span>
            </label>
            <button onClick={handleEditQ} className="w-full py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message={`Delete question ${confirm.label} and all its options?`}
          onConfirm={() => handleDeleteQ(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Results
// ═══════════════════════════════════════════════════════════════════════════════
const ResultsSection = ({ showToast }) => {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [confirm, setConfirm] = useState(null);
  const limit = 15;

  const load = useCallback(() => {
    const params = { skip, limit };
    if (search) params.search = search;
    if (levelFilter) params.level = levelFilter;
    adminService.getResults(params).then(r => {
      setResults(r.data.results);
      setTotal(r.data.total);
    });
  }, [skip, search, levelFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    try {
      await adminService.deleteResult(id);
      showToast("Result deleted!", "success");
      setConfirm(null);
      load();
    } catch { showToast("Error deleting result", "error"); }
  };

  const fitColor = { "Excellent fit": "green", "Good fit": "blue", "Worth exploring": "orange" };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["", "10th", "12th", "graduation", "pg"].map(l => (
            <button key={l} onClick={() => { setLevelFilter(l); setSkip(0); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === l ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {l || "All"}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" /></span>
          <input placeholder="Search email or career..."
            value={search} onChange={e => { setSearch(e.target.value); setSkip(0); }}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">User</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Level</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Top Career</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Fit</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">%</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {results.map(r => (
              <tr key={r.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3 text-gray-600 text-xs">{r.user_email}</td>
                <td className="px-5 py-3"><Badge text={r.level} color={levelColor[r.level] || "gray"} /></td>
                <td className="px-5 py-3 font-medium text-gray-800">{r.top_career}</td>
                <td className="px-5 py-3"><Badge text={r.fit_label} color={fitColor[r.fit_label] || "gray"} /></td>
                <td className="px-5 py-3 text-gray-600">{r.percentage}%</td>
                <td className="px-5 py-3 text-gray-400 text-xs">{r.created_at?.split("T")[0]}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setConfirm({ id: r.id, label: `#${r.id}` })}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
                    <Icon name="trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && <div className="text-center py-10 text-gray-400">No results found</div>}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {skip + 1}–{Math.min(skip + limit, total)} of {total}</span>
        <div className="flex gap-2">
          <button disabled={skip === 0} onClick={() => setSkip(s => Math.max(0, s - limit))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
          <button disabled={skip + limit >= total} onClick={() => setSkip(s => s + limit)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      </div>

      {confirm && (
        <Confirm
          message={`Delete result ${confirm.label}?`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: Colleges
// ═══════════════════════════════════════════════════════════════════════════════
const CollegesSection = ({ showToast }) => {
  const [colleges, setColleges] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", stream: "", state: "", type: "", min_percentage: "", medium: "English", gender: "Co-ed", fees_lpa: "", courses: "", ranking: "" });
  const [confirm, setConfirm] = useState(null);
  const limit = 10;

  const load = useCallback(() => {
    const params = { skip, limit };
    if (search) params.search = search;
    adminService.getColleges(params).then(r => {
      setColleges(r.data.colleges);
      setTotal(r.data.total);
    });
  }, [skip, search]);

  useEffect(() => { load(); }, [load]);

  const blankForm = { name: "", stream: "", state: "", type: "", min_percentage: "", medium: "English", gender: "Co-ed", fees_lpa: "", courses: "", ranking: "" };

  const toPayload = (f) => ({
    name: f.name, stream: f.stream || null, state: f.state || null, type: f.type || null,
    min_percentage: f.min_percentage ? Number(f.min_percentage) : null,
    medium: f.medium || null, gender: f.gender || null,
    fees_lpa: f.fees_lpa ? Number(f.fees_lpa) : null,
    courses: f.courses || null, ranking: f.ranking ? Number(f.ranking) : null,
  });

  const handleCreate = async () => {
    try {
      await adminService.createCollege(toPayload(form));
      showToast("College created!", "success");
      setModal(null);
      setForm(blankForm);
      load();
    } catch (e) { showToast("Error creating college", "error"); }
  };

  const handleEdit = async () => {
    try {
      await adminService.updateCollege(selected.id, toPayload(form));
      showToast("College updated!", "success");
      setModal(null);
      load();
    } catch { showToast("Error updating college", "error"); }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCollege(id);
      showToast("College deleted!", "success");
      setConfirm(null);
      load();
    } catch { showToast("Error deleting college", "error"); }
  };

  const CollegeForm = ({ onSubmit, label }) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="College Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        <Field label="Stream" value={form.stream} onChange={e => setForm(f => ({ ...f, stream: e.target.value }))} placeholder="Engineering, Medical..." />
        <Field label="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
        <Field label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="Government, Private..." />
        <Field label="Min Percentage" type="number" value={form.min_percentage} onChange={e => setForm(f => ({ ...f, min_percentage: e.target.value }))} />
        <Select label="Medium" value={form.medium} onChange={e => setForm(f => ({ ...f, medium: e.target.value }))}>
          {["English","Hindi","Tamil","Telugu","Kannada","Malayalam","Marathi","Bengali","Gujarati","Bilingual"].map(m => <option key={m}>{m}</option>)}
        </Select>
        <Select label="Gender" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
          {["Co-ed","Women","Men"].map(g => <option key={g}>{g}</option>)}
        </Select>
        <Field label="Fees (LPA)" type="number" value={form.fees_lpa} onChange={e => setForm(f => ({ ...f, fees_lpa: e.target.value }))} />
        <Field label="Ranking" type="number" value={form.ranking} onChange={e => setForm(f => ({ ...f, ranking: e.target.value }))} />
        <div className="col-span-2"><Field label="Courses" value={form.courses} onChange={e => setForm(f => ({ ...f, courses: e.target.value }))} placeholder="B.Tech, MBA, MBBS..." /></div>
      </div>
      <button onClick={onSubmit} className="w-full py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
        {label}
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" /></span>
          <input placeholder="Search colleges..." value={search}
            onChange={e => { setSearch(e.target.value); setSkip(0); }}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <button
          onClick={() => { setForm(blankForm); setModal("create"); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 whitespace-nowrap"
        >
          <Icon name="plus" /> Add College
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">State</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Stream</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Cutoff</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Medium</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Gender</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {colleges.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-800 max-w-[180px] truncate">{c.name}</td>
                <td className="px-5 py-3 text-gray-600">{c.state || "—"}</td>
                <td className="px-5 py-3 text-gray-600 max-w-[120px] truncate">{c.stream || "—"}</td>
                <td className="px-5 py-3 text-gray-600">{c.min_percentage ? `${c.min_percentage}%` : "—"}</td>
                <td className="px-5 py-3"><Badge text={c.medium || "English"} color="blue" /></td>
                <td className="px-5 py-3">
                  <Badge text={c.gender || "Co-ed"} color={c.gender === "Women" ? "pink" : c.gender === "Men" ? "blue" : "gray"} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => {
                      setSelected(c);
                      setForm({ name: c.name, stream: c.stream || "", state: c.state || "", type: c.type || "",
                        min_percentage: c.min_percentage || "", medium: c.medium || "English",
                        gender: c.gender || "Co-ed", fees_lpa: c.fees_lpa || "", courses: c.courses || "", ranking: c.ranking || "" });
                      setModal("edit");
                    }} className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500">
                      <Icon name="edit" />
                    </button>
                    <button onClick={() => setConfirm({ id: c.id, label: c.name })}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
                      <Icon name="trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {colleges.length === 0 && <div className="text-center py-10 text-gray-400">No colleges found</div>}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {skip + 1}–{Math.min(skip + limit, total)} of {total}</span>
        <div className="flex gap-2">
          <button disabled={skip === 0} onClick={() => setSkip(s => Math.max(0, s - limit))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
          <button disabled={skip + limit >= total} onClick={() => setSkip(s => s + limit)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      </div>

      {modal === "create" && (
        <Modal title="Add College" onClose={() => setModal(null)}>
          <CollegeForm onSubmit={handleCreate} label="Create College" />
        </Modal>
      )}
      {modal === "edit" && (
        <Modal title="Edit College" onClose={() => setModal(null)}>
          <CollegeForm onSubmit={handleEdit} label="Save Changes" />
        </Modal>
      )}
      {confirm && (
        <Confirm message={`Delete "${confirm.label}"?`} onConfirm={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN: Admin Panel
// ═══════════════════════════════════════════════════════════════════════════════
const SECTIONS = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "users", label: "Users", icon: "users" },
  { key: "questions", label: "Questions", icon: "questions" },
  { key: "results", label: "Results", icon: "results" },
  { key: "colleges", label: "Colleges", icon: "colleges" },
];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Admin guard — replace with your admin check logic
const ADMIN_EMAILS = ["aimroute.noreply@gmail.com"];  // was "admin@aimroute.com"

useEffect(() => {
  if (!user) { navigate("/admin-login"); return; }  // was navigate("/login")
  if (!ADMIN_EMAILS.includes(user.email)) { navigate("/"); }
}, [user]);

  const active = SECTIONS.find(s => s.key === section);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:flex`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">AimRoute</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => { setSection(s.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${section === s.key ? "bg-purple-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}>
              <Icon name={s.icon} />
              {s.label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50" title="Logout">
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900">{active?.label}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">AimRoute Admin Panel</p>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="text-xs text-gray-500 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
            ← Back to App
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {section === "dashboard" && <DashboardSection />}
          {section === "users" && <UsersSection showToast={showToast} />}
          {section === "questions" && <QuestionsSection showToast={showToast} />}
          {section === "results" && <ResultsSection showToast={showToast} />}
          {section === "colleges" && <CollegesSection showToast={showToast} />}
        </main>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}