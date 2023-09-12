import { InternalAxiosRequestConfig } from "axios";
import { getToken } from "./tokenApi";

export const insertAccessToken = (request: InternalAxiosRequestConfig) => {
  const accessToken = getToken();
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }
  return request;
};
