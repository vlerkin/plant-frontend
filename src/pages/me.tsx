import Hidden from "@/components/hidden";
import NavBar from "@/components/navigationBar";
import { Input } from "@/components/ui/input";
import axios from "axios";
import router from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn, getAuthUser, numberToMonth } from "@/lib/utils";
import { AuthUser } from "@/interfaces/user_interfaces";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
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

const checkUserInfo = z.object({
  name: z.string(),
  email: z.string().email(),
  photo: z.string().nullable(),
});
type UserInfo = z.infer<typeof checkUserInfo>;

const checkTokenInfo = z.array(
  z.object({
    token: z.string(),
    nameToken: z.string(),
    userId: z.number().int(),
    id: z.number().int(),
    startDate: z.string(),
    endDate: z.string(),
  })
);
type AccessTokenInfo = z.infer<typeof checkTokenInfo>;

const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [accessTokens, setAccessTokens] = useState<AccessTokenInfo | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const [caretakerName, setCaretakerName] = useState<string>("");
  const [authUserState, setAuthUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setUserLoading] = useState<boolean>(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/login");
      return;
    }
    setToken(token);
    const authenticateUser = async () => {
      const authUser = await getAuthUser();
      setAuthUser(authUser);
      setUserLoading(false);
    };
    authenticateUser();
    const getUserFromApi = async (token: string) => {
      const response = await axios.get("http://localhost:8000/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsedResponse = checkUserInfo.safeParse(response.data);
      if (parsedResponse.success === true) {
        setUserInfo(parsedResponse.data);
      } else {
        console.log(parsedResponse.error.flatten());
      }
    };
    getUserFromApi(token);
    const getAccessTokensFromApi = async (token: string) => {
      const response = await axios.get("http://localhost:8000/access-tokens", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsedResponse = checkTokenInfo.safeParse(response.data);
      if (parsedResponse.success === true) {
        setAccessTokens(parsedResponse.data);
      } else {
        console.log(parsedResponse.error.flatten());
      }
    };
    getAccessTokensFromApi(token);
  }, []);
  if (!userInfo) {
    return <p>Loading...</p>;
  }
  if (!accessTokens) {
    return <p>Loading...</p>;
  }
  if (isUserLoading) {
    return <p>Loading...</p>;
  } else if (!authUserState) {
    router.push("/login");
    return;
  }
  const handleNameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaretakerName(e.target.value);
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/access-tokens",
        { guest_name: caretakerName, end_date: date },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Success!",
        description: "New access permission created",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveTokenClick = async (tokenId: number) => {
    try {
      await axios.delete("http://localhost:8000/access-tokens", {
        data: { token_id: tokenId },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Success!",
        description: "Permission deleted",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="bg-[#57886C] bg-repeat-y min-h-screen">
      <div className="bg-[url('/plant.jpg')] h-32 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <Toaster />
        <h1 className="font-mono -mb- font-bold text-xl drop-shadow-2xl text-white md:-mb-4 lg:-md-4 md:text-4xl lg:text-4xl">
          My Profile
        </h1>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center -mt-10 mb-10 backdrop-blur-md max-h-[60%] bg-gray-900/10 p-6 rounded-md text-white text-sm w-4/5 md:-mt-20 lg:-mt-20 md:w-2/5 lg:2/5 md:text-base lg:text-base">
          <div className="flex flex-col items-center md:flex-row lg:flex-row">
            {userInfo.photo ? (
              <div
                className="bg-center bg-no-repeat rounded-full bg-cover w-32 h-32 md:rounded-md md:w-44 md:h-44 md:m-6 lg:rounded-full lg:w-44 lg:h-44 lg:m-6"
                style={{ backgroundImage: `url(${userInfo.photo})` }}
              ></div>
            ) : (
              <div className="bg-[url('/user.svg')] rounded-full bg-center bg-no-repeat bg-cover w-32 h-32 md:w-44 md:h-44 md:m-6 md:rounded-md lg:rounded-full lg:w-44 lg:h-44 lg:m-6"></div>
            )}
            <div className="flex flex-col items-center whitespace-pre-line">
              <p className="font-semibold text-base md:text-lg lg:text-lg">
                {userInfo.name}
              </p>
              <p className="break-all">{userInfo.email}</p>
            </div>
          </div>
          <Hidden hide={"Hide info"} show={"Show access tokens"}>
            {accessTokens.map((aToken) => {
              return (
                <div
                  key={aToken.id}
                  className="flex justify-between items-center py-2 border-b-[1px] border-dashed border-white mt-2"
                >
                  <img
                    src="/key.png"
                    alt="icon of a key"
                    className="inline h-6 w-6"
                  />
                  <span className="break-all font-semibold">
                    {aToken.nameToken}{" "}
                  </span>
                  <span className="break-all text-sm italic">
                    Valid until{" "}
                    {
                      numberToMonth[
                        aToken.endDate
                          .split("T")[0]
                          .split("-")[1] as keyof typeof numberToMonth
                      ]
                    }{" "}
                    {aToken.endDate.split("T")[0].split("-")[2]}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="hover:cursor-pointer">
                        <img
                          src="/remove.png"
                          alt="icon of a trash bin"
                          className="inline h-6 w-6"
                        />
                        <p className="text-sm hidden md:text-base md:block">
                          Delete Permission
                        </p>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your guest's token data from our servers.
                          Delete permission with name {aToken.nameToken}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveTokenClick(aToken.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </Hidden>
          <Hidden hide={"Hide Form"} show={"Create permission for access"}>
            <form
              className="border-white border-dashed border-[1px] rounded-md p-4"
              onSubmit={handleFormSubmit}
            >
              <div className="flex flex-col items-center justify-center">
                <label className="block mb-2">
                  What is the name of a caretaker?
                </label>
                <Input
                  type="text"
                  value={caretakerName}
                  onChange={handleNameOnChange}
                  className="max-w-full md:max-w-96 lg:max-w-96 text-black"
                ></Input>
              </div>

              <div className="flex flex-col items-center justify-center text-black">
                <label className="block mb-2 mt-2 text-white">
                  Until what date you want this person to have access?
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal min-w-full md:max-w-96 lg:max-w-96",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 " />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span className="">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <button
                  type="submit"
                  className="mt-4 border-[1px] border-white border-solid rounded-md bg-sky-100/20 p-2 hover:bg-[#81A684] active:bg-sky-200/20"
                >
                  Create Permission
                </button>
              </div>
            </form>
          </Hidden>
        </div>
      </div>
    </main>
  );
};
export default Profile;
