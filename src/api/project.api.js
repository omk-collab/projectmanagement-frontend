import api from "./axios";

export const getProjects = () => api.get("/projects");
export const getProjectById = (projectId) => api.get(`/projects/${projectId}`);
export const createProject = (data) => api.post("/projects", data);
export const updateProject = (projectId, data) =>
  api.put(`/projects/${projectId}`, data);
export const deleteProject = (projectId) =>
  api.delete(`/projects/${projectId}`);

export const getProjectMembers = (projectId) =>
  api.get(`/projects/${projectId}/members`);
export const addMember = (projectId, data) =>
  api.post(`/projects/${projectId}/members`, data);
export const updateMemberRole = (projectId, userId, newRole) =>
  api.put(`/projects/${projectId}/members/${userId}`, { newRole });
export const removeMember = (projectId, userId) =>
  api.delete(`/projects/${projectId}/members/${userId}`);
