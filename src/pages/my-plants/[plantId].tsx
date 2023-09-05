import NavBar from "@/components/navigationBar";
import { LightEnum, LocationEnum } from "@/interfaces/plant_interfaces";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

const numberToMonth = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

const checkPlantInfo = z.object({
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

type PlantInfo = z.infer<typeof checkPlantInfo>;

const Plant = () => {
  const [token, setToken] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const router = useRouter();
  const plantId = Number(router.query.plantId);
  useEffect(() => {
    if (plantId === undefined || isNaN(plantId)) {
      return;
    }

    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/login");
      return;
    }
    setToken(token);

    const getPlantInfoFromApi = async (token: string) => {
      const response = await axios.get(
        `http://localhost:8000/my-plants/${plantId}`,
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
  }, [plantId]);
  if (!plantInfo) {
    return <p>Loading...</p>;
  }
  return (
    <main className="bg-[#57886C] bg-repeat-y min-h-screen flex justify-center items-start font-mono">
      <NavBar />
      <div className="backdrop-blur-md bg-gray-900/10 rounded-md w-full text-white my-20 mx-4 md:w-2/5 lg:w-2/5">
        <div className="md:flex md:flex-row md:items-center">
          {plantInfo.info.photo_url ? (
            <div
              className="bg-center bg-no-repeat rounded-t-md bg-cover w-full h-48 md:rounded-full md:w-44 md:h-44 md:m-6 lg:rounded-full lg:w-44 lg:h-44 lg:m-6 "
              style={{ backgroundImage: `url(${plantInfo.info.photo_url})` }}
            ></div>
          ) : (
            <div className="bg-[url('/template.jpg')] rounded-l-md bg-center bg-no-repeat bg-cover w-full h-48"></div>
          )}
          <div className="flex flex-col m-4 md:inline">
            <div className="flex flex-col justify-center mb-2 ">
              <span className="text-center font-semibold text-lg md:text-xl lg:text-xl">
                {plantInfo.info.name}
              </span>
              {plantInfo.info.species && (
                <span className="text-xs text-center italic">
                  ({plantInfo.info.species})
                </span>
              )}
            </div>

            <div className="flex justify-around items-center my-2">
              <img
                src="/drop.svg"
                alt="icon of water drop"
                height={25}
                width={25}
                className="inline mr-[1px]"
              />
              <span className="text-sm md:text-base">
                {plantInfo.info.waterVolume} L
              </span>
              <span>|</span>
              <img
                src="/sun.svg"
                alt="icon of sun"
                height={25}
                width={25}
                className="inline mr-[1px]"
              />
              <span className="text-sm md:text-base">
                {plantInfo.info.light}
              </span>
              <span>|</span>
              <img
                src="/compass.svg"
                alt="icon of compass"
                height={30}
                width={30}
                className="inline"
              />
              <span className="text-sm md:text-base">
                {plantInfo.info.location}
              </span>
            </div>
            <div className="flex justify-center items-center">
              <img
                src="/watering.svg"
                alt="icon of watering can"
                height={30}
                width={30}
                className="inline mr-2 pb-2"
              />
              <span className="text-sm md:text-base">
                every {plantInfo.info.howOftenWatering}
                {plantInfo.info.howOftenWatering === 1 ? (
                  <span className="text-sm md:text-base"> day</span>
                ) : (
                  <span className="text-sm md:text-base"> days</span>
                )}
              </span>
            </div>
          </div>
        </div>
        {plantInfo.info.comment && (
          <div className="border-dotted border-[1px] p-2 rounded-lg m-4 md:-mt-4 lg:-mt-2">
            <img
              src="/comment.svg"
              alt="icon of comment"
              height={22}
              width={22}
              className="inline"
            />
            <p className="inline text-sm md:text-base">
              {" "}
              {plantInfo.info.comment}
            </p>
          </div>
        )}
        <p className="text-sm text-center border-solid border-b-[1px] border-white mx-4 pb-2">
          Last actions
        </p>
        <div className="md:flex lg:flex">
          <div>
            <div className="text-sm m-4">
              <div className="flex items-center">
                <img
                  src="/watercan.svg"
                  alt="icon of watering can"
                  height={45}
                  width={45}
                  className="inline"
                ></img>
                {plantInfo.watering_log != null ? (
                  <p className="ml-2">
                    {
                      numberToMonth[
                        plantInfo.watering_log.dateTime
                          .split("T")[0]
                          .split("-")[1] as keyof typeof numberToMonth
                      ]
                    }{" "}
                    {
                      plantInfo.watering_log.dateTime
                        .split("T")[0]
                        .split("-")[2]
                    }
                  </p>
                ) : (
                  <p className="ml-2">You have not watered the plant yet</p>
                )}
              </div>
            </div>
            <div className="text-sm m-4">
              <div className="flex items-center">
                <img
                  src="/fertiliser.svg"
                  alt="icon of fertiliser"
                  height={40}
                  width={40}
                  className="inline"
                ></img>
                {plantInfo.fertilizing_log != null ? (
                  <div className="ml-2">
                    <p>
                      {plantInfo.fertilizing_log.quantity}g of{" "}
                      {plantInfo.fertilizing_log.type}
                    </p>
                    <p>
                      {
                        numberToMonth[
                          plantInfo.fertilizing_log.dateTime
                            .split("T")[0]
                            .split("-")[1] as keyof typeof numberToMonth
                        ]
                      }{" "}
                      {
                        plantInfo.fertilizing_log.dateTime
                          .split("T")[0]
                          .split("-")[2]
                      }
                    </p>
                  </div>
                ) : (
                  <p>You have not fertilised the plant yet</p>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm m-4">
            <div className="flex items-start">
              <img
                src="/medication.svg"
                alt="icon of medications"
                height={35}
                width={35}
                className="inline"
              ></img>
              <div className="flex flex-col">
                {plantInfo.disease_log != null &&
                plantInfo.disease_log.length > 0 ? (
                  plantInfo.disease_log.map((diseaseLog) => {
                    return (
                      <div className="ml-2 mb-2">
                        <p className="font-semibold">
                          {diseaseLog?.disease_type}
                        </p>
                        <p className="inline">
                          <span>
                            {
                              numberToMonth[
                                diseaseLog?.startDate
                                  .split("T")[0]
                                  .split("-")[1] as keyof typeof numberToMonth
                              ]
                            }
                          </span>{" "}
                          <span>
                            {diseaseLog?.startDate.split("T")[0].split("-")[2]}
                          </span>{" "}
                          -{" "}
                        </p>
                        {diseaseLog?.endDate ? (
                          <p className="inline">
                            <span>
                              {
                                numberToMonth[
                                  diseaseLog?.endDate
                                    .split("T")[0]
                                    .split("-")[1] as keyof typeof numberToMonth
                                ]
                              }
                            </span>{" "}
                            <span>
                              {diseaseLog?.endDate.split("T")[0].split("-")[2]}
                            </span>
                          </p>
                        ) : (
                          <p className="inline">now</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p>You have not added any plant's health problems yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Plant;
