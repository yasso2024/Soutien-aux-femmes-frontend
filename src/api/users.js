import axiosClient from "../utils/axiosClient";
import { format } from "date-fns";

export async function createUser(values, avatarFilename) {
  try {
    const payload = {
      ...values,
      dob: values.dob ? format(values.dob, "yyyy-MM-dd") : undefined,
      avatar: avatarFilename,
    };

    const response = await axiosClient.post("/user/create", payload);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function listUsers() {
  try {
    return await axiosClient.get("/user");
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function updateUser(id, values, avatarFilename) {
  try {
    const payload = {
      ...values,
      dob: values.dob ? format(values.dob, "yyyy-MM-dd") : undefined,
      avatar: avatarFilename,
    };

    const response = await axiosClient.put(`/user/update/${id}`, payload);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function getUserById(id) {
  try {
    const response = await axiosClient.get(`/user/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}