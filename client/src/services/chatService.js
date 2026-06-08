import api from "./api";

export const sendChatMessage = async (message) => {
  const { data } = await api.post("/chat", { message });
  return data.reply;
};