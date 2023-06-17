import { useState, useMemo, Dispatch, SetStateAction } from "react";
import { GridItem } from "../data/cenario/sampleBoard";
import { calculateDistance } from "../utils";
import { Army } from "./Army";
import { Base } from "./Base";
import { ArmyPropsWithoutSelect } from "./Army";

interface Props {
  map: GridItem[];
  setMap: Dispatch<SetStateAction<GridItem[]>>;
}

interface ArmySelect {
  y: number;
  x: number;
  active: boolean;
  copy: ArmyPropsWithoutSelect | null;
}

const armySelectInitialState = {
  y: -1,
  x: -1,
  active: false,
  copy: null,
};

export const Map = ({ map, setMap }: Props) => {
  // Current army selected data
  const [armySelect, setArmySelect] = useState<ArmySelect>({
    ...armySelectInitialState,
  });

  // Current base selected data
  const [baseSelect, setBaseSelect] = useState({ y: 0, x: 0, active: false });

  const rangeMap = useMemo(() => {
    const gridPoints = () => {
      const grid = [...map];
      const stack = [];
      if (!armySelect.copy) return;
      stack.push(armySelect.copy.index);
      // Mark player position as already checked
      grid[armySelect.copy.index].rangeCheck = true;

        for (let i = 0; i < grid.length; i++) {
          grid[i].rangeCheck = true;
          grid[i].rangeValue = calculateDistance(
            armySelect.x,
            armySelect.y,
            grid[i].x,
            grid[i].y
          );
       }

      return grid;
    };
    return gridPoints() || [];
  }, [armySelect, map]);

  // Army position change
  const handleArmyPositionChange = (
    id: string,
    currentArmy: ArmyPropsWithoutSelect[],
    y: number,
    x: number
  ) => {
    console.log(currentArmy)
    if (armySelect.active && armySelect.copy && currentArmy.length === 0) {
      const army: ArmyPropsWithoutSelect = {...armySelect.copy};
      const updatedMap: GridItem[] = map.map((item) => {
        if (item.id === id) {
          setArmySelect({
            y: y,
            x: x,
            active: true,
            copy: army,
          });
          return {
            ...item,
            x: x,
            y: y,
            army: [{ ...army, x: x, y: y}], // New army array
          };
        }
        return item;
      });
      setMap(updatedMap);
    }
  };
  return (
    <div className="main-container">
      Army Select: {JSON.stringify(armySelect)}
      {/* Army range display */}
      {armySelect.active && (
        <div className="grid-container-over-a">
          <div className="range-map">
            {rangeMap.map((cell) => {
              return (
                <div
                  key={cell.id + "range"}
                  className="grid-item"
                  onClick={() =>
                    cell.army.length === 0
                      ? handleArmyPositionChange(cell.id, cell.army, cell.y, cell.x)
                      : null
                  }
                >
                  <div
                    className={
                      armySelect.copy &&
                      cell.rangeValue < armySelect.copy.rank + 4
                        ? "range-block"
                        : ""
                    }
                  >
                    {cell.rangeValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Main map */}
      <div className="grid-container">
        {map.length > 0 &&
          map.map((cell: GridItem, index) => (
            <div
              key={cell.id}
              id={cell.id}
              className={`grid-item type-${cell.terrain}`}
            >
              {cell.army.length > 0 && (
                <Army
                  id={cell.army[0].id}
                  faction={cell.army[0].faction}
                  race={cell.army[0].race}
                  life={cell.army[0].life}
                  lifeRef={cell.army[0].lifeRef}
                  rank={cell.army[0].rank}
                  type={cell.army[0].type}
                  y={cell.army[0].y}
                  x={cell.army[0].x}
                  index={index}
                  setArmySelect={setArmySelect}
                />
              )}
              {cell.base.length > 0 && (
                <Base
                  id={cell.base[0].id}
                  faction={cell.base[0].faction}
                  race={cell.base[0].race}
                  life={cell.base[0].life}
                  lifeRef={cell.base[0].lifeRef}
                  rank={cell.base[0].rank}
                  type={cell.base[0].type}
                  y={cell.base[0].y}
                  x={cell.base[0].x}
                  setBaseSelect={setBaseSelect}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
