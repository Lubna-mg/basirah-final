import api from "./axios";

export const addNote = async (testId, text) => {
  const { data } = await api.post(
    `/doctor/tests/${testId}/notes`,
    { text }
  );
  return data;
};

export const getReport = async (testId) => {
  const { data } = await api.get(
    `/doctor/tests/${testId}/report`
  );
  return data;
};
