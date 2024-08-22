import { useCallback } from "react";

const useClipboardCopy = () => {
  const copyToClipboard = useCallback(async (text: string) => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        console.error("Error: could not copy");
      }
    } else {
      console.error("Error: Clipboard API not available");
    }
  }, []);

  return copyToClipboard;
};

export { useClipboardCopy };
