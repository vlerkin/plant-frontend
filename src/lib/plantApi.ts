import { apiClient } from "./apiClient";

export const getMyPlants = () => {
  return apiClient.get("/my-plants");
};

export const getSpecificPlant = (plantId: number) => {
  return apiClient.get(`/my-plants/${plantId}`);
};

export const waterPlant = (plantId: number) => {
  return apiClient.post(`/my-plants/${plantId}/watering`, {});
};

export const uploadPlantPhoto = (photo: any) => {
  return apiClient.post("/upload/plant", {
    file: photo,
  });
};

export type CreateNewPlantParams = {
  name: string;
  photo: string;
  howOftenWatering: number;
  waterVolume: number;
  light: string;
  location: string;
  comment: string | null;
  species: string | null;
};

export const createNewPlant = (params: CreateNewPlantParams) => {
  return apiClient.post("/my-plants", params);
};

export const deleteSpecificPlant = (plantId: number) => {
  return apiClient.delete(`/my-plants/${plantId}`);
};
