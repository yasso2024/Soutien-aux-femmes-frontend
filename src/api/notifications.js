import axiosClient from "../utils/axiosClient";

export async function listNotifications() {
  try {
    return await axiosClient.get("/notifications");
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function markAsRead(id) {
  try {
    return await axiosClient.put(`/notifications/${id}/lire`);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function markAllAsRead() {
  try {
    return await axiosClient.put("/notifications/lire-tout");
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function deleteNotification(id) {
  try {
    return await axiosClient.delete(`/notifications/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function deleteAllNotifications() {
  try {
    return await axiosClient.delete("/notifications");
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}