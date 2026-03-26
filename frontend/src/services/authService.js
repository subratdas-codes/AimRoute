import API from "./api";

// Login API
export const loginUser = async (data) => {
  return await API.post("/auth/login", data);
};

// Register API
export const registerUser = async (data) => {
  return await API.post("/register", data);
};