import { type FC, useState } from "react";

type ShareState = "pending" | "success" | "error";

interface Props {
  shareData: ShareData;
  onClose: () => void;
  onError?: (error?: unknown) => void;
}

const SharePopup: FC<Props> = ({ shareData, onClose, onError }) => {
  const [state, setState] = useState<ShareState>("pending");

  const copyClicked = async () => {
    try {
      await navigator.clipboard.writeText(shareData?.url || "");
      setState("success");
    } catch (err) {
      onError && onError(err);
      setState("error");
    }
  };

  const getButtonText = (state: ShareState) => {
    switch (state) {
      case "success":
        return "Link copied";
      case "pending":
      default:
        return "Copy link";
    }
  };

  return (
    <div className="mt-2 p-4 border-white border-[1px] rounded-md border-dashed relative">
      <button onClick={onClose} className="absolute right-2 top-[6px]">
        <div aria-hidden="true" className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g id="close">
              <path
                id="x"
                d="M18.717 6.697l-1.414-1.414-5.303 5.303-5.303-5.303-1.414 1.414 5.303 5.303-5.303 5.303 1.414 1.414 5.303-5.303 5.303 5.303 1.414-1.414-5.303-5.303z"
                fill="#ffffff"
              />
            </g>
          </svg>
          <span>Close</span>
        </div>
      </button>
      <div>
        <div className="flex flex-col items-center mt-4">
          <h3>{shareData.title}</h3>
        </div>
        <div>
          {state === "error" && (
            <div>
              <p>
                Unable to copy to clipboard, please manually copy the url to
                share.
              </p>
            </div>
          )}
          <div className="flex flex-col items-center">
            <input
              className="text-black m-2 rounded-sm"
              value={shareData.url}
              readOnly
            />
            <button onClick={copyClicked}>{getButtonText(state)}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
