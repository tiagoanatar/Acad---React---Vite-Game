import { Dispatch, SetStateAction, MouseEvent } from "react";
import { ArmyPropsWithoutSelect } from "../Army";
import { ArmySelect, PathActive } from "./Map";
import { GridItem } from "../../data/cenario/sampleBoard";
import { STORE } from "../../data/store";

interface Props {
  rangeMap: GridItem[];
  map: GridItem[];
  setMap: Dispatch<SetStateAction<GridItem[]>>;
  armySelect: ArmySelect;
  setArmySelect: Dispatch<SetStateAction<ArmySelect>>;
  setPathActive: Dispatch<SetStateAction<PathActive>>;
}

export const MapRange = ({
  rangeMap,
  map,
  setMap,
  armySelect,
  setArmySelect,
  setPathActive,
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
  };

  // Army position change
  function handleArmyPositionChange(
    id: string,
    currentArmy: string,
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
            army: currentArmy, // New army array
          };
        }
        return item;
      });
      setMap(updatedMap);
    }
  }

  function activatePath(onRange: boolean, e: MouseEvent<HTMLDivElement>) {
    const { dataset } = e.currentTarget;
    const x = Number(dataset.x);
    const y = Number(dataset.y);
    if (onRange) {
      setPathActive({ x, y });
    } else {
      setPathActive({ x: null, y: null });
    }
  }

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
              onClick={() =>
                cell.army.length === 0 && cell.base.length === 0
                  ? handleArmyPositionChange(cell.id, cell.army, cell.y, cell.x)
                  : null
              }
              onMouseOver={(e) =>
                activatePath(
                  !!armySelect.copy &&
                    cell.rangeValue > 0 &&
                    cell.rangeValue <=
                      armySelect.copy.rank + STORE.player.rangeIncrement,
                  e
                )
              }
              onContextMenu={handleContextMenuRange}
            >
              <div
                className={
                  armySelect.copy &&
                  cell.rangeValue <=
                    armySelect.copy.rank + STORE.player.rangeIncrement
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
