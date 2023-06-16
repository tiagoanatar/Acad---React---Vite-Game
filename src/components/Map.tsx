import { useState, Dispatch, SetStateAction } from "react";
import { GridItem } from "../data/cenario/sampleBoard";
import { calculateDistance } from "../utils";
import { Army, ArmyProps } from "./Army";
import { Base, BaseProps } from "./Base";

interface Props {
  map: GridItem[][];
  setMap: Dispatch<SetStateAction<GridItem[][]>>;
}

export const Map = ({ map, setMap }: Props) => {
  const [armySelect, setArmySelect] = useState({ y: 0, x: 0, active: false });

  const checkRange = (y: number, x: number) => {
    return calculateDistance(armySelect.x, armySelect.y, x, y) < 4 ? true : false;
  };
  return (
    <div className="main-container">
      {JSON.stringify(armySelect)}
      <div className="grid-container-over-a"></div>
      <div className="grid-container">
        {map.length > 0 &&
          map.map((row: GridItem[]) =>
            row.map((cell: GridItem) => (
              <div
                key={cell.id}
                id={cell.id}
                className={`grid-item type-${cell.terrain}`}
              >
                {/* Army range display */}
                {armySelect.active && checkRange(cell.y, cell.x) && (
                  <div className="range-block"></div>
                )}
                {/* ------------------ */}

                {cell.control.armyType && (
                  <Army
                    faction={cell.control.faction}
                    life={12}
                    lifeRef={55}
                    rank={0}
                    type={cell.control.armyType}
                    y={cell.y}
                    x={cell.x}
                    setArmySelect={setArmySelect}
                  />
                )}
                {cell.control.baseType && (
                  <Base
                    faction={cell.control.faction}
                    life={32}
                    lifeRef={70}
                    rank={0}
                    type={cell.control.baseType}
                    y={cell.y}
                    x={cell.x}
                  />
                )}
              </div>
            ))
          )}
      </div>
    </div>
  );
};
