import ErrorMessage from "@/components/error";
import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthUser } from "@/interfaces/user_interfaces";
import { logNewFertilising } from "@/lib/plantApi";
import { getToken } from "@/lib/tokenApi";
import { getAuthUser } from "@/lib/utils";
import {
  DataFromFertiliserForm,
  checkFertiliserForm,
} from "@/zod-schemas/plantValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const FertilizePlant = () => {
  const router = useRouter();
  const plantId = Number(router.query.plantId);
  const [authUserState, setAuthUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setUserLoading] = useState<boolean>(true);
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
  }, [plantId]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromFertiliserForm>({
    resolver: zodResolver(checkFertiliserForm),
  });
  if (isUserLoading) {
    return <p>Loading...</p>;
  } else if (!authUserState) {
    router.push("/login");
    return;
  }
  if (plantId === undefined || isNaN(plantId)) {
    return;
  }

  const handleFormSubmit = async (data: DataFromFertiliserForm) => {
    await logNewFertilising(
      { type: data.type, quantity: data.quantity },
      plantId
    );
    router.push(`/my-plants/${plantId}`);
  };
  return (
    <main className="bg-[#57886C] min-h-screen">
      <div className="bg-[url('/plant.jpg')] h-44 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono mt-4 font-bold text-xl drop-shadow-2xl text-white md:-mt-8 lg:-mt-8 md:text-4xl lg:text-4xl">
          Log Fertilising
        </h1>
      </div>
      <div className="flex justify-center items-center max-h-[60%]">
        <form
          className="-mt-10 mb-10 backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white w-4/5 md:-mt-20 lg:-mt-20 md:w-1/2 lg:1/3"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div>
            <label className="font-mono" htmlFor="type">
              What kind of fertiliser you added?
              <span className="text-red-600">*</span>
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="text"
              id="type"
              placeholder="Fertiliser type"
              maxLength={300}
              {...register("type")}
            />
            {errors.type && <ErrorMessage message={errors.type.message} />}

            <label className="font-mono" htmlFor="quantity">
              How many grams of fertiliser you used?
              <span className="text-red-600">*</span>
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="number"
              id="quantity"
              placeholder="Quantity in grams"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <ErrorMessage message={errors.quantity.message} />
            )}

            <Button className="mt-4 font-mono" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default FertilizePlant;
