import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { LightEnum, LocationEnum } from "@/interfaces/plant_interfaces";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

const checkMyPlants = z.object({
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
  is_healthy: z.boolean(),
  time_to_water: z.boolean(),
});

type MyPlant = z.infer<typeof checkMyPlants>;
const ArrayDataApi = z.array(checkMyPlants);

const MyPlants = () => {
  const router = useRouter();
  const [myPlants, setMyPlants] = useState<MyPlant[] | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/login");
      return;
    }
    const getItemsFromApi = async (token: string) => {
      const response = await axios.get("http://localhost:8000/my-plants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsedResponse = ArrayDataApi.safeParse(response.data);
      if (parsedResponse.success === true) {
        setMyPlants(parsedResponse.data);
      } else {
        console.log(parsedResponse.error.flatten());
      }
    };
    getItemsFromApi(token);
  }, []);
  if (!myPlants) {
    return <p>Loading...</p>;
  }
  return (
    <main>
      <div className="bg-[url('/plant.jpg')] h-80 bg-center bg-no-repeat bg-cover md:h-80 max-sm:h-[40%] flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono font-bold text-4xl drop-shadow-2xl text-white -mt-8 max-sm:text-2xl">
          My Plants
        </h1>
      </div>
      <div className="flex items-center justify-between mx-8">
        <div>
          <button className="mt-4 font-mono">All Plants</button>
          <button className="mt-4 font-mono">Thirsty Plants</button>
        </div>
        <div>
          <Button className="mt-4 font-mono">Add New Plant</Button>
          <Button className="mt-4 font-mono">Share My Plants</Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2 overflow-scroll m-8">
        {myPlants.length === 0 && <p>You have no plants yet</p>}
        {myPlants.map((aPlant) => {
          return (
            <div key={aPlant.id} className="col-span-2 flex max-sm:min-h-[60%]">
              {aPlant.photo ? (
                <div
                  className="bg-center bg-no-repeat bg-cover w-60 h-60 max-sm:w-[50%] max-sm:h-[100%]"
                  style={{ backgroundImage: `url(${aPlant.photo})` }}
                ></div>
              ) : (
                <div className="bg-[url('/template.jpg')] bg-center bg-no-repeat bg-cover w-60 h-60 max-sm:w-[50%] max-sm:h-[100%]"></div>
              )}
              <div>
                <p>{aPlant.name}</p>
                <p>
                  You water this plant every {aPlant.howOftenWatering}{" "}
                  {aPlant.howOftenWatering === 1 ? (
                    <span> day</span>
                  ) : (
                    <span> days</span>
                  )}{" "}
                  with {aPlant.waterVolume} l of water
                </p>
                {aPlant.is_healthy ? <p>Healthy</p> : <p>Sick</p>}
                {aPlant.time_to_water && <p>Needs water</p>}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default MyPlants;
