import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import ErrorMessage from "@/components/error";
import { cn, getAuthUser } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DataFromPlantDiseaseForm,
  DiseaseInfo,
  checkDiseaseInfo,
  checkPlantDiseaseForm,
} from "@/zod-schemas/plantValidation";
import { useRouter } from "next/router";
import { getToken } from "@/lib/tokenApi";
import { AuthUser } from "@/interfaces/user_interfaces";
import { createDiseaseLog, getDiseaseInfo } from "@/lib/plantApi";

const LogPlantDisease = () => {
  const [date, setDate] = useState<Date>();
  const [authUserState, setAuthUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setUserLoading] = useState<boolean>(true);
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null);
  const router = useRouter();
  const plantId = Number(router.query.plantId);
  useEffect(() => {
    const tokenFromLC = getToken();
    if (tokenFromLC === undefined || null) {
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
    if (plantId === undefined || isNaN(plantId)) {
      console.log("NO PlantId");
      return;
    }
    const getDiseaseInfoFromApi = async () => {
      const response = await getDiseaseInfo();
      const parsedResponse = checkDiseaseInfo.safeParse(response.data);
      if (parsedResponse.success === true) {
        setDiseaseInfo(parsedResponse.data);
      } else {
        console.log(parsedResponse.error.flatten());
      }
    };
    getDiseaseInfoFromApi();
  }, [plantId]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromPlantDiseaseForm>({
    resolver: zodResolver(checkPlantDiseaseForm),
  });

  if (isUserLoading) {
    return <p>Loading...</p>;
  } else if (!authUserState) {
    router.push("/login");
    return;
  }

  if (!diseaseInfo) {
    return <p>Loading...</p>;
  }

  const handleFormSubmit = async (data: DataFromPlantDiseaseForm) => {
    console.log("SUBMIT CALLED");
    let diseaseId = null;
    for (let object of diseaseInfo) {
      if (object.type === data.diseaseType) {
        diseaseId = object.id;
      }
    }
    if (diseaseId && date && date <= new Date()) {
      try {
        await createDiseaseLog(
          {
            diseaseId: diseaseId,
            startDate: date,
            treatment: data.treatment,
          },
          plantId
        );
        router.push(`/my-plants/${plantId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <main className="bg-[#57886C] bg-repeat-y min-h-screen">
      <div className="bg-[url('/plant.jpg')] h-44 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono mt-4 font-bold text-xl drop-shadow-2xl text-white md:-mt-8 lg:-mt-8 md:text-4xl lg:text-4xl">
          Log Plant Disease
        </h1>
      </div>
      <div className="flex justify-center items-center max-h-[60%]">
        <form
          encType="multipart/form-data"
          className="-mt-10 mb-10 backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white w-4/5 md:-mt-20 lg:-mt-20 md:w-1/3 lg:1/3"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="text-black font-mono">
            <label className="block mb-2 mt-2 text-white" htmlFor="diseaseType">
              Choose type of disease
              <span className="text-red-600">*</span>
            </label>
            <select
              className="mb-4 mt-2 text-black max-sm:w-[100%] flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300"
              placeholder="Select compass direction"
              {...register("diseaseType", { required: false })}
            >
              <option value="Rotten root">Rotten root</option>
              <option value="Fungal leaf spots">Fungal leaf spots</option>
              <option value="Bacterial leaf spots">Bacterial leaf spots</option>
              <option value="Black sooty mold">Black sooty mold</option>
              <option value="Powdery mildew">Powdery mildew</option>
              <option value="Gray mold/ Botrytis blight">
                Gray mold/ Botrytis blight
              </option>
              <option value="White mold">White mold</option>
              <option value="Anthracnose">Anthracnose</option>
              <option value="Viral disease">Viral disease</option>
            </select>
            {errors.diseaseType && (
              <ErrorMessage message={errors.diseaseType.message} />
            )}

            <label className="block mt-2 text-white">
              Pick a date when disease started
              <span className="text-red-600">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal min-w-full md:max-w-96 lg:max-w-96 mb-4 mt-2",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 " />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span className="">Pick a date</span>
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
            {date === undefined && (
              <p className="text-sm text-white -mt-4">Date field is required</p>
            )}
            {date !== undefined && date > new Date() && (
              <p className="text-sm text-red-500 font-bold -mt-2 bg-white p-2 rounded-md border-[1px] border-dashed border-red-500">
                Start date cannot be in the future, please don't mess with the
                spacetime of the universe
              </p>
            )}

            <label className="block mb-2 mt-2 text-white" htmlFor="treatment">
              Describe treatment you used
            </label>
            <Input
              className="mb-4 mt-2 text-black"
              type="text"
              id="treatment"
              placeholder="Treatment and medications"
              maxLength={100}
              {...register("treatment")}
            />
            {errors.treatment && (
              <ErrorMessage message={errors.treatment.message} />
            )}

            <Button className="mt-4" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LogPlantDisease;
