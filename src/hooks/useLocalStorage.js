import { useCallback } from "react"

export const useLocalStorage = (id, initialState) => {

  const encode = useCallback((value) => {
    return JSON.stringify(value);
  }, []);

  const decode = useCallback((value) => {
    return JSON.parse(value);
  }, []);

  const setItem = useCallback((item) => {
    localStorage.setItem(id, encode(item));
  }, [encode]);

  const getItem = useCallback(() => {
    const item = localStorage.getItem(id);
    return item ? decode(item) : initialState;
  }, [decode]);

  const getItemById = useCallback((id) => {
    const item = localStorage.getItem(id);
    return item ? decode(item) : initialState;
  }, [decode]);

  const removeItem = useCallback(() => {
    localStorage.removeItem(id);
  }, []);

  const removeById = useCallback((id) => {
    localStorage.removeItem(id);
  }, []);

  return { setItem, getItem, getItemById, removeItem, removeById };
}
