import api from "./axios";

export const getDashboardStats = (token) => {
  return api.get("/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
