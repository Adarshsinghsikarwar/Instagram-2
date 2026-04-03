import { api } from "../../../api/apiConfig";

export const uploadStory = async (file) => {
  const formData = new FormData();
  formData.append("media", file);

  const response = await api.post("/stories/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getStoryFeed = async () => {
  const response = await api.get("/stories/feed");
  return response.data;
};

