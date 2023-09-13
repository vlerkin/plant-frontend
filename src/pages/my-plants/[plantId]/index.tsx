import NavBar from "@/components/navigationBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AuthUser } from "@/interfaces/user_interfaces";
import { getAuthUser, numberToMonth } from "@/lib/utils";
import { PlantInfo, checkPlantInfo } from "@/zod-schemas/plantValidation";
import {
  deleteSpecificPlant,
  getSpecificPlant,
  waterPlant,
} from "@/lib/plantApi";
import { getToken } from "@/lib/tokenApi";

const Plant = () => {
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const router = useRouter();
  const plantId = Number(router.query.plantId);
  const [authUserState, setAuthUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setUserLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    if (plantId === undefined || isNaN(plantId)) {
      return;
    }

    const token = getToken();
    if (token === undefined || null) {
      router.push("/login");
      return;
    }

    const authenticateUser = async () => {
      const authUser = await getAuthUser();
      setAuthUser(authUser);
      setUserLoading(false);
    };
    authenticateUser();

    const getPlantInfoFromApi = async () => {
      const response = await getSpecificPlant(plantId);
      const parsedResponse = checkPlantInfo.safeParse(response.data);
      if (parsedResponse.success === true) {
        setPlantInfo(parsedResponse.data);
      } else {
        console.log(parsedResponse.error.flatten());
      }
    };
    getPlantInfoFromApi();
  }, [plantId]);

  if (!plantInfo) {
    return <p>Loading...</p>;
  }

  if (isUserLoading) {
    return <p>Loading...</p>;
  } else if (!authUserState) {
    router.push("/login");
    return;
  }

  const handleWateringClick = async () => {
    try {
      await waterPlant(plantId);
      toast({
        title: "Success!",
        description: "Plant watered",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deleteSpecificPlant(plantId);
      router.push("/my-plants");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogFertilizinfClick = () => {
    router.push(`/my-plants/${plantId}/fertilising`);
  };

  return (
    <main className="bg-[#57886C] bg-repeat-y min-h-screen flex justify-center items-start font-mono">
      <NavBar />
      <Toaster />
      <div className="backdrop-blur-md bg-gray-900/10 rounded-md w-full text-white my-20 mx-4 md:w-2/5 lg:w-2/5">
        <div className="md:flex md:flex-row md:items-center md:justify-around">
          {plantInfo.info.photo_url ? (
            <div
              className="bg-center bg-no-repeat rounded-t-md bg-cover w-full h-48 md:rounded-full md:w-44 md:h-44 md:m-6 lg:rounded-full lg:w-44 lg:h-44 lg:m-6"
              style={{ backgroundImage: `url(${plantInfo.info.photo_url})` }}
            ></div>
          ) : (
            <div className="bg-[url('/template.jpg')] bg-center bg-no-repeat rounded-t-md bg-cover w-full h-48 md:rounded-full md:w-44 md:h-44 md:m-6 lg:rounded-full lg:w-44 lg:h-44 lg:m-6"></div>
          )}
          <div className="flex flex-col m-4 md:inline">
            <div className="flex flex-col justify-center mb-2">
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
              <div
                className="flex items-center"
                key={plantInfo.watering_log?.id}
              >
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
                  <p className="ml-2">You have not fertilised the plant yet</p>
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
                  <p className="ml-[12px]">
                    You have not added any plant's health problems yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-center border-solid border-b-[1px] border-white mx-4 pb-2">
          Available actions
        </p>
        <div className="grid grid-cols-6 gap-2 mb-6 mt-2">
          <button
            onClick={() => handleWateringClick()}
            className="col-span-6 mx-4 mt-2 font-mono border-solid border-[1px] border-white rounded-md p-2 bg-sky-100/20 hover:bg-[#81A684] md:py-2 lg:py-2 md:border-white md:text-white lg:border-white lg:text-white md:px-4 lg:px-4 lg:col-span-2"
          >
            <img
              src="/watercan.svg"
              alt="icon of watering can"
              className="inline w-8 h-8 md:hidden lg:hidden"
            ></img>
            <p className="ml-2 inline text-sm">Water Plant</p>
          </button>
          <button
            onClick={handleLogFertilizinfClick}
            className="col-span-6 mx-4 mt-2 font-mono border-solid border-[1px] border-white rounded-md p-2 bg-sky-100/20 hover:bg-[#81A684] md:py-2 lg:py-2 md:border-white md:text-white lg:border-white lg:text-white md:px-4 lg:px-4 lg:col-span-2"
          >
            <img
              src="/fertiliser.svg"
              alt="icon of fertiliser"
              className="inline w-8 h-8 md:hidden lg:hidden"
            ></img>
            <p className="ml-2 inline text-sm">Add Fertiliser</p>
          </button>
          <button
            onClick={() => handleWateringClick()}
            className="col-span-6 mx-4 mt-2 font-mono border-solid border-[1px] border-white rounded-md p-2 bg-sky-100/20 hover:bg-[#81A684] md:py-2 lg:py-2 md:border-white md:text-white lg:border-white lg:text-white md:px-4 lg:px-4 lg:col-span-2"
          >
            <img
              src="/medication.svg"
              alt="icon of medications"
              className="inline w-8 h-8 md:hidden lg:hidden"
            ></img>
            <p className="ml-2 inline text-sm">Log Disease</p>
          </button>
          <button
            onClick={() => router.push(`/my-plants/${plantId}/edit`)}
            className="col-span-6 mx-4 mt-2 font-mono border-solid border-[1px] border-yellow-300 rounded-md p-2 bg-yellow-100/20 hover:bg-yellow-400 md:py-2 lg:py-2  md:text-white  lg:text-white md:px-4 lg:px-4 lg:col-span-3"
          >
            <img
              src="/edit.svg"
              alt="icon of paper and pen"
              className="inline w-8 h-8 md:hidden lg:hidden"
            ></img>
            <p className="ml-2 inline text-sm">Edit Plant</p>
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="col-span-6 mx-4 mt-2 font-mono border-solid border-[1px] border-red-600 rounded-md p-2 bg-red-100/20 hover:bg-red-400 md:py-2 lg:py-2  md:text-white  lg:text-white md:px-4 lg:px-4 lg:col-span-3">
                <img
                  src="/delete.svg"
                  alt="icon of garbage bin"
                  className="inline w-8 h-8 md:hidden lg:hidden"
                ></img>
                <p className="ml-2 inline text-sm">Delete Plant</p>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your plant's data from our servers. Delete plant with name{" "}
                  {plantInfo.info.name}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteClick()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </main>
  );
};

export default Plant;
