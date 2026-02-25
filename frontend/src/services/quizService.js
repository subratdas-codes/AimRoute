import API from "./api";

// Get quiz questions
export const getQuizQuestions = async () => {
  return await API.get("/quiz/questions");
};

// Submit quiz answers
export const submitQuiz = async (answers) => {
  return await API.post("/quiz/submit", answers);
};

// Get recommendation result
export const getResult = async () => {
  return await API.get("/recommendation/result");
};