import { useContext } from "react";

import { AppContext } from "../context/AppContext";

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error();
  }
  return ctx;
}
