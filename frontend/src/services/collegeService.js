import API from "./api";

export const getColleges = async () => {
  return await API.get("/college/recommendations");
};