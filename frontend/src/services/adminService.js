import api from "./api";

// ─── Stats ───────────────────────────────────────────────────────────────────
export const getAdminStats = () => api.get("/admin/stats");

// ─── Users ───────────────────────────────────────────────────────────────────
export const getUsers = (params) => api.get("/admin/users", { params });
export const getUser = (id) => api.get(`/admin/users/${id}`);
export const createUser = (data) => api.post("/admin/users", data);
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// ─── Questions ───────────────────────────────────────────────────────────────
export const getQuestions = (level) =>
  api.get("/admin/questions", { params: level ? { level } : {} });
export const getQuestion = (id) => api.get(`/admin/questions/${id}`);
export const createQuestion = (data) => api.post("/admin/questions", data);
export const updateQuestion = (id, data) => api.put(`/admin/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/admin/questions/${id}`);

// ─── Options ─────────────────────────────────────────────────────────────────
export const createOption = (data) => api.post("/admin/options", data);
export const updateOption = (id, data) => api.put(`/admin/options/${id}`, data);
export const deleteOption = (id) => api.delete(`/admin/options/${id}`);

// ─── Results ─────────────────────────────────────────────────────────────────
export const getResults = (params) => api.get("/admin/results", { params });
export const getResultsGrouped = (params) => api.get("/admin/results/grouped", { params });
export const deleteResult = (id) => api.delete(`/admin/results/${id}`);

// ─── Colleges ────────────────────────────────────────────────────────────────
export const getColleges = (params) => api.get("/admin/colleges", { params });
export const getCollege = (id) => api.get(`/admin/colleges/${id}`);
export const createCollege = (data) => api.post("/admin/colleges", data);
export const updateCollege = (id, data) => api.put(`/admin/colleges/${id}`, data);
export const deleteCollege = (id) => api.delete(`/admin/colleges/${id}`);