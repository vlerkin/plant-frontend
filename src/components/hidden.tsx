import { ReactNode, useState } from "react";

interface HiddenProps {
  children: ReactNode;
}

const Hidden = (props: HiddenProps) => {
  const [showState, setShowState] = useState<boolean>(false);
  return (
    <div className="flex flex-col justify-center w-full">
      <button
        className="my-2 pb-2 border-b-[1px] text-center hover:text-sky-100 hover:border-sky-100 transition delay-150 duration-300 ease-in-out"
        onClick={() => setShowState(!showState)}
      >
        {showState ? "Hide form" : "Create permission for access"}
      </button>
      <div>{showState && props.children}</div>
    </div>
  );
};

export default Hidden;
