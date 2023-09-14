import NavBar from "@/components/navigationBar";
import { useQRCode } from "next-qrcode";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Share from "@/components/share";
import BaseLayout from "@/components/baseLayout";

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
    <BaseLayout header="Share Access">
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
    </BaseLayout>
  );
};
export default ShareAccess;
