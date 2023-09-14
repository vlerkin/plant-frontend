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
import { cn, dateFormat, getAuthUser, numberToMonth } from "@/lib/utils";
import { PlantInfo, checkPlantInfo } from "@/zod-schemas/plantValidation";
import {
  deleteSpecificPlant,
  getSpecificPlant,
  updateDiseaseEndDate,
  waterPlant,
} from "@/lib/plantApi";
import { getToken } from "@/lib/tokenApi";
import { CalendarIcon, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import LoadingAnimation from "@/components/loadingAnimation";

const Plant = () => {
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [date, setDate] = useState<Date>();
  const [plantDiseaseLogId, setPlantDiseaseLogId] = useState<number>();
  const [authUserState, setAuthUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setUserLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>();
  const { toast } = useToast();
  const router = useRouter();
  const plantId = Number(router.query.plantId);

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
    return <LoadingAnimation />;
  }

  if (isUserLoading) {
    return <LoadingAnimation />;
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

  const handleEndDateSubmit = async () => {
    if (
      date !== undefined &&
      plantDiseaseLogId !== undefined &&
      startDate !== undefined &&
      Date.parse(date.toDateString()) > Date.parse(startDate)
    ) {
      try {
        await updateDiseaseEndDate(
          {
            end_date: date,
            plant_disease_id: plantDiseaseLogId,
          },
          plantId
        );
        toast({
          title: "Success!",
          description: "End date updated",
        });
        const response = await getSpecificPlant(plantId);
        const parsedResponse = checkPlantInfo.safeParse(response.data);
        if (parsedResponse.success === true) {
          setPlantInfo(parsedResponse.data);
        } else {
          console.log(parsedResponse.error.flatten());
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast({
        title: "Sorry",
        description:
          "Something is wrong, please check your input and try again",
      });
    }
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
        <p className="text-sm text-center border-solid border-b-[1px] border-white mx-4 pb-2 md:text-base lg:text-base">
          Last actions
        </p>
        <div className="md:flex lg:flex">
          <div className="ml-0 md:min-w-[45%] lg:min-w-[45%] md:ml-2 lg:ml-2">
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
                  <p className="px-2">
                    {dateFormat(plantInfo.watering_log.dateTime)}
                  </p>
                ) : (
                  <p className="ml-4">You have not watered the plant yet</p>
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
                    <p className="ml-[4px]">
                      {plantInfo.fertilizing_log.quantity}g of{" "}
                      {plantInfo.fertilizing_log.type}
                    </p>
                    <p className="ml-[4px]">
                      {dateFormat(plantInfo.fertilizing_log.dateTime)}
                    </p>
                  </div>
                ) : (
                  <p className="ml-[11px]">
                    You have not fertilised the plant yet
                  </p>
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
                      <div className="ml-2 mb-2 flex justify-between relative min-w-[45%] md:mr-4">
                        <div className="ml-2">
                          <p className="font-semibold">
                            {diseaseLog?.disease_type}
                          </p>
                          <p className="inline">
                            {dateFormat(diseaseLog?.startDate as string)} -
                          </p>
                          {diseaseLog?.endDate ? (
                            <p className="inline">
                              {" "}
                              {dateFormat(diseaseLog?.endDate)}
                            </p>
                          ) : (
                            <div className="inline">
                              <p className="inline"> now</p>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button>
                                    <Pencil className="inline ml-4 h-[20px] w-[20px] absolute top-2 -right-6" />
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[300px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Log Disease End Date
                                    </DialogTitle>
                                    <DialogDescription>
                                      If disease is over, log an end date here.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {date !== undefined &&
                                    diseaseLog?.startDate !== undefined &&
                                    Date.parse(date.toDateString()) <=
                                      Date.parse(diseaseLog?.startDate) && (
                                      <p className="text-sm text-red-600 text-center font-bold -mt-2 p-2 rounded-md border-[1px] border-dashed border-red-600">
                                        End date cannot be earlier than start
                                        date, please don't mess with the
                                        spacetime of the universe
                                      </p>
                                    )}
                                  <div className="grid gap-4 py-4">
                                    <div className="flex items-center justify-center gap-4">
                                      <form
                                        encType="multipart/form-data"
                                        onSubmit={handleEndDateSubmit}
                                      >
                                        <Label
                                          htmlFor="photo"
                                          className="ml-[1px]"
                                        >
                                          Pick end date
                                        </Label>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button
                                              variant={"outline"}
                                              className={cn(
                                                "justify-start text-left font-normal min-w-full md:max-w-96 lg:max-w-96",
                                                !date && "text-muted-foreground"
                                              )}
                                            >
                                              <CalendarIcon className="mr-2 h-4 w-4 " />
                                              {date ? (
                                                format(date, "PPP")
                                              ) : (
                                                <span className="">
                                                  Pick a date
                                                </span>
                                              )}
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0">
                                            <Calendar
                                              mode="single"
                                              selected={date}
                                              onSelect={setDate}
                                              initialFocus
                                            />
                                          </PopoverContent>
                                        </Popover>
                                        <DialogFooter>
                                          <Button
                                            className="mt-4"
                                            type="submit"
                                            onClick={() => {
                                              setPlantDiseaseLogId(
                                                diseaseLog?.id
                                              );
                                              setStartDate(
                                                diseaseLog?.startDate
                                              );
                                            }}
                                          >
                                            Log End Date
                                          </Button>
                                        </DialogFooter>
                                      </form>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="ml-4">
                    You have not added any plant's health problems yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-center border-solid border-b-[1px] border-white mx-4 pb-2 md:text-base lg:text-base">
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
            onClick={() => router.push(`/my-plants/${plantId}/disease`)}
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
