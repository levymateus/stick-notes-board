import { useState } from "react";

import { ContextMenu } from "../context/ContextMenu";

const ContextMenuProvider = ({ children }) => {
  const [contextMenu, setContextMenu] = useState({
    open: false,
    context: null,
    items: [],
    position: { x: 0, y: 0 },
  });

  return <ContextMenu.Provider value={{ ...contextMenu, setContextMenu }}>
    { children }
  </ContextMenu.Provider>
}

ContextMenuProvider.displayName = 'ContextMenu';

export { ContextMenuProvider };
