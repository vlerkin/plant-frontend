import NavBar from "@/components/navigationBar";
import { useQRCode } from "next-qrcode";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Share from "@/components/share";

const ShareAccess = () => {
  const router = useRouter();
  const [guestToken, setGuestToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    const accessToken = router.query.accessToken as string | undefined;
    if (!accessToken) {
      return;
    }
    setGuestToken(accessToken);
  }, [router.query.accessToken]);
  const { SVG } = useQRCode();
  const shareData = {
    title: "Share Access Credentials",
    text: "Share link",
    url: process.env.NEXT_PUBLIC_SELF_URL + `/guest-access/${guestToken}`,
  };
  return (
    <main className="bg-[#57886C] min-h-screen">
      <div className="bg-[url('/plant.jpg')] h-32 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono -mb-4 font-bold text-xl drop-shadow-2xl text-white -mt-2 md:-mt-8 lg:-mt-8 md:text-4xl lg:text-4xl">
          Share Access
        </h1>
      </div>
      <div className="w-full flex justify-center text-white">
        <div className="-mt-10 flex backdrop-blur-md bg-gray-900/10 p-10 rounded-md items-center flex-col md:-mt-20 lg:-mt-20">
          <div>
            <SVG
              text={
                process.env.NEXT_PUBLIC_SELF_URL + `/guest-access/${guestToken}`
              }
              options={{
                margin: 2,
                width: 200,
                color: {
                  dark: "#010501",
                  light: "#F5F7F5",
                },
              }}
            />
          </div>
          <div className="mt-2">
            <Share shareData={shareData}>
              <p className="border-b-[1px] border-white">Share</p>
            </Share>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ShareAccess;
