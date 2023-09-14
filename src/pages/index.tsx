import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col justify-start items-center bg-[url('/plant.jpg')] min-h-screen bg-center bg-no-repeat bg-cover md:justify-start lg:justify-start md:items-start lg:items-start">
      <NavBar />
      <div className="flex flex-col z-50 h-60 justify-center items-center py-4 w-5/6 mt-20 mb-10 font-mono backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white md:w-1/5 md:h-64 lg:h-64 md:ml-32 lg:ml-32 md:mt-32 md:hidden">
        <p className="text-lg">
          <span className="text-xl font-bold">PlantieCare</span> - online app to{" "}
          <span className="font-bold">help you track care</span> of your plants,
          <span className="font-bold"> even</span> when you are{" "}
          <span className="font-bold"> travelling</span>.
        </p>
        <div className="flex justify-start w-full mt-4">
          <Button
            className="text-sm md:text-base"
            onClick={() => router.push("/register")}
          >
            Get Started
          </Button>
        </div>
      </div>
      <div className="hidden h-3/4 py-4 w-5/6 mt-32 mx-auto mb-10 font-mono backdrop-blur-md bg-gray-900/10 p-6 rounded-xl text-white md:flex md:justify-between">
        <div className="flex flex-col z-50 justify-center items-center py-4 w-2/5 font-mono p-6 rounded-md text-white">
          <p className="text-lg">
            <span className="text-xl font-bold">PlantieCare</span> - online app
            to <span className="font-bold">help you track care</span> of your
            plants,
            <span className="font-bold"> even</span> when you are{" "}
            <span className="font-bold"> travelling</span>.
          </p>
          <div className="flex justify-start w-full mt-4">
            <Button
              className="text-sm md:text-base"
              onClick={() => router.push("/register")}
            >
              Get Started
            </Button>
          </div>
        </div>
        <div className="flex items-center">
          <img
            src="/iphone_plant.png"
            alt="image of a plant page on iphone"
            className="w-[128px] h-[240px] z-50 -mr-28 -mb-14"
          />
          <img
            src="/macbook_plant.png"
            alt="image of a plant page on iphone"
            className="w-[500px] h-[500px]"
          />
        </div>
      </div>
    </main>
  );
}
