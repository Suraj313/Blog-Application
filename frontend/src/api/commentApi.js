import api from "./axios";

export const getCommentsByPost = (postId) => {
  return api.get(`/comments/post/${postId}`);
};

export const addComment = (data, token) => {
  return api.post("/comments", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
