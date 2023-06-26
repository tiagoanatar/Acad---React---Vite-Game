import { useState, useMemo, Dispatch, SetStateAction, MouseEvent } from "react";
import { STORE } from "../data/store";
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

interface PathActive {
  x: number | null;
  y: number | null;
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
  // Path data
  const [pathActive, setPathActive] = useState<PathActive>({
    y: null,
    x: null,
  });

  // Current base selected data
  const [baseSelect, setBaseSelect] = useState({ y: 0, x: 0, active: false });

  // -------------------------
  // Range map data
  // -------------------------
  const rangeMap = useMemo(() => {
    const gridPoints = () => {
      const grid = [...map];
      const stack = [];

      if (!armySelect.copy) return;

      stack.push(armySelect.copy.index);
      // Mark player position as already checked
      grid[armySelect.copy.index].rangeCheck = true;

      // Feed grid with positions costs
      for (let i = 0; i < grid.length; i++) {
        grid[i].rangeCheck = true;
        const distance = calculateDistance(
          armySelect.x,
          armySelect.y,
          grid[i].x,
          grid[i].y
        );
        let terrainCost = 0;
        if (grid[i].terrain === "F" || grid[i].terrain === "M") {
          terrainCost = 1;
        } else if (grid[i].terrain === "W") {
          terrainCost = 2;
        } else if (armySelect.copy.index !== i && grid[i].army.length) {
          terrainCost = 99;
        } else if (grid[i].base.length) {
          terrainCost = 99;
        }
        grid[i].rangeValue = distance + terrainCost;
      }

      // Convert array in order to make easy transform its values
      const newArray = [];
      const size = STORE.combatMap.size;
      for (let i = 0; i < grid.length; i += size) {
        newArray.push(grid.slice(i, i + size));
      }

      // Loop over grid to correct terrains values affected by mountains, water and forest
      let wrongValues = true;
      let loopErrorBlocker = 0;
      while (wrongValues && loopErrorBlocker < 10_000) {
        loopErrorBlocker++;
        bothLoops: for (let y = 0; y < newArray.length; y++) {
          for (let x = 0; x < newArray[y].length; x++) {
            if (
              (y > 0 &&
                newArray[y - 1][x].rangeValue < newArray[y][x].rangeValue) ||
              (x > 0 &&
                newArray[y][x - 1].rangeValue < newArray[y][x].rangeValue) ||
              (x < newArray[y].length - 1 &&
                newArray[y][x + 1].rangeValue < newArray[y][x].rangeValue) ||
              (y < newArray.length - 1 &&
                newArray[y + 1][x].rangeValue < newArray[y][x].rangeValue)
            ) {
              wrongValues = false;
            } else if (newArray[y][x].rangeValue > 0) {
              wrongValues = true;
              newArray[y][x].rangeValue++;
              break bothLoops;
            }
          }
        }
      }

      // Path active
      if (pathActive.x && pathActive.y) {
        let loopErrorBlocker = 0;
        let rangeValue = newArray[pathActive.y][pathActive.x].rangeValue;
        let currentX = pathActive.x;
        let currentY = pathActive.y;
        newArray[pathActive.y][pathActive.x].pathActive = true;
        while (rangeValue >= 1 && loopErrorBlocker < 10_000) {
          loopErrorBlocker++;
          bothLoops: for (let y = 0; y < newArray.length; y++) {
            for (let x = 0; x < newArray[y].length; x++) {
              if (
                calculateDistance(
                  newArray[y][x].x,
                  newArray[y][x].y,
                  currentX,
                  currentY
                ) < 2 &&
                newArray[y][x].rangeValue < rangeValue &&
                !newArray[y][x].pathActive
              ) {
                console.log(rangeValue)
                currentY = y;
                currentX = x;
                rangeValue = newArray[y][x].rangeValue;
                newArray[y][x].pathActive = true;
                break bothLoops;
              } else {
                newArray[y][x].pathActive = false;
              }
            }
          }
        }
      }

      return newArray.flat(2);
    };
    return gridPoints() || [];
  }, [armySelect, map, pathActive]);
  // -------------------------
  // -------------------------

  // -------------------------
  // Path map data
  // -------------------------

  function activatePath(onRange: boolean, e: MouseEvent<HTMLDivElement>) {
    const { dataset } = e.currentTarget;
    const x = Number(dataset.y);
    const y = Number(dataset.x);
    if (onRange && x && y) {
      setPathActive({ x, y });
    } else {
      setPathActive({ x: null, y: null });
    }
  }

  // -------------------------
  // -------------------------

  // Army position change
  function handleArmyPositionChange(
    id: string,
    currentArmy: ArmyPropsWithoutSelect[],
    y: number,
    x: number
  ) {
    if (armySelect.active && armySelect.copy && currentArmy.length === 0) {
      const army: ArmyPropsWithoutSelect = { ...armySelect.copy };
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
            army: [{ ...army, x: x, y: y }], // New army array
          };
        }
        return item;
      });
      setMap(updatedMap);
    }
  }
  return (
    <div className="main-container">
      Army Select: {JSON.stringify(armySelect)} <br />
      pathActive: {JSON.stringify(pathActive)}
      {/* Army range display */}
      {armySelect.active && (
        <div className="grid-container-over-a">
          <div className="range-map">
            {rangeMap.map((cell) => {
              return (
                <div
                  key={cell.id + "range"}
                  className="grid-item"
                  data-y={cell.y}
                  data-x={cell.x}
                  onClick={() =>
                    cell.army.length === 0 && cell.base.length === 0
                      ? handleArmyPositionChange(
                          cell.id,
                          cell.army,
                          cell.y,
                          cell.x
                        )
                      : null
                  }
                  onMouseOver={(e) =>
                    activatePath(
                      !!armySelect.copy &&
                        cell.rangeValue > 0 &&
                        cell.rangeValue <
                          armySelect.copy.rank + STORE.player.rangeIncrement,
                      e
                    )
                  }
                >
                  <div
                    className={
                      armySelect.copy &&
                      cell.rangeValue <
                        armySelect.copy.rank + STORE.player.rangeIncrement
                        ? cell.pathActive
                          ? "range-block path"
                          : "range-block"
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
