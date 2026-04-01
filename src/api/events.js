import axiosClient from "../utils/axiosClient";

export async function listEvenements(search = "") {
  return axiosClient.get("/evenements", {
    params: search ? { search } : {},
  });
}

export async function getEvenementById(id) {
  return axiosClient.get(`/evenements/${id}`);
}

export async function createEvenement(values) {
  return axiosClient.post("/evenements", values);
}

export async function updateEvenement(id, values) {
  return axiosClient.put(`/evenements/${id}`, values);
}

export async function deleteEvenement(id) {
  return axiosClient.delete(`/evenements/${id}`);
}

export async function inscrireEvenement(id) {
  return axiosClient.put(`/evenements/${id}/inscrire`);
}