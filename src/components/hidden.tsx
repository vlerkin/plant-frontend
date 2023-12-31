import { ReactNode, useState } from "react";

interface HiddenProps {
  children: ReactNode;
  hide: string;
  show: string;
}

const Hidden = (props: HiddenProps) => {
  const [showState, setShowState] = useState<boolean>(false);
  return (
    <div className="flex flex-col mb-4 justify-center w-full md:w-4/5 lg:w-4/5 font-mono">
      <button
        className="my-2 pb-2 border-b-[1px] text-center hover:text-sky-100 hover:border-sky-100 transition delay-150 duration-300 ease-in-out"
        onClick={() => setShowState(!showState)}
      >
        {showState ? props.hide : props.show}
      </button>
      <div>{showState && props.children}</div>
    </div>
  );
};

export default Hidden;
