import { apiClient } from "./apiClient";

type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

export const registerUser = (params: RegisterParams) => {
  return apiClient.post("/register", params);
};

type LoginParams = {
  email: string;
  password: string;
};

export const loginUser = (params: LoginParams) => {
  return apiClient.post("/login", params);
};

export const getUser = () => {
  return apiClient.get("/me");
};

export const getAccessTokens = () => {
  return apiClient.get("/access-tokens");
};

type CreateTokenParams = {
  guest_name: string;
  end_date: Date;
};

export const createAccessToken = (params: CreateTokenParams) => {
  return apiClient.post("/access-tokens", params);
};

export const deleteAccessToken = (tokenId: number) => {
  return apiClient.delete("/access-tokens", {
    data: { token_id: tokenId },
  });
};

export const uploadUserPhoto = (photo: any) => {
  return apiClient.post(
    "/upload/user",
    {
      file: photo,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

type updateUserParams = {
  name: null;
  photo: string;
  email: null;
  password: null;
};

export const updateUser = (params: updateUserParams) => {
  return apiClient.patch("/me", params);
};