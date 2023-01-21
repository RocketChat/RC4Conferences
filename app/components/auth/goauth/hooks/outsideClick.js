import { useEffect, useRef, useState } from "react";

export default function useComponentVisible(
  initialIsVisible,
  setIsLoginUiOpen
) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (event.target.id === "avatar") {
      return;
    }
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
      setIsLoginUiOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
