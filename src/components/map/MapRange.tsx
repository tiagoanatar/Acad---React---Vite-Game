import { Dispatch, SetStateAction, MouseEvent } from "react";
import { ArmyPropsWithoutSelect, ArmySelect } from "../Army";
import { PathActive } from "./Map";
import { GridItem } from "../../data/types";
import { COREVALUES } from "../../data/consts";

interface Props {
  rangeMap: GridItem[];
  map: GridItem[];
  setMap: Dispatch<SetStateAction<GridItem[]>>;
  armySelect: ArmySelect;
  setArmySelect: Dispatch<SetStateAction<ArmySelect>>;
  setPathActive: Dispatch<SetStateAction<PathActive>>;
  setPath: Dispatch<SetStateAction<PathActive[]>>;
  path: PathActive[];
  setIsMoveActive: Dispatch<SetStateAction<boolean>>;
  armies: ArmyPropsWithoutSelect[][];
  setArmies: Dispatch<SetStateAction<ArmyPropsWithoutSelect[][]>>;
}

export const MapRange = ({
  rangeMap,
  map,
  setMap,
  armySelect,
  setArmySelect,
  setPathActive,
  setPath,
  path,
  setIsMoveActive,
  setArmies,
  armies,
}: Props) => {
  // Context menu - mouse right click
  const handleContextMenuRange = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Disable the default right-click behavior
    setArmySelect({
      y: 0,
      x: 0,
      active: false,
      copy: null,
    });
    setPath([]);
  };

  // Army position change
  const handleArmyPositionChange = (
    id: string,
    currentArmy: string,
    y: number,
    x: number
  ) => {
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
            army: currentArmy, // New army array
          };
        }
        return item;
      });
      setMap(updatedMap);
    }
  };

  function activatePath(onRange: boolean, e: MouseEvent<HTMLDivElement>) {
    const { dataset } = e.currentTarget;
    const x = Number(dataset.x);
    const y = Number(dataset.y);
    if (onRange) {
      setPathActive({ y, x });
    } else {
      setPathActive({ y: null, x: null });
    }
  }

  const activateMovement = (y: number, x: number) => {
    const obj = { y, x };
    const match = path.some(
      (item) => JSON.stringify(item) === JSON.stringify(obj)
    );
    setIsMoveActive(match);
    // Move army from old to new position
    if (match) {
      const newMap = [...map];
      const pathLast = path[path.length - 1];
      const pathFirst = path[0];
      const currentIndex = newMap.findIndex(
        (item) => item.y === pathLast.y && item.x === pathLast.x
      );
      const newIndex = newMap.findIndex(
        (item) => item.y === pathFirst.y && item.x === pathFirst.x
      );
      const armyId = newMap[currentIndex].army;
      newMap[newIndex].army = armyId;
      newMap[currentIndex].army = "";
      setMap(newMap);
      setPathActive({ y: null, x: null });
      setPath([]);
      setArmySelect({
        y: 0,
        x: 0,
        active: false,
        copy: null,
      });
      // Update army list
      const newArmyList = [...armies];
      for (const sublist of newArmyList) {
        for (const item of sublist) {
          if (item.id === armyId) {
            item.x = x;
            item.y = y;
            return;
          }
        }
      }
      setArmies([...newArmyList]);
    }
  };

  return (
    <div className="grid-container-over-a">
      <div className="range-map">
        {rangeMap.map((cell) => {
          return (
            <div
              key={cell.id + "range"}
              className="grid-item"
              data-y={cell.y}
              data-x={cell.x}
              onClick={() => activateMovement(cell.y, cell.x)}
              onMouseOver={(e) =>
                activatePath(
                  !!armySelect.copy &&
                    cell.rangeValue > 0 &&
                    cell.rangeValue <=
                      armySelect.copy.rank + COREVALUES.player.rangeIncrement,
                  e
                )
              }
              onContextMenu={handleContextMenuRange}
            >
              <div
                className={
                  armySelect.copy &&
                  cell.rangeValue <=
                    armySelect.copy.rank + COREVALUES.player.rangeIncrement
                    ? "range-block"
                    : ""
                }
              >
                <div className={cell.pathActive ? "path" : ""}>
                  {cell.rangeValue}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
