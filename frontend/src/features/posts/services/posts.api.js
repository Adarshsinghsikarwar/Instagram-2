import { api } from "../../../api/apiConfig";

export async function getPosts() {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function createPost({ files, caption }) {
  const formData = new FormData();
  formData.append("caption", caption);
  Array.from(files).forEach((file) => {
    formData.append("media", file);
  });
  const response = await api.post("posts", formData);
  return response.data;
}
