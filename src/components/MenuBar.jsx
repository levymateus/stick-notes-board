import { useAppContext } from "../hooks/useAppContext"

import "./MenuBar.style.css";

export const MenuBar = () => {
  const { title } = useAppContext();
  return <header className="MenuBar">
    <h1>{title}</h1>
  </header>
}