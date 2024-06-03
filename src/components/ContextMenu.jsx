import { useEffect, useRef } from "react";

import "./ContextMenu.style.css";

import { useOnClickOutside } from "../hooks/useClickOutside";
import { useContextMenu } from "../hooks/useContextMenu";
import { useAppContext } from "../hooks/useAppContext";

export const ContextMenu = () => {
  const ref = useRef();
  const { size: appSize } = useAppContext();
  const { open, items, position, setContextMenu } = useContextMenu();

  useOnClickOutside(ref, () => setContextMenu(prevState => ({
    ...prevState,
    open: false,
  })));

  useEffect(() => {
    const offset = { x: 0, y: 0 };
    const size = { width: 0, height: 0 };

    const rect = ref.current?.getBoundingClientRect();

    size.width = rect.width;
    size.height = rect.height;

    if (ref.current) {
      offset.y = appSize.height - (position.y + size.height);
      offset.x = appSize.width - (position.x + size.width);

      if (offset.y > 0) offset.y = 0;
      if (offset.x > 0) offset.x = 0;

      ref.current.style.top = `${position.y + offset.y}px`;
      ref.current.style.left = `${position.x + offset.x}px`;
    }
  }, [position])

  return (
    <div
      ref={ref}
      className="ContextMenu"
      style={{
        visibility: open ? 'visible' : 'hidden',
      }}
    >
      <ul>
        {items.map(({ id, click, text}) => (
          <li key={id} onClick={click}>{text}</li>
        ))}
      </ul>
    </div>
  );
};
