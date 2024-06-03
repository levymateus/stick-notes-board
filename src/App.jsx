import { memo, useEffect } from "react";

import { useDocument } from "./hooks/useDocument";
import { useContextMenu } from "./hooks/useContextMenu";

import { Board } from "./components/Board";
import { ContextMenu } from "./components/ContextMenu";
import { MenuBar } from "./components/MenuBar";

import { useNotesContext } from "./hooks/useNotesContext";

const MemoMenuBar = memo(MenuBar);
const MemoBoard = memo(Board);
const MemoContextMenu = memo(ContextMenu);

export const App = () => {
  const { setContextMenu } = useContextMenu();
  const { add: addNote } = useNotesContext();
  const { setDocTitle } = useDocument();

  useEffect(() => {
    setDocTitle("Stick notes board");
  }, [setDocTitle]);

  return (
    <div
      id="app"
      className="App"
      onContextMenu={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        setContextMenu({
          open: true,
          position: {
            x: evt.clientX,
            y: evt.clientY
          },
          items: [
            {
              id: crypto.randomUUID(),
              text: "Add Note",
              click: () => {
                setContextMenu(prevState => ({
                  ...prevState,
                  open: false,
                }));
                addNote({
                  position: { x: evt.clientX, y: evt.clientY },
                });
              },
            },
          ]
        });

      }}
    >
      <MemoMenuBar />
      <MemoBoard />
      <MemoContextMenu />
    </div>
  );
};

export default App;
