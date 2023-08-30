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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const checkFormData = z.object({
  name: z.string().max(100),
  watering: z.number().int().gte(0).lte(366),
  volume: z.number().gte(0).lte(1000),
  light: z.union([
    z.literal("full sun"),
    z.literal("partial shadow"),
    z.literal("full shadow"),
  ]),
  location: z.union([
    z.literal("south"),
    z.literal("north"),
    z.literal("east"),
    z.literal("west"),
    z.literal("south_east"),
    z.literal("south_west"),
    z.literal("north_east"),
    z.literal("north_west"),
  ]),
  species: z.string().max(100),
  comment: z.string().max(500),
  photo: z.string(),
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
  const handleFormSubmit = async () => {};

  const handleSubmitClick = () => {};

  return (
    <main className="bg-[#57886C] bg-repeat-y h-screen">
      <div className="bg-[url('/plant.jpg')] h-80 bg-center bg-no-repeat bg-cover md:h-80 max-sm:h-[40%] flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono font-bold text-4xl drop-shadow-2xl text-white -mt-8 max-sm:text-xl">
          Add New Plant
        </h1>
      </div>
      <div className="flex justify-center items-center">
        <form
          className="w-2/3 -mt-20 backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white max-sm:w-4/5"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div>
            <label className="font-mono" htmlFor="name">
              What is the name of the plant?
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="text"
              id="name"
              placeholder="Plant name"
              {...register("name")}
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}

            <label className="font-mono" htmlFor="watering">
              How often do you water your plant? (once in X days)
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="number"
              id="watering"
              placeholder="Number of days"
              {...register("watering")}
            />
            {errors.watering && (
              <ErrorMessage message={errors.watering.message} />
            )}

            <label className="font-mono" htmlFor="volume">
              How much water do you use when watering? (in liters)
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              id="volume"
              placeholder="Water volume, e.g. 0.4"
              {...register("volume")}
              type="number"
              step="0.01"
            />
            {errors.volume && <ErrorMessage message={errors.volume.message} />}

            <label className="font-mono" htmlFor="light">
              How much light does your plant gets?
            </label>
            <Select {...register("light")}>
              <SelectTrigger className="w-80 mb-4 mt-2 font-mono text-black max-sm:w-[100%]">
                <SelectValue
                  className="text-black"
                  placeholder="Select amount of light"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-black">
                    Amount of light
                  </SelectLabel>
                  <SelectItem value="full sun">Full Sun</SelectItem>
                  <SelectItem value="partial shadow">Partial Shadow</SelectItem>
                  <SelectItem value="full shadow">Full Shadow</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.light && <ErrorMessage message={errors.light.message} />}

            <label className="font-mono" htmlFor="location">
              Where is your plant located?
            </label>
            <Select {...register("location")}>
              <SelectTrigger className="w-80 mb-4 mt-2 font-mono text-black max-sm:w-[100%]">
                <SelectValue
                  className="text-black"
                  placeholder="Select compass direction"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-black">
                    Compass direction
                  </SelectLabel>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="south_east">South-East</SelectItem>
                  <SelectItem value="south_west">South-West</SelectItem>
                  <SelectItem value="north_east">North-East</SelectItem>
                  <SelectItem value="north_west">North-West</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
              {...register("species")}
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
              {...register("comment")}
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
              {...register("photo")}
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
