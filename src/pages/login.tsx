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
import BaseLayout from "@/components/baseLayout";

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
    <BaseLayout header="Login">
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
    </BaseLayout>
  );
};

export default Login;
