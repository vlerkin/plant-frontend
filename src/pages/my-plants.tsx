import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { LightEnum, LocationEnum } from "@/interfaces/plant_interfaces";
import { AuthUser } from "@/interfaces/user_interfaces";
import { getAuthUser } from "@/lib/utils";
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
  const [authUserState, setAuthUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setUserLoading] = useState<boolean>(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/login");
      return;
    }
    // check if token not expired and wait until function returns the answer
    const authenticateUser = async () => {
      const authUser = await getAuthUser();
      setAuthUser(authUser);
      setUserLoading(false);
    };
    authenticateUser();

    const getPlantsFromApi = async (token: string) => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/my-plants",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
  if (isUserLoading) {
    return <p>Loading...</p>;
  } else if (!authUserState) {
    router.push("/login");
    return;
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
      <div className="flex mx-4 mt-4 items-center justify-between flex-col md:flex-row lg:flex-row">
        <div className="flex justify-center items-center">
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
        <div className="flex justify-center items-center">
          {!authUserState.is_guest && (
            <button
              onClick={() => router.push("/add-plant")}
              className="flex items-center m-2 font-mono border-solid border-[1px] border-black rounded-md p-2 bg-sky-100/20 hover:bg-[#81A684] md:py-2 lg:py-2 md:border-white md:text-white lg:border-white lg:text-white md:px-4 lg:px-4 active:bg-sky-200/20"
            >
              <img
                src="/plus.svg"
                alt="icon of watering can"
                className="inline h-6 w-6 md:hidden lg:hidden"
              />
              <img
                src="/plant.svg"
                alt="icon of watering can"
                className="inline h-12 w-12 md:hidden lg:hidden"
              />
              <p className="text-sm hidden md:text-base md:block">Add Plant</p>
            </button>
          )}

          {!authUserState.is_guest && (
            <button
              onClick={() => router.push("/add-plant")}
              className="m-2 font-mono border-solid border-[1px] border-black rounded-md p-2 bg-sky-100/20 hover:bg-[#81A684] md:py-2 lg:py-2 md:border-white md:text-white lg:border-white lg:text-white md:px-4 lg:px-4 active:bg-sky-200/20"
            >
              <img
                src="/share.svg"
                alt="icon of watering can"
                className="inline h-12 w-12 md:hidden lg:hidden"
              />
              <p className="text-sm hidden md:text-base md:block">
                Share My Plants
              </p>
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-4 grid-cols-2 overflow-scroll p-10 md:grid-cols-6 md:gap-8 font-mono">
        {myPlants.length === 0 && (
          <p className="col-span-2 col-start-2 text-center text-sm md:text-base lg:text-base">
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
                className="col-span-2 flex min-h-[60%] text-sm backdrop-blur-md bg-gray-900/10 rounded-md text-white shadow-lg relative active:translate-y-2 hover:-translate-y-2 hover:cursor-pointer hover:shadow-2xl md:text-base lg:text-base"
              >
                {aPlant.photo_url ? (
                  <div
                    className="bg-center rounded-l-md bg-no-repeat bg-cover h-36 w-24 md:w-60 md:h-60"
                    style={{ backgroundImage: `url(${aPlant.photo_url})` }}
                  ></div>
                ) : (
                  <div className="bg-[url('/template.jpg')] rounded-l-md bg-center bg-no-repeat bg-cover h-36 w-24 md:w-60 md:h-60"></div>
                )}
                <div className="flex flex-col items-center justify-around ml-4 p-2">
                  <span className="inline font-semibold md:text-xl text-center mt-2">
                    {aPlant.name}
                  </span>{" "}
                  {aPlant.is_healthy ? (
                    <img
                      className="w-6 h-6 inline absolute -top-1.5 -right-1.5 backdrop-blur-md bg-gray-900/10 rounded-full p-[3px]"
                      src="/leaf.svg"
                      alt="leaf icon -  healthy"
                    />
                  ) : (
                    <img
                      className="w-6 h-6 inline absolute -top-1.5 -right-1.5 backdrop-blur-md bg-gray-900/10 rounded-full p-[3px]"
                      src="/sick.svg"
                      alt="leaf icon -  sick"
                    />
                  )}
                  <div className="flex flex-col items-start">
                    <div className="text-sm md:text-base lg:text-base flex items-start">
                      <img
                        src="/watering.svg"
                        alt="icon of watering can"
                        className="inline pb-[1px] mr-2 h-6 w-6"
                      />

                      <span>
                        every {aPlant.howOftenWatering}{" "}
                        {aPlant.howOftenWatering === 1 ? (
                          <span> day</span>
                        ) : (
                          <span> days</span>
                        )}
                      </span>
                    </div>
                    <div className="text-sm md:text-base lg:text-base flex items-start">
                      <img
                        src="/drop.svg"
                        alt="icon of water drop"
                        className="inline mr-2 h-5 w-5"
                      />
                      <span>{aPlant.waterVolume} L</span>
                    </div>
                  </div>
                  {aPlant.time_to_water && (
                    <img
                      className="w-6 h-6 inline absolute -top-1.5 right-[18px] backdrop-blur-md bg-gray-900/10 rounded-full p-[3px]"
                      src="/drop.svg"
                      alt="leaf icon -  healthy"
                    />
                  )}
                  <button className="m-2 font-mono border-solid border-[1px] border-white rounded-md py-[4px] px-2 bg-sky-100/20 hover:bg-[#81A684] md:py-2 lg:py-2  text-white md:px-4 lg:px-4 active:bg-sky-200/20">
                    Water Plant
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default MyPlants;
