import axiosClient from "../utils/axiosClient";

export async function listPropositionsAide(params = {}) {
  try {
    const response = await axiosClient.get("/propositions-aide", { params });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function createPropositionAide(values) {
  try {
    const response = await axiosClient.post("/propositions-aide", values);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function updatePropositionAide(id, values) {
  try {
    const response = await axiosClient.put(`/propositions-aide/${id}`, values);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function changePropositionAideStatus(id, statut) {
  try {
    const response = await axiosClient.put(`/propositions-aide/${id}/statut`, { statut });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function deletePropositionAide(id) {
  try {
    const response = await axiosClient.delete(`/propositions-aide/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
