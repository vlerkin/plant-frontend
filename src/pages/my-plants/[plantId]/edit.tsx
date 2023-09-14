import ErrorMessage from "@/components/error";
import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthUser } from "@/interfaces/user_interfaces";
import {
  getSpecificPlant,
  updatePlantInfo,
  uploadPlantPhoto,
} from "@/lib/plantApi";
import { getToken } from "@/lib/tokenApi";
import { getAuthUser } from "@/lib/utils";
import {
  DataFromAddPlantForm,
  PlantInfo,
  checkAddPlantFormData,
  checkPlantInfo,
} from "@/zod-schemas/plantValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const EditPlant = () => {
  const router = useRouter();
  const plantId = Number(router.query.plantId);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [authUserState, setAuthUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setUserLoading] = useState<boolean>(true);
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromAddPlantForm>({
    resolver: zodResolver(checkAddPlantFormData),
  });

  if (!plantInfo) {
    return <p>Loading...</p>;
  }

  if (isUserLoading) {
    return <p>Loading...</p>;
  } else if (!authUserState) {
    router.push("/login");
    return;
  }

  const handleFormSubmit = async (data: DataFromAddPlantForm) => {
    try {
      let photoName = null;
      // in case user provided new photo upload it and give the path for rendering
      if (data.photo[0]) {
        const res = await uploadPlantPhoto(data.photo[0]);
        photoName = res.data.filename;
      }
      // if user did not provide a new photo but we have one already in db
      if (plantInfo.info.photo_url != null && !data.photo[0]) {
        photoName = plantInfo.info.photo_url.split("com")[1].slice(1);
      }
      await updatePlantInfo(
        {
          name: data.name,
          photo: photoName,
          howOftenWatering: data.watering,
          waterVolume: data.volume,
          light: data.light,
          location: data.location,
          comment: data.comment === "nothing yet" ? null : data.comment,
          species: data.species === "nothing yet" ? null : data.species,
        },
        plantInfo.info.id
      );

      router.push("/my-plants");
    } catch (error) {
      console.log("Something went wrong!");
    }
  };
  return (
    <main className="bg-[#57886C] min-h-screen">
      <div className="bg-[url('/plant.jpg')] h-44 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono mt-4 font-bold text-xl drop-shadow-2xl text-white md:-mt-8 lg:-mt-8 md:text-4xl lg:text-4xl">
          Edit Plant Info
        </h1>
      </div>
      <div className="flex justify-center max-h-[60%]">
        <form
          encType="multipart/form-data"
          className="-mt-10 mb-10 backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white w-4/5 md:-mt-20 lg:-mt-20 md:w-1/2 lg:1/3"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div>
            <label className="font-mono" htmlFor="name">
              Name
              <span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  className="mb-4 mt-2 font-mono text-black"
                  type="text"
                  id="name"
                  maxLength={100}
                  defaultValue={plantInfo.info.name}
                  {...register("name")}
                />
              )}
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}

            <label className="font-mono" htmlFor="watering">
              Number of days between watering
              <span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="watering"
              render={({ field }) => (
                <Input
                  className="mb-4 mt-2 font-mono text-black"
                  type="number"
                  id="watering"
                  defaultValue={plantInfo.info.howOftenWatering}
                  {...register("watering", { valueAsNumber: true })}
                />
              )}
            />
            {errors.watering && (
              <ErrorMessage message={errors.watering.message} />
            )}

            <label className="font-mono" htmlFor="volume">
              Water volume (in liters)
              <span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="volume"
              render={({ field }) => (
                <Input
                  className="mb-4 mt-2 font-mono text-black"
                  id="volume"
                  defaultValue={plantInfo.info.waterVolume}
                  {...register("volume", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                />
              )}
            />
            {errors.volume && <ErrorMessage message={errors.volume.message} />}

            <label className="font-mono" htmlFor="light">
              Light mode
              <span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="light"
              render={({ field }) => (
                <select
                  className="mb-4 mt-2 font-mono text-black max-sm:w-[100%] flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300"
                  defaultValue={plantInfo.info.light}
                  {...field}
                  {...register("light")}
                >
                  <option className="" value="full sun">
                    Full Sun
                  </option>
                  <option value="partial shadow">Partial Shadow</option>
                  <option value="full shadow">Full Shadow</option>
                </select>
              )}
            />

            {errors.light && <ErrorMessage message={errors.light.message} />}

            <label className="font-mono" htmlFor="location">
              Location
              <span className="text-red-600">*</span>
              <span> (required)</span>
            </label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <select
                  className="mb-4 mt-2 font-mono text-black max-sm:w-[100%] flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300"
                  defaultValue={plantInfo.info.location}
                  {...field}
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
              )}
            />
            {errors.location && (
              <ErrorMessage message={errors.location.message} />
            )}

            <label className="font-mono" htmlFor="species">
              Species
            </label>
            <Controller
              control={control}
              name="species"
              render={({ field }) => (
                <Input
                  className="mb-4 mt-2 font-mono text-black"
                  type="text"
                  id="species"
                  defaultValue={plantInfo.info.species || "nothing yet"}
                  {...register("species", { required: false })}
                />
              )}
            />
            {errors.species && (
              <ErrorMessage message={errors.species.message} />
            )}

            <label className="font-mono" htmlFor="comment">
              Comment
            </label>
            <Controller
              control={control}
              name="comment"
              render={({ field }) => (
                <Input
                  className="mb-4 mt-2 font-mono text-black"
                  type="text"
                  id="comment"
                  defaultValue={plantInfo.info.comment || "nothing yet"}
                  {...register("comment", { required: false })}
                />
              )}
            />
            {errors.comment && (
              <ErrorMessage message={errors.comment.message} />
            )}

            <label className="font-mono" htmlFor="photo">
              Photo
            </label>
            <Controller
              control={control}
              name="photo"
              render={({ field }) => (
                <Input
                  className="mb-4 mt-2 font-mono text-black"
                  type="file"
                  id="photo"
                  {...register("photo", { required: false })}
                />
              )}
            />
            {errors.photo && (
              <ErrorMessage message={errors.photo?.message?.toString()} />
            )}

            <Button className="mt-4 font-mono" type="submit">
              Submit Changes
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};
export default EditPlant;
