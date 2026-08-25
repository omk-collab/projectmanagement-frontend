import api from "./axios";

export const getTasks = (projectId) => api.get(`/tasks/${projectId}`);
export const getTaskById = (projectId, taskId) =>
  api.get(`/tasks/${projectId}/t/${taskId}`);

export const createTask = (projectId, formData) =>
  api.post(`/tasks/${projectId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateTask = (projectId, taskId, formData) =>
  api.put(`/tasks/${projectId}/t/${taskId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteTask = (projectId, taskId) =>
  api.delete(`/tasks/${projectId}/t/${taskId}`);

// Subtasks
export const createSubTask = (projectId, taskId, data) =>
  api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, data);

export const updateSubTask = (projectId, subTaskId, data) =>
  api.put(`/tasks/${projectId}/st/${subTaskId}`, data);

export const deleteSubTask = (projectId, subTaskId) =>
  api.delete(`/tasks/${projectId}/st/${subTaskId}`);
