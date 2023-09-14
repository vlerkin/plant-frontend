import { AuthUser } from "@/interfaces/user_interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import ErrorMessage from "./error";
import {
  DataFromEditProfileForm,
  UserInfo,
  checkEditProfileData,
  checkUserInfo,
} from "@/zod-schemas/userValidation";
import { getUser, updateUserProfile } from "@/lib/userApi";

type ProfileFormProps = {
  authUserState: AuthUser;
  setUserInfo: (data: UserInfo) => void;
};

const ProfileForm = (props: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataFromEditProfileForm>({
    resolver: zodResolver(checkEditProfileData),
  });
  const handleEditProfileSubmit = async (data: DataFromEditProfileForm) => {
    try {
      await updateUserProfile({
        name: data.name,
        email: data.email,
        password: data.password,
        photo: null,
      });

      const response = await getUser();
      const parsedResponse = checkUserInfo.safeParse(response.data);
      if (parsedResponse.success === true) {
        props.setUserInfo(parsedResponse.data);
      } else {
        console.log(parsedResponse.error.flatten());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      className="border-white border-dashed border-[1px] rounded-md p-4 mb-4"
      onSubmit={handleSubmit(handleEditProfileSubmit)}
    >
      <div className="flex flex-col justify-center">
        <label className="font-mono ml-[2px]" htmlFor="name">
          Name
        </label>
        <Input
          className="mb-4 mt-2 font-mono text-black"
          type="text"
          id="name"
          defaultValue={props.authUserState.name}
          {...register("name")}
        />
        {errors.name && <ErrorMessage message={errors.name.message} />}
      </div>

      <div className="flex flex-col justify-center">
        <label className="font-mono ml-[2px]" htmlFor="email">
          Email
        </label>
        <Input
          className="mb-4 mt-2 font-mono text-black"
          type="text"
          id="email"
          defaultValue={props.authUserState.email}
          {...register("email")}
        />
        {errors.email && <ErrorMessage message={errors.email.message} />}
      </div>

      <div className="flex flex-col justify-center text-black">
        <label className="font-mono text-white ml-[2px]" htmlFor="password">
          New password
        </label>
        <Input
          className="mb-4 mt-2 font-mono text-black"
          type="text"
          id="password"
          placeholder="New password"
          {...register("password")}
        />
        {errors.password && <ErrorMessage message={errors.password.message} />}

        <button
          type="submit"
          className=" text-white mt-2 border-[1px] border-white border-solid rounded-md bg-sky-100/20 p-2 hover:bg-[#81A684] active:bg-sky-200/20"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
