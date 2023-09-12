import { useState, useMemo, Dispatch, SetStateAction } from "react";
import { STORE } from "../../data/store";
import { GridItem } from '../../data/types';
import { calculateDistance } from "../../utils";
import { Army, ArmyPropsWithoutSelect, ArmySelect } from "../Army";
import { Base } from "../Base";
import { MapRange } from "./MapRange";

interface Props {
  map: GridItem[];
  setMap: Dispatch<SetStateAction<GridItem[]>>;
  armies: ArmyPropsWithoutSelect[][];
  setArmies: Dispatch<SetStateAction<ArmyPropsWithoutSelect[][]>>;
}

export interface PathActive {
  y: number | null;
  x: number | null;
}

const armySelectInitialState = {
  y: -1,
  x: -1,
  active: false,
  copy: null,
};

export const Map = ({ map, setMap, armies, setArmies }: Props) => {
  // Current army selected data
  const [armySelect, setArmySelect] = useState<ArmySelect>({
    ...armySelectInitialState,
  });

  // Active Path
  const [pathActive, setPathActive] = useState<PathActive>({
    y: null,
    x: null,
  });

  // Path data
  const [path, setPath] = useState<PathActive[]>([]);
  const [isMoveActive, setIsMoveActive] = useState(false);

  // Current base selected data
  const [baseSelect, setBaseSelect] = useState({ y: 0, x: 0, active: false });

  // Place army
  const findObjectById = (
    id: string,
    arrayOfArrays: ArmyPropsWithoutSelect[][]
  ) => {
    for (const arr of arrayOfArrays) {
      const foundObject = arr.find((obj) => obj.id === id);
      if (foundObject && foundObject.life > 0) {
        return foundObject;
      }
    }
  };

  const placeArmy = (armyRef: string, index: number) => {
    if (armyRef.length > 0) {
      const data = findObjectById(armyRef, armies);
      console.log(armyRef);
      if (!data) {
        return null;
      }
      return (
        <Army
          id={data.id}
          faction={data.faction}
          race={data.race}
          life={data.life}
          lifeRef={data.lifeRef}
          rank={data.rank}
          type={data.type}
          y={data.y}
          x={data.x}
          index={index}
          setArmySelect={setArmySelect}
          isMoveActive={isMoveActive}
          path={path}
        />
      );
    } else {
      return null;
    }
  };

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
        if (
          (grid[i].terrain === "F" || grid[i].terrain === "M") &&
          armySelect.copy.index !== i
        ) {
          terrainCost = 1;
        } else if (armySelect.copy.index !== i && grid[i].terrain === "W") {
          terrainCost = 2;
        } else if (armySelect.copy.index !== i && grid[i].army.length) {
          terrainCost = 99;
        } else if (grid[i].base.length) {
          terrainCost = 99;
        }
        grid[i].rangeValue = distance + terrainCost + (distance * terrainCost);
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
      if (pathActive.x !== null && pathActive.y !== null) {
        // Reset path Active
        for (let y = 0; y < newArray.length; y++) {
          for (let x = 0; x < newArray[y].length; x++) {
            newArray[y][x].pathActive = false;
          }
        }

        setPath([]);

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
                ) === 1 &&
                newArray[y][x].rangeValue < rangeValue &&
                !newArray[y][x].pathActive
              ) {
                currentY = y;
                currentX = x;
                rangeValue = newArray[y][x].rangeValue;
                newArray[y][x].pathActive = true;
                setPath((prev) => [...prev, { y, x }]);
                // Save movement array **
                break bothLoops;
              }
            }
          }
        }
        setPath((prev) => [pathActive, ...prev]);
      }

      return newArray.flat(2);
    };
    return gridPoints() || [];
  }, [armySelect, map, pathActive]);
  // -------------------------
  // -------------------------

  return (
    <div className="main-container">
      Army Select: {JSON.stringify(armySelect)} <br />
      pathActive: {JSON.stringify(pathActive)} <br />
      path: {JSON.stringify(path)} <br />
      move: {JSON.stringify(isMoveActive)}
      {/* Army range display */}
      {armySelect.active && (
        <MapRange
          rangeMap={rangeMap}
          map={map}
          setMap={setMap}
          armySelect={armySelect}
          setArmySelect={setArmySelect}
          setPathActive={setPathActive}
          setPath={setPath}
          path={path}
          setIsMoveActive={setIsMoveActive}
          armies={armies}
          setArmies={setArmies}
        />
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
              {/* Army render */}
              {placeArmy(cell.army, index)}
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
