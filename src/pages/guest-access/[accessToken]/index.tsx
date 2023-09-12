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
import { UserInfo, checkUserInfo } from "@/zod-schemas/userValidation";
import { authorizeGuestToken, getUser } from "@/lib/userApi";
import { deleteToken, getToken, setToken } from "@/lib/tokenApi";

const GuestAuth = () => {
  const router = useRouter();
  const [isGuestToken, setGuestToken] = useState<boolean>(false);
  const [loggedUser, setLoggedUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const accessToken = router.query.accessToken;
    if (!accessToken) {
      return;
    }
    const tokenFromLocalStorage: string | null | undefined = getToken();
    if (
      (tokenFromLocalStorage == null || tokenFromLocalStorage == undefined) &&
      accessToken != undefined
    ) {
      try {
        const validateToken = async () => {
          const response = await authorizeGuestToken(accessToken);
          setToken(response.data.guest_token);
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
        const getUserFromApi = async () => {
          const response = await getUser();
          const parsedResponse = checkUserInfo.safeParse(response.data);
          if (parsedResponse.success === true) {
            setLoggedUser(parsedResponse.data);
          } else {
            console.log(parsedResponse.error.flatten());
          }
        };
        getUserFromApi();
        setGuestToken(false);
      } catch (error) {
        console.log(error);
      }
    }
  }, [isGuestToken, router.query.accessToken]);

  const handleLogOutClick = () => {
    deleteToken();
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

  if (isGuestToken === false) {
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
