import api from "./axios";

export const getAllCommentsAdmin = (token) => {
  return api.get("/comments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const approveCommentAdmin = (id, token) => {
  return api.put(
    `/comments/${id}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteCommentAdmin = (id, token) => {
  return api.delete(`/comments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
