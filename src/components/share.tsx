import { type FC, useState } from "react";
import ShareController from "./shareController";
import SharePopup from "./sharePopup";

interface Props {
  children: React.ReactNode;
  shareData: ShareData;
  onSuccess?: () => void;
  onError?: (error?: unknown) => void;
  onInteraction?: () => void;
  disabled?: boolean;
}

const Share: FC<Props> = ({
  children,
  shareData,
  onInteraction,
  onSuccess,
  onError,
  disabled,
}) => {
  const [openPopup, setOpenPopup] = useState(false);

  const handleNonNativeShare = () => {
    setOpenPopup(true);
  };

  return (
    <>
      {!openPopup && (
        <ShareController
          shareData={shareData}
          onInteraction={onInteraction}
          onSuccess={onSuccess}
          onError={onError}
          onNonNativeShare={handleNonNativeShare}
          disabled={disabled}
        >
          {children}
        </ShareController>
      )}
      {openPopup && (
        <SharePopup shareData={shareData} onClose={() => setOpenPopup(false)} />
      )}
    </>
  );
};

export default Share;
