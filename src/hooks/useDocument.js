import { useCallback } from "react";

export const useDocument = () => ({
  setDocTitle: useCallback((title) => (document.title = title)),
})
