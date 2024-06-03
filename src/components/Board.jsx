
import { StickNote } from "./StickNote";

import "./Board.style.css";

import { useNotesContext } from "../hooks/useNotesContext";
import { useAppContext } from "../hooks/useAppContext";

const CARD_SIZE = { width: 200, height: 256 };

export const Board = () => {
  const { notes, add } = useNotesContext();
  const { size } = useAppContext();

  return (
    <>
      {notes.map(({ ...props }) => <StickNote {...props} key={props.id} />)}
      {!notes.length ? (
        <div className="EmptyState">
          <p>Click <button type="button" onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            add({
              position: {
                x: size.width / 2 - CARD_SIZE.width / 2,
                y: size.width / 2 - CARD_SIZE.height / 2
              },
              size: CARD_SIZE,
            });
          }}>here</button> to add a card on the board. Or press right mouse click.</p>
        </div>
      ) : null}
    </>
  );
}
