import api from "./axios";

export const getAllCategoriesAdmin = () => {
  return api.get("/categories");
};

export const createCategoryAdmin = (name, token) => {
  return api.post(
    "/categories",
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteCategoryAdmin = (id, token) => {
  return api.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
