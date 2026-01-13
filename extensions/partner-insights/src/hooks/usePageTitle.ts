import { useEffect } from "react";

export const usePageTitle = (title: string, marketplaceName?: string): void => {
  useEffect(() => {
    if (typeof document === "undefined" || !title) {
      return;
    }

    document.title = marketplaceName ? `${title} | ${marketplaceName}` : title;
  }, [title, marketplaceName]);
};
