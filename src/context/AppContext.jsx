import { createContext } from "react"

const appCtxInitialState = {
  lang: "en",
  size: {
    width: 1920,
    height: 1080,
  }
};

export const AppContext = createContext(appCtxInitialState);
