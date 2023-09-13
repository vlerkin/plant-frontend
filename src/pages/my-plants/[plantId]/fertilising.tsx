import ErrorMessage from "@/components/error";
import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logNewFertilising } from "@/lib/plantApi";
import {
  DataFromFertiliserForm,
  checkFertiliserForm,
} from "@/zod-schemas/plantValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

const FertilizePlant = () => {
  const router = useRouter();
  const plantId = Number(router.query.plantId);
  if (plantId === undefined || isNaN(plantId)) {
    return;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromFertiliserForm>({
    resolver: zodResolver(checkFertiliserForm),
  });
  const handleFormSubmit = async (data: DataFromFertiliserForm) => {
    await logNewFertilising(
      { type: data.type, quantity: data.quantity },
      plantId
    );
    router.push("/my-plants");
  };
  return (
    <main className="bg-[#57886C] min-h-screen">
      <div className="bg-[url('/plant.jpg')] h-32 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono -mb-4 font-bold text-xl drop-shadow-2xl text-white -mt-2 md:-mt-8 lg:-mt-8 md:text-4xl lg:text-4xl">
          Log Fertilising
        </h1>
      </div>
      <div className="flex justify-center items-center max-h-[60%]">
        <form
          encType="multipart/form-data"
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
