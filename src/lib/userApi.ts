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

type updateUserPhotoParams = {
  name: null;
  photo: string;
  email: null;
  password: null;
};

export const updateUserPhoto = (params: updateUserPhotoParams) => {
  return apiClient.patch("/me", params);
};

export const authorizeGuestToken = (guestToken: string | string[]) => {
  return apiClient.get(`/access-tokens/authorize/${guestToken}`);
};

type UpdateProfileParams = {
  name: string;
  email: string;
  password: string | null;
};

export const updateUserProfile = (params: UpdateProfileParams) => {
  return apiClient.patch("/me", params);
};
