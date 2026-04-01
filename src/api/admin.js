import axiosClient from "../utils/axiosClient";

export async function getDashboardStats() {
  return axiosClient.get("/admin/dashboard-stats");
}