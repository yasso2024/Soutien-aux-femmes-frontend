import axiosClient from "../utils/axiosClient";

export async function listDons(params = {}) {
  try {
    return await axiosClient.get("/dons", { params });
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function createDon(values) {
  try {
    return await axiosClient.post("/dons", values);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function deleteDon(id) {
  try {
    return await axiosClient.delete(`/dons/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
export async function getDon(id) {
  return axiosClient.get(`/dons/${id}`);
}

export async function updateDon(id, values) {
  return axiosClient.put(`/dons/${id}`, values);
}

export async function confirmerDon(id) {
  return axiosClient.patch(`/dons/${id}/confirm`, {});
}

export async function changeDonStatus(id, statut) {
  try {
    return await axiosClient.put(`/dons/${id}/statut`, { statut });
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}