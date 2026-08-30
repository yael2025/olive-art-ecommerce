import api from "./api";

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const { data } = await api.post("/upload", formData);

  //console.log("UPLOAD RESPONSE:", data);

  return data.imageUrl;
};