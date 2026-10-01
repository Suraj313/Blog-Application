import api from "./axios";

export const getAllPostsAdmin = (token) => {
  return api.get("/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePostAdmin = (postId, token) => {
  return api.delete(`/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const updatePostStatusAdmin = (postId, status, token) => {
  return api.put(
    `/posts/${postId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
