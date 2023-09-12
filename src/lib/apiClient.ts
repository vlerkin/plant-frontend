import axios from "axios";
import { insertAccessToken } from "./middleware";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

apiClient.interceptors.request.use(insertAccessToken);
