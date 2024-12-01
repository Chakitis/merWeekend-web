import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getItems = async () => {
  const response = await api.get("/items");
  return response.data;
};

export const addItem = async (item: { name: string }) => {
  const response = await api.post("/items", item);
  return response.data;
};
