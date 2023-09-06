import ErrorMessage from "@/components/error";
import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LightEnum,
  LocationEnum,
  UploadResults,
} from "@/interfaces/plant_interfaces";
import { AuthUser } from "@/interfaces/user_interfaces";
import { getAuthUser } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const checkFormData = z.object({
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

type DataFromForm = z.infer<typeof checkFormData>;

const AddPlant = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [authUserState, setAuthUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    if (token == null) {
      router.push("/login");
      return;
    } else {
      setToken(token);
    }

    const authenticateUser = async () => {
      const authUser = await getAuthUser();
      setAuthUser(authUser);
      setUserLoading(false);
    };
    authenticateUser();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromForm>({
    resolver: zodResolver(checkFormData),
  });

  if (isUserLoading) {
    return <p>Loading...</p>;
  } else if (!authUserState) {
    router.push("/login");
    return;
  }

  const handleFormSubmit = async (data: DataFromForm) => {
    try {
      let photoName = null;
      if (data.photo[0]) {
        const res = await axios.post(
          "http://localhost:8000/upload/plant",
          {
            file: data.photo[0],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        photoName = res.data.filename;
      }

      await axios.post(
        "http://localhost:8000/my-plants",
        {
          name: data.name,
          photo: photoName,
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
      <div className="bg-[url('/plant.jpg')] h-32 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono -mb-4 font-bold text-xl drop-shadow-2xl text-white -mt-2 md:-mt-8 lg:-mt-8 md:text-4xl lg:text-4xl">
          Add New Plant
        </h1>
      </div>
      <div className="flex justify-center items-center max-h-[60%]">
        <form
          encType="multipart/form-data"
          className="-mt-10 mb-10 backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white w-4/5 md:-mt-20 lg:-mt-20 md:w-1/2 lg:1/3"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div>
            <label className="font-mono" htmlFor="name">
              Give your plant a name
              <span className="text-red-600">*</span>
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
            {errors.photo && (
              <ErrorMessage message={errors.photo?.message?.toString()} />
            )}

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
