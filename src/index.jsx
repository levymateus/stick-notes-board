import { StrictMode, memo } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { AppContextProvider } from "./components/AppContextProvider";
import { ContextMenuProvider } from "./components/ContextMenuProvider";
import { NotesContextProvider } from "./components/NotesContextProvider";

const MemoApp = memo(App);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <AppContextProvider title="Stick Notes Board" lang={navigator.language}>
      <NotesContextProvider>
        <ContextMenuProvider>
          <MemoApp />
        </ContextMenuProvider>
      </NotesContextProvider>
    </AppContextProvider>
  </StrictMode>
);
