import { useState, Dispatch, SetStateAction } from "react";
import { GridItem } from "../data/cenario/sampleBoard";
import { calculateDistance } from "../utils";
import { Army } from "./Army";
import { Base, BaseProps } from "./Base";

interface Props {
  map: GridItem[];
  setMap: Dispatch<SetStateAction<GridItem[]>>;
}

export const Map = ({ map, setMap }: Props) => {
  const [armySelect, setArmySelect] = useState({ y: 0, x: 0, active: false });
  const [baseSelect, setBaseSelect] = useState({ y: 0, x: 0, active: false });

  const checkRange = (y: number, x: number) => {
    return calculateDistance(armySelect.x, armySelect.y, x, y) < 4 ? true : false;
  };
  return (
    <div className="main-container">
      {JSON.stringify(armySelect)}
      <div className="grid-container-over-a"></div>
      <div className="grid-container">
        {map.length > 0 &&
            map.map((cell: GridItem) => (
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

                {cell.army.length > 0 && (
                  <Army
                    id={cell.army[0].id}
                    faction={cell.army[0].faction}
                    race={cell.army[0].race}
                    life={cell.army[0].life}
                    lifeRef={cell.army[0].life}
                    rank={cell.army[0].rank}
                    type={cell.army[0].type}
                    y={cell.army[0].y}
                    x={cell.army[0].x}
                    setArmySelect={setArmySelect}
                  />
                )}
                {cell.base.length > 0 && (
                  <Base
                    id={cell.base[0].id}
                    faction={cell.base[0].faction}
                    race={cell.base[0].race}
                    life={cell.base[0].life}
                    lifeRef={cell.base[0].life}
                    rank={cell.base[0].rank}
                    type={cell.base[0].type}
                    y={cell.base[0].y}
                    x={cell.base[0].x}
                    setBaseSelect={setBaseSelect}
                  />
                )}
              </div>
            ))
          }
      </div>
    </div>
  );
};
