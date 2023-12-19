
import axios from "axios";

export async function apiHelper(endpoint, method, data) {
  const PIM_BASE_URL = import.meta.env.PIM_BASE_URL;
  const api = axios.create({
    baseURL: PIM_BASE_URL || 'http://localhost:3001',
  });
  

  try {
    const response = await api({
      method,
      url: `${endpoint}`,
      data,
      // other axios configurations if needed
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
