import NavBar from "@/components/navigationBar";
import { LightEnum, LocationEnum } from "@/interfaces/plant_interfaces";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

const checkPlantInfo = z.object({
  info: z.object({
    id: z.number().int().gte(0),
    name: z.string().max(100),
    howOftenWatering: z.number().int().gte(0),
    light: LightEnum,
    location: LocationEnum,
    species: z.string().nullable(),
    photo: z.string().nullable(),
    waterVolume: z.number(),
    comment: z.string().nullable(),
    userId: z.number().int(),
  }),
  watering_log: z.array(
    z.object({
      dateTime: z.date(),
      id: z.number().int().gte(0),
      plantId: z.number().int().gte(0),
      waterVolume: z.number(),
    })
  ),
  fertilizing_log: z.array(
    z.object({
      type: z.string(),
      dateTime: z.date(),
      quantity: z.number().gte(0),
      id: z.number().int().gte(0),
      plantId: z.number().int().gte(0),
    })
  ),
  disease_log: z.array(
    z.object({
      diseaseId: z.number().int().gte(0),
      id: z.number().int().gte(0),
      startDate: z.date(),
      comment: z.string().nullable(),
      plantId: z.number().int().gte(0),
      endDate: z.date(),
      treatment: z.string().nullable(),
    })
  ),
});

type PlantInfo = z.infer<typeof checkPlantInfo>;

const Plant = () => {
  const [token, setToken] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const router = useRouter();
  const idFromUrl = Number(router.query.plantId);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/login");
      return;
    }
    setToken(token);

    const getPlantInfoFromApi = async (token: string) => {
      const response = await axios.get(
        `http://localhost:8000/my-plants/${idFromUrl}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const parsedResponse = checkPlantInfo.safeParse(response.data);
      if (parsedResponse.success === true) {
        setPlantInfo(parsedResponse.data);
      } else {
        console.log(parsedResponse.error.flatten());
      }
    };
    getPlantInfoFromApi(token);
  }, [idFromUrl]);
  if (!plantInfo) {
    return <p>Loading...</p>;
  }
  return (
    <main>
      <NavBar />
      <div>
        <div></div>
        <div>
          <span>{plantInfo.info.name}</span>
          <p>
            Watering every {plantInfo.info.howOftenWatering}
            {plantInfo.info.howOftenWatering === 1 ? (
              <span> day</span>
            ) : (
              <span> days</span>
            )}
          </p>
        </div>
      </div>
    </main>
  );
};

export default Plant;
