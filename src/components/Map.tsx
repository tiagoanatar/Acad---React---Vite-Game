import { useState, Dispatch, SetStateAction } from "react";
import { GridItem } from "../data/cenario/sampleBoard";
import { Army, ArmyProps } from "./Army";
import { Base, BaseProps } from "./Base";

interface Props {
  map: GridItem[][];
  setMap: Dispatch<SetStateAction<GridItem[][]>>;
}

const mockArmyData: ArmyProps = {
  faction: 0,
  type: "knight",
  life: 30,
  lifeRef: 40,
  rank: 0,
  y: 3,
  x: 3,
};

export const Map = ({ map, setMap }: Props) => {
  const [armyPos, setArmyPos] = useState();
  return (
    <div className="main-container">
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
                {cell.control.armyType && (
                  <Army
                    faction={cell.control.faction}
                    life={12}
                    lifeRef={55}
                    rank={0}
                    type={cell.control.armyType}
                    y={cell.y}
                    x={cell.x}
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
