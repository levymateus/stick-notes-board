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

  const moveStart = useCallback(({ x, y }) => {
    const rect = ref.current?.getBoundingClientRect();

    setOffset({
      x: Math.abs(x - rect.x),
      y: Math.abs(y - rect.y)
    });

    if (
      rect.right - 32 > x &&
      rect.bottom - 32 > y
    ) {
      return setCanMove(!canEdit)
    }

    setCanMove(false);
  }, [setCanMove]);

  const move = useCallback(({ x, y }) => {
    const move = { x: x - offset.x, y: y - offset.y };

    const rect = ref.current?.getBoundingClientRect();

    if (move.y + rect.height + 1 >= appSize.height) {
      move.y = rect.y;
    }

    if (move.y <= 0) {
      move.y = 0;
    }

    if (move.x + rect.width + 1 >= appSize.width) {
      move.x = rect.x;
    }

    if (move.x <= 0) {
      move.x = 0;
    }

    ref.current.style.top = `${move.y}px`;
    ref.current.style.left = `${move.x}px`;
  }, [appSize, size, offset])

  useEffect(() => {
    const { position, size, text } = getItem() || { position, size, text: "" };

    if (!ref.current) return;

    move({ position: position, size: size })

    ref.current.style.width = `${size.width}px`;
    ref.current.style.height = `${size.height}px`

    ref.current.innerText = text || "";
  }, [getItem, move]);

  useEffect(() => {
    saveState();
    return () => saveState();
  }, [saveState]);

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
        evt.stopPropagation();
        evt.preventDefault();

        moveStart({ x: evt.clientX, y: evt.clientY });
      }}
      onTouchStart={(evt) => {
        [...evt.changedTouches].forEach((touch) => {
          moveStart({ x: touch.pageX, y: touch.pageY });
        });
      }}
      onMouseMove={(evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        if (canMove) move({ x: evt.clientX, y: evt.clientY });
      }}
      onTouchMove={(evt) => {
        [...evt.changedTouches].forEach((touch) => {
          if (canMove) move({ x: touch.pageX, y: touch.pageY });
        });
      }}
      onMouseUp={() => {
        setCanMove(false);
        setOffset({ x: 0, y: 0 });
        saveState();
      }}
      onTouchEnd={() => {
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
