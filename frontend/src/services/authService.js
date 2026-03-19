import axios from "axios";

const API = "http://localhost:5000"; // change if backend port different

export const loginUser = (data) => {
  return axios.post(`${API}/auth/login`, data);
};