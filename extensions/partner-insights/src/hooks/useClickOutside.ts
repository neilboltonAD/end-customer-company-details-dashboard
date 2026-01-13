import { useEffect, useRef, MutableRefObject } from "react";

const useClickOutside = (
  handleFn: (e: MouseEvent) => void,
  safeElementIds?: string[],
): MutableRefObject<HTMLElement | null> => {
  const elementRef = useRef<HTMLElement>(null);

  const isChildOfSafeElement = (
    id: string,
    target: EventTarget | null,
  ): boolean => {
    const safeElement = document.getElementById(id);
    return (safeElement && safeElement.contains(target as Element)) ?? false;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        !elementRef?.current ||
        elementRef?.current.contains(event.target as Node)
      ) {
        return;
      }
      const hasSafeElementBeenClicked = safeElementIds?.some(
        (safeElementId) =>
          (event.target as Element)?.id === safeElementId ||
          isChildOfSafeElement(safeElementId, event.target),
      );
      if (!hasSafeElementBeenClicked) {
        handleFn(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleFn, safeElementIds]);

  return elementRef;
};

export default useClickOutside;
