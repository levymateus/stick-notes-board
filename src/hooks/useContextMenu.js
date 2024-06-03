import { useContext } from "react";

import { ContextMenu } from "../context/ContextMenu";

export const useContextMenu = () => {
  const ctx = useContext(ContextMenu);
  if (!ctx) {
    throw new Error();
  }
  return ctx;
}
