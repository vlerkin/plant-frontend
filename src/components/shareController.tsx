import { type FC } from "react";

interface Props {
  children: React.ReactNode;
  shareData: ShareData;
  onSuccess?: () => void;
  onError?: (error?: unknown) => void;
  onNonNativeShare?: () => void;
  onInteraction?: () => void;
  disabled?: boolean;
}

const ShareController: FC<Props> = ({
  children,
  shareData,
  onInteraction,
  onSuccess,
  onError,
  onNonNativeShare,
}) => {
  const handleOnClick = async () => {
    onInteraction?.();
    if (navigator?.share) {
      try {
        await navigator.share(shareData);
        onSuccess?.();
      } catch (err) {
        onError?.(err);
      }
    } else {
      onNonNativeShare?.();
    }
  };

  return (
    <button className="mt-4" onClick={handleOnClick} type="button">
      {children}
    </button>
  );
};

export default ShareController;
