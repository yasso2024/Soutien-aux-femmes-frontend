import axiosClient from "../utils/axiosClient";

export async function sendChatMessage(message) {
  try {
    const response = await axiosClient.post("/chatbot/message", { message });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Erreur chatbot");
  }
}

export async function getChatMessages() {
  try {
    const response = await axiosClient.get("/chatbot");
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Erreur chargement messages");
  }
}