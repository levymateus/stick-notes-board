import { memo, useCallback, useEffect, useRef, useState } from "react";

import "./Card.style.css";

import { useOnClickOutside } from "../hooks/useClickOutside";
import { useAppContext } from "../hooks/useAppContext";
import { useContextMenu } from "../hooks/useContextMenu";
import { useNotesContext } from "../hooks/useNotesContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

const StickNote = memo(({
  id,
  position = { x: 0, y: 0 },
  size = { width: 200, height: 256 },
  color: initialColor = '#ffffac',
}) => {
  const ref = useRef();

  const { lang } = useAppContext()
  const { setContextMenu } = useContextMenu();
  const { size: appSize } = useAppContext();
  const { remove: removeNote } = useNotesContext();
  const { setItem, getItem } = useLocalStorage(id, { id, position, text: "", size, });

  const [canEdit, setCanEdit] = useState(false);
  const [canMove, setCanMove] = useState(false);
  const [color, _] = useState(initialColor);

  const [
    /**
     * Coord offset from origin position of the card and the last click position.
    */
    offset,
    setOffset,
  ] = useState({ x: 0, y: 0 });

  useOnClickOutside(ref, () => {
    setCanEdit(false);
    setCanMove(false);
  });

  const saveState = useCallback(() => {
    const rect = ref.current?.getBoundingClientRect();
    setItem({
      id: id,

      size: {
        width: rect.width,
        height: rect.height,
      },

      position: {
        x: rect.x,
        y: rect.y,
      },

      text: ref.current?.innerText || "",
    });
  }, [setItem]);

  useEffect(() => {
    const prevState = getItem() || { position, size, text: "" };
    const offset = { x: 0, y: 0 };

    if (!ref.current) return;

    offset.y = appSize.height - (prevState.position.y + prevState.size.height);
    offset.x = appSize.width - (prevState.position.x + prevState.size.width);

    if (offset.y > 0) offset.y = 0;
    if (offset.x > 0) offset.x = 0;

    ref.current.style.top = `${prevState.position.y + offset.y}px`;
    ref.current.style.left = `${prevState.position.x + offset.x}px`;

    ref.current.style.width = `${prevState.size.width}px`;
    ref.current.style.height = `${prevState.size.height}px`

    ref.current.innerText = prevState.text || "";
  }, [getItem]);

  useEffect(saveState, [saveState]);

  useEffect(() => {
    if (canEdit && ref.current) ref.current.focus();
    if (!canEdit) saveState();
  }, [canEdit, saveState]);

  let elevation = 0;

  if (canEdit) {
    elevation = 1;
  }

  const contentEditableClassName = `Card ${
    canEdit ? "Card--edit" : ""
  }`.trim();

  return (
    <div
      id={id}
      ref={ref}
      lang={lang}
      spellCheck
      tabIndex="-1"
      className={contentEditableClassName}
      onMouseDown={(evt) => {
        const rect = ref.current?.getBoundingClientRect();

        setOffset({
          x: Math.abs(evt.clientX - rect.x),
          y: Math.abs(evt.clientY - rect.y)
        });

        if (
          rect.right - 32 > evt.clientX &&
          rect.bottom - 32 > evt.clientY
        ) {
          return setCanMove(!canEdit)
        }

        setCanMove(false);
      }}
      onMouseUp={() => {
        setCanMove(false);
        setOffset({ x: 0, y: 0 });
        saveState();
      }}
      onBlur={() => setCanEdit(false)}
      onContextMenu={(evt) => {
        evt.stopPropagation();

        if (!canEdit) {
          evt.preventDefault();

          setContextMenu(prevState => ({
            ...prevState,

            open: true,

            context: {
              id: id,
            },

            items: [
              {
                id: crypto.randomUUID(),
                text: "Edit",
                click: () => {
                  setContextMenu(prevState => ({
                    ...prevState,
                    open: false,
                  }));
                  setCanEdit(true);
                },
              },

              {
                id: crypto.randomUUID(),
                text: "Delete",
                click: () => {
                  setContextMenu(prevState => ({
                    ...prevState,
                    open: false,
                  }));
                  removeNote(id);
                },
              }
            ],

            position: {
              x: evt.clientX,
              y: evt.clientY,
            },
          }));
        }
      }}
      onDoubleClick={(evt) => {
        evt.stopPropagation();
        setCanEdit(true);
      }}
      onMouseMove={(evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        if (!canMove) return;

        const rect = ref.current?.getBoundingClientRect();

        const position = {
          x: evt.clientX - offset.x,
          y: evt.clientY - offset.y,
        };

        if (position.y + rect.height + 1 >= appSize.height) {
          position.y = rect.y;
        }

        if (position.y <= 1) {
          position.y = 1;
        }

        if (position.x + rect.width + 1 >= appSize.width) {
          position.x = rect.x;
        }

        if (position.x <= 1) {
          position.x = 1;
        }

        if (ref.current) {
          ref.current.style.top = `${position.y}px`;
          ref.current.style.left = `${position.x}px`;
        }
      }}
      onKeyDown={(evt) => {
        evt.stopPropagation();
        evt.stopPropagation();
        if (evt.key === "Delete") {
          // TODO: delete
        } else {
          setCanEdit(!canMove);
        }
      }}
      style={{
        zIndex: canMove || canEdit ? "100" : "0",
        background: color,
        cursor: canMove ? "grabbing" : "grab",
        boxShadow: elevation === 0 ? `rgba(100, 100, 111, 0.3) 0px 7px 29px 3px` : `rgba(100, 100, 111, 0.3) 0px 7px 8px 3px`,
      }}
      contentEditable={canEdit}
    />
  );
});

StickNote.displayName = "Note";

export { StickNote };
