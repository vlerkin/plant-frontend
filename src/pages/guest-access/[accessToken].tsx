import axios from "axios";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/router";
import { z } from "zod";

const checkUserInfo = z.object({
  name: z.string(),
  email: z.string().email(),
  photo: z.string().nullable(),
});
type UserInfo = z.infer<typeof checkUserInfo>;

const GuestAuth = () => {
  const router = useRouter();
  const [isGuesToken, setGuestToken] = useState<boolean>(false);
  const [loggedUser, setLoggedUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    const accessToken = router.query.accessToken;
    if (!accessToken) {
      return;
    }
    console.log(accessToken);
    console.log(router.query.accessToken);
    const tokenFromLocalStorage: string | null | undefined =
      localStorage.getItem("token");
    if (
      (tokenFromLocalStorage == null || tokenFromLocalStorage == undefined) &&
      accessToken != undefined
    ) {
      try {
        const validateToken = async () => {
          const response = await axios.get(
            `http://localhost:8000/access-tokens/authorize/${accessToken}`
          );
          localStorage.setItem("token", response.data.guest_token);
        };
        validateToken();
        router.push("/my-plants");
      } catch (error) {
        console.log(error);
      }
    } else if (
      tokenFromLocalStorage != null &&
      tokenFromLocalStorage != undefined
    ) {
      try {
        const getUserFromApi = async (token: string) => {
          const response = await axios.get("http://localhost:8000/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const parsedResponse = checkUserInfo.safeParse(response.data);
          if (parsedResponse.success === true) {
            setLoggedUser(parsedResponse.data);
          } else {
            console.log(parsedResponse.error.flatten());
          }
        };
        getUserFromApi(tokenFromLocalStorage);
        setGuestToken(false);
      } catch (error) {
        console.log(error);
      }
    }
  }, [isGuesToken, router.query.accessToken]);
  const handleLogOutClick = () => {
    localStorage.removeItem("token");
    setGuestToken(true);
  };
  if (!loggedUser) {
    return (
      <main className="h-screen flex justify-center bg-[#57886C]">
        <div>
          <p className="text-white mt-32">
            We are checking your credentials, it can take some time...
          </p>
        </div>
      </main>
    );
  }
  if (isGuesToken === false) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="h-screen bg-[url('/plant.jpg')] bg-center bg-no-repeat bg-cover flex justify-center items-start">
            <div className="flex flex-col justify-center mt-32 rounded-lg p-6 shadow-xl backdrop-blur-md bg-gray-900/10 text-white">
              <p className="m-2">Please, click to log in as a guest</p>
              <button className="border-[1px] border-white border-dashed p-2 mx-2 my-4 rounded-md hover:bg-sky-100/20 active:border-solid active:bg-[#81A684]">
                Authorize me as a guest
              </button>
            </div>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are already logged in as {loggedUser.name}. By clicking
              "Continue" you agree to be logged out and logged in as a guest.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogOutClick}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <main className="h-screen flex justify-center items-center bg-[#57886C]">
      <div>
        <p className="text-white">
          We are checking your credentials, it can take some time...
        </p>
      </div>
    </main>
  );
};

export default GuestAuth;
