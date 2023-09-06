import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("token");
    setToken(tokenFromLocalStorage);
  }, []);
  const router = useRouter();

  const handleClickLogOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/");
  };

  return (
    <nav className="py-2 font-mono text-white fixed top-0 w-screen z-[10] text-sm flex justify-between items-center backdrop-blur-md bg-gray-900/10 md:text-base lg:text-base">
      <NavigationSection className="mx-2.5" href="/" text="PlantieCare" />
      {token ? (
        <div className="flex items-center mr-[1px] md:mr-4 lg:mr-4">
          <NavigationSection
            className="mx-2.5"
            href="/my-plants"
            text="My Plants"
          />
          <button
            className="mx-2.5 border-white border-[1px] border-solid rounded-sm px-2 py-[4px] hover:border-dashed"
            onClick={handleClickLogOut}
          >
            Log out
          </button>
          <button>
            <img
              src="/profile.svg"
              alt="icon of user "
              className="h-6 w-6 rounded-full"
              onClick={() => router.push("/me")}
            />
          </button>
        </div>
      ) : (
        <div>
          <NavigationSection
            className="mx-2.5"
            href="/register"
            text="Register"
          />{" "}
          <NavigationSection
            className="mx-2.5 border-white border-[1px] border-solid rounded-sm px-2 py-[4px] hover:border-dashed"
            href="/login"
            text="Log in"
          />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
