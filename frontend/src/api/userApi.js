import api from "./axios";

export const getUserProfile = (token) => {
  return api.get("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadProfileImage = (formData, token) => {
  return api.put("/users/profile/image", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const removeProfileImage = (token) => {
  return api.delete("/users/profile/image", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
