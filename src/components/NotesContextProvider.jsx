import { useState, useCallback } from "react";

import { NotesContext } from "../context/NotesContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

const NotesContextProvider = ({ children }) => {
  const { getItem, getItemById, setItem, removeById } = useLocalStorage('notes', []);

  const [notes, setNotes] = useState(() => {
    const notes = getItem();
    return notes.map((id) => getItemById(id));
  });

  const add = useCallback((props) => {
    setNotes(prevState => {
      const newCard = {
        ...props,
        id: crypto.randomUUID(),
      };
      const newState = [...prevState, newCard];
      setItem(newState.map(({ id }) => id));
      return newState;
    });
  }, [setNotes]);

  const remove = useCallback((id) => {
    setNotes((prevState) => {
      const newState = [
        ...prevState.filter((item) => item.id !== id),
      ];
      setItem(newState.map(({ id }) => id));
      removeById(id);
      return newState;
    });
  }, [setNotes]);

  const update = useCallback((id, props) => {
    setNotes((prevState) => {
      const newState = [...prevState];
      const index = newState.findIndex((item) => item.id === id);
      if (index >= 0 && index <= newState.length) {
        newState[index] = { ...newState[index], ...props };
      }
      return newState;
    });
  }, [setNotes]);

  return <NotesContext.Provider value={{ notes, add, remove, update }}>
    { children }
  </NotesContext.Provider>
}

NotesContextProvider.displayName = 'NotesContextProvider';

export { NotesContextProvider };
