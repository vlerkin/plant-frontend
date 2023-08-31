import ErrorMessage from "@/components/error";
import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

enum Light {
  fullSun = "full sun",
  partShad = "partial shadow",
  fullShad = "full shadow",
}

const LightEnum = z.nativeEnum(Light);

enum Location {
  south = "south",
  north = "north",
  east = "east",
  west = "west",
  southEast = "south_east",
  southWest = "south_west",
  nothEast = "north_east",
  northWest = "north_west",
}

const LocationEnum = z.nativeEnum(Location);
/*
interface FormInput {
  name: String;
  watering: Number;
  volume: Number;
  light: Light;
  location: Location | null;
  species: String | null;
  comment: String | null;
  photo: String | null;
}
*/
const checkFormData = z.object({
  name: z.string().max(100),
  watering: z.number().int().gte(0).lte(366),
  volume: z.number().gte(0).lte(1000),
  light: LightEnum,
  location: LocationEnum.nullable(),
  species: z.string().max(100).nullable(),
  comment: z.string().max(500).nullable(),
  photo: z.object({}),
});

type DataFromForm = z.infer<typeof checkFormData>;

const AddPlant = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    // getting token from a local storage
    const token: string | null = localStorage.getItem("token");
    // if there is no token, user will be redirected to /login page and code stops running
    // if there is a token in a local storage, it will be saved into a state
    if (token == null) {
      router.push("/login");
      return;
    } else {
      setToken(token);
    }
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromForm>({
    resolver: zodResolver(checkFormData),
  });
  const handleFormSubmit = async (data: DataFromForm) => {
    console.log(data.light);
    try {
      await axios.post(
        "http://localhost:8000/my-plants",
        {
          name: data.name,
          photo: data.photo,
          howOftenWatering: data.watering,
          waterVolume: data.volume,
          light: data.light,
          location: data.location,
          comment: data.comment,
          species: data.species,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/my-plants");
    } catch (error) {
      console.log("Something went wrong!");
    }
  };

  return (
    <main className="bg-[#57886C] bg-repeat-y min-h-screen">
      <div className="bg-[url('/plant.jpg')] h-80 bg-center bg-no-repeat bg-cover md:h-80 max-sm:h-[40%] flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono font-bold text-4xl drop-shadow-2xl text-white -mt-8 max-sm:text-2xl">
          Add New Plant
        </h1>
      </div>
      <div className="flex justify-center items-center max-h-[60%]">
        <form
          className="w-2/3 -mt-20 mb-8 backdrop-blur-md h-full bg-gray-900/10 p-6 rounded-md text-white lg:max-w-lg md:max-w-md sm:max-w-sm"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div>
            <label className="font-mono" htmlFor="name">
              Give your plant a name
              <span className="text-red-600">*</span>
              <span> (required)</span>
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="text"
              id="name"
              placeholder="Plant name"
              maxLength={100}
              {...register("name")}
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}

            <label className="font-mono" htmlFor="watering">
              How often do you water your plant? (once in X days)
              <span className="text-red-600">*</span>
              <span> (required)</span>
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="number"
              id="watering"
              placeholder="Number of days"
              {...register("watering", { valueAsNumber: true })}
            />
            {errors.watering && (
              <ErrorMessage message={errors.watering.message} />
            )}

            <label className="font-mono" htmlFor="volume">
              How much water do you use when watering? (in liters)
              <span className="text-red-600">*</span>
              <span> (required)</span>
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              id="volume"
              placeholder="Water volume, e.g. 0.4"
              {...register("volume", { valueAsNumber: true })}
              type="number"
              step="0.01"
            />
            {errors.volume && <ErrorMessage message={errors.volume.message} />}

            <label className="font-mono" htmlFor="light">
              How much light does your plant gets?
              <span className="text-red-600">*</span>
              <span> (required)</span>
            </label>
            <select
              className="w-80 mb-4 mt-2 font-mono text-black max-sm:w-[100%] flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300"
              placeholder="Select amount of light"
              {...register("light")}
            >
              <option className="" value="full sun">
                Full Sun
              </option>
              <option value="partial shadow">Partial Shadow</option>
              <option value="full shadow">Full Shadow</option>
            </select>
            {errors.light && <ErrorMessage message={errors.light.message} />}

            <label className="font-mono" htmlFor="location">
              Where is your plant located?
              <span className="text-red-600">*</span>
              <span> (required)</span>
            </label>
            <select
              className="w-80 mb-4 mt-2 font-mono text-black max-sm:w-[100%] flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300"
              placeholder="Select compass direction"
              {...register("location", { required: false })}
            >
              <option value="south">South</option>
              <option value="north">North</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="south_east">South-East</option>
              <option value="south_west">South-West</option>
              <option value="north_east">North-East</option>
              <option value="north_west">North-West</option>
            </select>
            {errors.location && (
              <ErrorMessage message={errors.location.message} />
            )}

            <label className="font-mono" htmlFor="species">
              What is the species of your plant?
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="text"
              id="species"
              placeholder="Species, e.g. Aloe Vera"
              {...register("species", { required: false })}
            />
            {errors.species && (
              <ErrorMessage message={errors.species.message} />
            )}

            <label className="font-mono" htmlFor="comment">
              Add a comment to your plant
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="text"
              id="comment"
              placeholder="Comment"
              {...register("comment", { required: false })}
            />
            {errors.comment && (
              <ErrorMessage message={errors.comment.message} />
            )}

            <label className="font-mono" htmlFor="photo">
              Upload a photo of your plant
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="file"
              id="photo"
              {...register("photo", { required: false })}
            />
            {errors.photo && <ErrorMessage message={errors.photo.message} />}

            <Button className="mt-4 font-mono" type="submit">
              Add Plant
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddPlant;
