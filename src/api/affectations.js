import axiosClient from "../utils/axiosClient";

export async function listAffectations() {
  try {
    const response = await axiosClient.get("/affectations");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function createAffectation(values) {
  try {
    const response = await axiosClient.post("/affectations", values);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function confirmerParticipation(id) {
  try {
    const response = await axiosClient.put(`/affectations/${id}/confirmer`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function deleteAffectation(id) {
  try {
    const response = await axiosClient.delete(`/affectations/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
