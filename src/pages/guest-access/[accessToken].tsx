import axios from "axios";
import router from "next/router";
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

const GuestAuth = () => {
  const accessToken = router.query.accessToken;
  const [isGuesToken, setGuestToken] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const tokenFromLocalStorage: string | null = localStorage.getItem("token");
    if (!tokenFromLocalStorage) {
      try {
        const validateToken = async () => {
          const response = await axios.get(
            `http://localhost:8000/access-tokens/authorize/${accessToken}`
          );
          localStorage.setItem("token", response.data.guest_token);
          setGuestToken(true);
        };
        validateToken();
      } catch (error) {
        console.log(error);
      }
    } else {
      setGuestToken(false);
    }
  }, [count]);
  const handleLogOutClick = () => {
    localStorage.removeItem("token");
    setCount(count + 1);
  };
  if (isGuesToken === false) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{isGuesToken === false}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are already logged in. By clicking "Continue" you agree to be
              logged out and logged in as a guest.
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
    <main className="h-screen flex justify-center items-center">
      <div>
        <p>We are checking your credentials, it can take some time...</p>
      </div>
    </main>
  );
};

export default GuestAuth;
