import api from "./api";

export const generateDescription = async (name, category) => {
  const { data } = await api.post("/ai/product-description", {
    name,
    category,
  });

  console.log("AI response:", data);

  return data.description;
};