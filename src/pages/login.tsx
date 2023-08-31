import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/error";
import { useForm } from "react-hook-form";
import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const checkFormData = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});
type DataFromForm = z.infer<typeof checkFormData>;

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromForm>({
    resolver: zodResolver(checkFormData),
  });
  const handleFormSubmit = async (data: DataFromForm) => {
    const email = data.email;
    const password = data.password;

    const response = await axios.post("http://localhost:8000/login", {
      email: email,
      password: password,
    });
    // save token and user id to a local storage
    localStorage.setItem("token", response.data.access_token);

    router.push("/");
  };

  return (
    <main className="bg-[#57886C] h-screen">
      <div className="bg-[url('/plant.jpg')] h-80 bg-center bg-no-repeat bg-cover md:h-80 max-sm:h-[40%] flex items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono font-bold text-4xl drop-shadow-2xl text-white -mt-8 max-sm:text-2xl">
          Login
        </h1>
      </div>
      <div className="flex justify-center items-center">
        <form
          className="w-1/3 -mt-20 backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white max-sm:w-4/5"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div>
            <label className="font-mono" htmlFor="email">
              Email address
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="email"
              placeholder="Email address"
              id="username"
              {...register("email")}
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}

            <label className="font-mono" htmlFor="password">
              Password
            </label>
            <Input
              className="mb-4 mt-2 font-mono text-black"
              type="password"
              placeholder="Password"
              id="password"
              {...register("password")}
            />
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}
          </div>
          <Button className="" type="submit">
            Log in
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Login;
