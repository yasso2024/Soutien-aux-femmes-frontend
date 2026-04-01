import axiosClient from "../utils/axiosClient";

export async function listDemandes(params = {}) {
  try {
    return await axiosClient.get("/demandes", { params });
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function createDemande(values) {
  try {
    return await axiosClient.post("/demandes", values);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function deleteDemande(id) {
  try {
    return await axiosClient.delete(`/demandes/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function updateStatutDemande(id, statut) {
  try {
    return await axiosClient.put(`/demandes/${id}/statut`, { statut });
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function getDemande(id) {
  try {
    return await axiosClient.get(`/demandes/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function updateDemande(id, values) {
  try {
    return await axiosClient.put(`/demandes/${id}`, values);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}