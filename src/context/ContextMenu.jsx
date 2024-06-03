import { createContext } from "react";

const contextMenuInitialState = {
  open: false,
};

export const ContextMenu = createContext(contextMenuInitialState);
