import { convertToPercentage } from "../utils";
import { ArmyType } from "../data/types";
import { useEffect, Dispatch, SetStateAction, useRef } from "react";
import { PathActive } from "./map/Map";

interface Props {
  id: string;
  faction: number;
  race: string;
  type: ArmyType;
  life: number;
  lifeRef: number;
  rank: number;
  y: number;
  x: number;
  index: number;
  isMoveActive: boolean;
  setArmySelect: Dispatch<
    SetStateAction<{
      y: number;
      x: number;
      active: boolean;
      copy: ArmyPropsWithoutSelect | null;
    }>
  >;
  path: PathActive[];
}

export type ArmyPropsWithoutSelect = Omit<
  Props,
  "setArmySelect" | "isMoveActive" | "path"
>;

export interface ArmySelect {
  y: number;
  x: number;
  active: boolean;
  copy: ArmyPropsWithoutSelect | null;
}

export const Army = ({
  id,
  faction,
  race,
  type,
  life,
  lifeRef,
  rank,
  y,
  x,
  index,
  isMoveActive,
  setArmySelect,
  path,
}: Props) => {
  const element = useRef<HTMLDivElement | null>(null);

  const currentLife = convertToPercentage(lifeRef, life);

  // Select current army
  const handleArmySelection = () => {
    setArmySelect({
      y,
      x,
      active: true,
      copy: {
        id,
        faction,
        race,
        type,
        life,
        lifeRef,
        rank,
        y,
        x,
        index,
      },
    });
  };

  // Move direction
  const moveDirectionHandler = (path: PathActive[]) => {
    const tempPath = [...path];
    while (tempPath.length > 0) {
      const finalLocation = tempPath[tempPath.length - 1];
      if (finalLocation.y && finalLocation.y > y) {
        console.log("move up");
      }
      if (finalLocation.y && finalLocation.y < y) {
        console.log("move up");
      }
      if (finalLocation.x && finalLocation.x > x) {
        console.log("move right");
      }
      if (finalLocation.x && finalLocation.x < x) {
        console.log("move left");
      }
    }
  };

  useEffect(() => {
    if (isMoveActive && path.length > 0) {
      //moveDirectionHandler(path);

    }
  }, [isMoveActive]);

  useEffect(() => {
    const el = element.current

    if (el) {
      el?.addEventListener('transitionend', moveDirectionHandler);

      return () => {
        el.removeEventListener('transitionend', moveDirectionHandler);
      };
    }
  }, []);
  return (
    <div
      className={`army army-${race}-${type}`}
      onClick={() => handleArmySelection()}
      id={`${type}-${y}-${x}`}
      ref={element}
    >
      <div
        style={{
          background: `linear-gradient(to right, red ${currentLife}, black ${currentLife})`,
        }}
        className="life-bar"
      ></div>
    </div>
  );
};
