import { LightEnum, LocationEnum } from "@/interfaces/plant_interfaces";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/utils";
import { z } from "zod";

export const checkPlantInfo = z.object({
  info: z.object({
    id: z.number().int().gte(0),
    name: z.string().max(100),
    howOftenWatering: z.number().int().gte(0),
    light: LightEnum,
    location: LocationEnum,
    species: z.string().nullable(),
    photo_url: z.string().nullable(),
    waterVolume: z.number(),
    comment: z.string().nullable(),
    userId: z.number().int(),
  }),
  watering_log: z
    .object({
      dateTime: z.string(),
      id: z.number().int().gte(0),
      plantId: z.number().int().gte(0),
      waterVolume: z.number(),
    })
    .nullable(),
  fertilizing_log: z
    .object({
      type: z.string(),
      dateTime: z.string(),
      quantity: z.number().gte(0),
      id: z.number().int().gte(0),
      plantId: z.number().int().gte(0),
    })
    .nullable(),
  disease_log: z
    .array(
      z
        .object({
          disease_type: z.string(),
          id: z.number().int().gte(0),
          startDate: z.string(),
          plantId: z.number().int().gte(0),
          endDate: z.string().nullable(),
          treatment: z.string().nullable(),
        })
        .nullable()
    )
    .nullable(),
});

export type PlantInfo = z.infer<typeof checkPlantInfo>;

export const checkAddPlantFormData = z.object({
  name: z.string().max(100),
  watering: z.number().int().gte(0).lte(366),
  volume: z.number().gte(0).lte(1000),
  light: LightEnum,
  location: LocationEnum,
  species: z.string().max(100).nullable(),
  comment: z.string().max(500).nullable(),
  photo: z
    .any()
    .refine(
      (files) => !files || !files[0] || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 10MB.`
    )
    .refine(
      (files) =>
        !files || !files[0] || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .nullable(),
});

export type DataFromAddPlantForm = z.infer<typeof checkAddPlantFormData>;

export const checkMyPlants = z.object({
  id: z.number().int().gte(0),
  name: z.string().max(100),
  howOftenWatering: z.number().int().gte(0),
  light: LightEnum,
  location: LocationEnum,
  species: z.string().nullable(),
  photo_url: z.string().nullable(),
  waterVolume: z.number(),
  comment: z.string().nullable(),
  userId: z.number().int(),
  is_healthy: z.boolean(),
  time_to_water: z.boolean(),
});

export type MyPlant = z.infer<typeof checkMyPlants>;
export const arrayMyPlantsDataApi = z.array(checkMyPlants);
