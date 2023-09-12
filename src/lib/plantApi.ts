import { apiClient } from "./apiClient";

export const getMyPlants = () => {
  return apiClient.get("/my-plants");
};

export const waterPlant = (plantId: number) => {
  return apiClient.post(`/my-plants/${plantId}/watering`, {});
};
