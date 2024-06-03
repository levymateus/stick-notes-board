import { useContext } from "react";

import { NotesContext } from "../context/NotesContext";

export const useNotesContext = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error();
  }
  return ctx;
}
