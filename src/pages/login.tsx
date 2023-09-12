import React from "react";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/error";
import { useForm } from "react-hook-form";
import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/userApi";
import {
  DataFromLoginForm,
  checkLoginFormData,
} from "@/zod-schemas/userValidation";

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromLoginForm>({
    resolver: zodResolver(checkLoginFormData),
  });
  const handleFormSubmit = async (data: DataFromLoginForm) => {
    const email = data.email;
    const password = data.password;

    const response = await loginUser({
      email: email,
      password: password,
    });
    localStorage.setItem("token", response.data.access_token);

    router.push("/my-plants");
  };

  return (
    <main className="bg-[#57886C] h-screen">
      <div className="bg-[url('/plant.jpg')] h-32 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono -mb-4 font-bold text-xl drop-shadow-2xl text-white -mt-2 md:-mt-8 lg:-mt-8 md:text-4xl lg:text-4xl">
          Login
        </h1>
      </div>
      <div className="flex justify-center items-center">
        <form
          className="-mt-10 mb-10 backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white w-4/5 md:-mt-20 lg:-mt-20 md:w-1/3"
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
