import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Sprout, User } from "lucide-react";
import { deleteToken, getToken } from "@/lib/tokenApi";

interface NavigationItem {
  text: string;
  href: string;
  className?: string;
  token?: string;
}

const NavigationSection = (props: NavigationItem) => {
  const href = props.href;
  const text = props.text;
  return (
    <Link className={props.className} href={href}>
      {text}
    </Link>
  );
};

const NavBar = () => {
  const [token, setToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    const tokenFromLocalStorage = getToken();
    setToken(tokenFromLocalStorage);
  }, []);
  const router = useRouter();

  const handleClickLogOut = () => {
    deleteToken();
    setToken(undefined);
    router.push("/");
  };

  return (
    <nav className="py-2 pt-4 px-4 font-mono text-white fixed top-0 w-screen z-[10] text-sm flex justify-between items-center backdrop-blur-md bg-gray-900/10 md:text-base lg:text-base">
      <NavigationSection className="mx-2.5" href="/" text="PlantieCare" />
      {token ? (
        <div className="flex items-center mr-[1px] md:mr-4 lg:mr-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline md:hidden lg:hidden rounded-md mx-2">
                <img
                  src="/menu.png"
                  alt="icon of hamburger menu"
                  className="h-8 w-8"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <button onClick={() => router.push("/me")}>
                    <span>Profile</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Sprout className="mr-2 h-4 w-4" />
                  <button onClick={() => router.push("/my-plants")}>
                    <span>My Plants</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <button onClick={handleClickLogOut}>
                  <span>Log out</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <NavigationSection
            className="mx-2.5 hidden md:inline lg:inline"
            href="/my-plants"
            text="My Plants"
          />
          <button
            className="mx-2.5 border-white border-[1px] border-solid rounded-sm px-2 py-[4px] hover:border-dashed hidden md:inline lg:inline"
            onClick={handleClickLogOut}
          >
            Log out
          </button>
          <button>
            <img
              src="/profile.svg"
              alt="icon of user "
              className="h-8 w-8 rounded-full mx-2 hidden md:inline lg:inline"
              onClick={() => router.push("/me")}
            />
          </button>
        </div>
      ) : (
        <div>
          <NavigationSection
            className="mx-2.5 text-sm md:text-base lg:text-base"
            href="/register"
            text="Register"
          />{" "}
          <NavigationSection
            className="mx-2.5 border-white border-[1px] border-solid rounded-sm px-2 py-[4px] hover:border-dashed text-sm md:text-base lg:text-base"
            href="/login"
            text="Log in"
          />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
