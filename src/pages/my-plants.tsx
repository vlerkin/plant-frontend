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
  photo_url: z.string().nullable(),
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
  const [filterState, setFilterState] = useState<boolean>(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/login");
      return;
    }
    const getPlantsFromApi = async (token: string) => {
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
    getPlantsFromApi(token);
  }, []);
  if (!myPlants) {
    return <p>Loading...</p>;
  }
  const handleClickPlant = (plant_id: number) => {
    router.push(`/my-plants/${plant_id}`);
  };
  return (
    <main className="bg-[#57886C] bg-repeat-y min-h-screen">
      <div className="bg-[url('/plant.jpg')] h-32 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono -mb-12 font-bold text-xl drop-shadow-2xl text-white md:-mb-4 lg:-md-4 md:text-4xl lg:text-4xl">
          My Plants
        </h1>
      </div>
      <div className="flex mx-8 mt-4 items-center justify-between">
        <div className="flex justify-center items-center flex-col md:flex-row lg:flex-row">
          <button
            onClick={() => setFilterState(false)}
            className={`m-4 text-sm font-mono border-dashed border-neutral-50 border-[1px] p-2 rounded-md text-neutral-50 hover:backdrop-blur-md hover:bg-gray-900/10 ${
              filterState === false && "bg-sky-100/20 text-white"
            }`}
          >
            All Plants
          </button>
          <button
            onClick={() => setFilterState(true)}
            className={`m-4 text-sm font-mono border-dashed border-neutral-50 border-[1px] p-2 rounded-md text-neutral-50 hover:backdrop-blur-md hover:bg-gray-900/10 ${
              filterState === true && "bg-sky-100/20 text-white"
            }`}
          >
            Thirsty Plants
          </button>
        </div>
        <div className=" flex justify-center items-center flex-col md:flex-row lg:flex-row">
          <Button
            onClick={() => router.push("/add-plant")}
            className="m-4 font-mono"
          >
            Add New Plant
          </Button>
          <Button className="m-4 font-mono">Share My Plants</Button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-2 overflow-scroll p-10 md:grid-cols-4 md:gap-8 font-mono">
        {myPlants.length === 0 && (
          <p className="col-span-2 col-start-2 text-center">
            You have no plants yet
          </p>
        )}
        {myPlants
          .filter(
            (aPlant) => aPlant.time_to_water === true || filterState === false
          )
          .map((aPlant) => {
            return (
              <div
                key={aPlant.id}
                onClick={() => handleClickPlant(aPlant.id)}
                className="col-span-2 flex min-h-[60%] backdrop-blur-md bg-gray-900/10 rounded-md text-white shadow-lg relative active:translate-y-2 hover:-translate-y-2 hover:cursor-pointer hover:shadow-2xl"
              >
                {aPlant.photo_url ? (
                  <div
                    className="bg-center rounded-l-md bg-no-repeat bg-cover md:w-60 md:h-60 w-60 h-36"
                    style={{ backgroundImage: `url(${aPlant.photo_url})` }}
                  ></div>
                ) : (
                  <div className="bg-[url('/template.jpg')] rounded-l-md bg-center bg-no-repeat bg-cover md:w-60 md:h-60 w-60 h-36"></div>
                )}
                <div className="flex flex-col justify-around ml-4 p-2">
                  <span className="inline font-semibold md:text-xl">
                    {aPlant.name}
                  </span>{" "}
                  {aPlant.is_healthy && (
                    <img
                      className="w-6 h-6 inline absolute -top-1.5 -right-1.5 backdrop-blur-md bg-gray-900/10 rounded-full p-[3px]"
                      src="/leaf.svg"
                      alt="leaf icon -  healthy"
                    />
                  )}
                  <p>
                    Watering every {aPlant.howOftenWatering}{" "}
                    {aPlant.howOftenWatering === 1 ? (
                      <span> day</span>
                    ) : (
                      <span> days</span>
                    )}{" "}
                    with {aPlant.waterVolume} L of water
                  </p>
                  {aPlant.time_to_water && (
                    <img
                      className="w-6 h-6 inline absolute -top-1.5 right-[18px] backdrop-blur-md bg-gray-900/10 rounded-full p-[3px]"
                      src="/drop.svg"
                      alt="leaf icon -  healthy"
                    />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default MyPlants;
