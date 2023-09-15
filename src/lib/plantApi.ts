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
  return apiClient.post(
    "/upload/plant",
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

export type UpdatePlantInfoParams = {
  name: string;
  photo: string;
  howOftenWatering: number;
  waterVolume: number;
  light: string;
  location: string;
  comment: string | null;
  species: string | null;
};

export const updatePlantInfo = (
  params: UpdatePlantInfoParams,
  plantId: number
) => {
  return apiClient.patch(`/my-plants/${plantId}`, params);
};

type CreateNewPlantParams = {
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

type LogNewFertiliserParams = {
  type: string;
  quantity: number;
};

export const logNewFertilising = (
  params: LogNewFertiliserParams,
  plantId: number
) => {
  return apiClient.post(`/my-plants/${plantId}/fertilizing`, params);
};

type UpdateEndDateParams = {
  end_date: Date;
  plant_disease_id: number;
};

export const updateDiseaseEndDate = (
  params: UpdateEndDateParams,
  plantId: number
) => {
  return apiClient.patch(`/my-plants/${plantId}/plant-disease`, params);
};

export const getDiseaseInfo = () => {
  return apiClient.get("/all-diseases");
};

type CreateDiseaseLogParams = {
  diseaseId: number;
  startDate: Date;
  treatment: string | null;
};

export const createDiseaseLog = (
  params: CreateDiseaseLogParams,
  plantId: number
) => {
  return apiClient.post(`/my-plants/${plantId}/plant-disease`, params);
};
