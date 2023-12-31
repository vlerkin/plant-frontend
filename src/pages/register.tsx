import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/error";
import NavBar from "@/components/navigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/userApi";
import {
  DataFromRegisterForm,
  checkRegisterFormData,
} from "@/zod-schemas/userValidation";
import BaseLayout from "@/components/baseLayout";

const Register = () => {
  const router = useRouter();
  // using react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromRegisterForm>({
    resolver: zodResolver(checkRegisterFormData),
  });

  const handleFormSubmit = async (data: DataFromRegisterForm) => {
    const name = data.name;
    const email = data.email;
    const password = data.password;
    try {
      await registerUser({
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
    <BaseLayout header="Register">
      <div className="flex justify-center items-center">
        <form
          className="-mt-10 mb-10 backdrop-blur-md bg-gray-900/10 p-6 rounded-md text-white w-4/5 md:-mt-20 lg:-mt-20 md:w-1/3"
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
    </BaseLayout>
  );
};

export default Register;
