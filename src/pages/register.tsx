import { useRouter } from "next/router";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/error";
import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const checkFormData = z.object({
  name: z.string().max(100),
  email: z.string().email(),
  password: z.string().min(10),
});

type DataFromForm = z.infer<typeof checkFormData>;

const Register = () => {
  const router = useRouter();
  // using react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromForm>({
    resolver: zodResolver(checkFormData),
  });

  const handleFormSubmit = async (data: DataFromForm) => {
    const name = data.name;
    const email = data.email;
    const password = data.password;
    try {
      await axios.post(`http://localhost:8000/register`, {
        name: name,
        email: email,
        password: password,
      });
      // after successful registration push user to login page
      router.push("/login");
    } catch (error) {
      console.log("Something went wrong!");
    }
  };

  return (
    <main className="bg-[#57886C] h-screen">
      <div className="bg-[url('/plant.jpg')] h-80 bg-center bg-no-repeat bg-cover md:h-80 max-sm:h-[40%] flex items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono font-bold text-4xl drop-shadow-2xl text-white -mt-8 max-sm:text-xl">
          Register
        </h1>
      </div>
      <div className="flex justify-center items-center">
        <form
          className="w-1/3 -mt-20 backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white max-sm:w-4/5"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div>
            <label className="font-mono" htmlFor="name">
              Name
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="text"
              id="name"
              placeholder="Name"
              {...register("name")}
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}

            <label className="font-mono" htmlFor="email">
              Email address
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="email"
              id="email"
              placeholder="Email address"
              {...register("email")}
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}

            <label className="font-mono" htmlFor="password">
              Password
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              id="password"
              placeholder="Password"
              {...register("password")}
              type="text"
            />
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}

            <Button className="mt-4 font-mono" type="submit">
              Register
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;
