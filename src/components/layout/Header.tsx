import { Dispatch, SetStateAction } from "react";
import { Turn } from '../../data/types';

export interface Props {
  turn: string;
  setTurn: Dispatch<SetStateAction<Turn>>;
}

export const Header = ({
  turn,
  setTurn,
}: Props) => {
  return (
      <div className="header">
      <div className="turn">
        {turn}
      </div>
      <div className="turn-menu">
        <button onClick={() => setTurn("enemy")}>End Turn</button>
      </div>
    </div>
  );
};
