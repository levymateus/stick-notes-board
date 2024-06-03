
import { useEffect } from "react";

import { AppContext } from "../context/AppContext";

const AppContextProvider = ({ children, ...props }) => {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  useEffect(() => {
    document.documentElement.lang = props.lang;
  }, []);

  return <AppContext.Provider value={{ size, ...props }}>
    { children }
  </AppContext.Provider>
}

AppContextProvider.displayName = 'AppContext';

export { AppContextProvider };
