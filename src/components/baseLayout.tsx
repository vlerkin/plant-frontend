import { ReactNode } from "react";
import NavBar from "./navigationBar";

interface BaseLayoutProps {
  children: ReactNode;
  header: string;
}

const BaseLayout = (props: BaseLayoutProps) => {
  return (
    <main className="bg-[#57886C] min-h-screen">
      <div className="bg-[url('/plant.jpg')] h-44 bg-center bg-no-repeat bg-cover md:h-80 lg:h-80 flex shrink-0 items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
        <h1 className="font-mono mt-4 font-bold text-xl drop-shadow-2xl text-white md:-mt-8 lg:-mt-8 md:text-4xl lg:text-4xl">
          {props.header}
        </h1>
      </div>
      {props.children}
    </main>
  );
};

export default BaseLayout;
