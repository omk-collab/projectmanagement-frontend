import api from "./axios";

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const logoutUser = () => api.post("/auth/logout");
export const getCurrentUser = () => api.post("/auth/current-user"); // tera route POST hai, GET nahi
export const updateAccountDetails = (data) =>
  api.patch("/auth/update-account", data);

export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (resetToken, data) =>
  api.post(`/auth/reset-password/${resetToken}`, data);

export const googleLogin = (credential) =>
  api.post("/auth/google", { credential });

export const updateAvatar = (formData) => {
  return api.post("/auth/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};