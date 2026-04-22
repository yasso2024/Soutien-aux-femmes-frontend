import axiosClient from "../utils/axiosClient";

export async function listActionsSolidaires() {
  try {
    const response = await axiosClient.get("/actions-solidaires");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function createActionSolidaire(values) {
  try {
    const response = await axiosClient.post("/actions-solidaires", values);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function updateActionSolidaire(id, values) {
  try {
    const response = await axiosClient.put(`/actions-solidaires/${id}`, values);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function deleteActionSolidaire(id) {
  try {
    const response = await axiosClient.delete(`/actions-solidaires/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function participerAction(id) {
  try {
    const response = await axiosClient.put(`/actions-solidaires/${id}/participer`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function changeActionStatus(id, statut) {
  try {
    const response = await axiosClient.put(`/actions-solidaires/${id}/statut`, { statut });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}