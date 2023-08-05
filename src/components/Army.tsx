import { convertToPercentage } from "../utils";
import { ArmyType } from "../data/types";
import { useEffect, Dispatch, SetStateAction } from "react";

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
  armySelect: ArmySelect;
  setArmySelect: Dispatch<SetStateAction<{
    y: number;
    x: number;
    active: boolean;
    copy: ArmyPropsWithoutSelect | null;
  }>>
}

export type ArmyPropsWithoutSelect = Omit<Props, "setArmySelect" | "armySelect">;

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
  armySelect,
  setArmySelect,
}: Props) => {
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
        index
      },
    });
  };
  return (
    <div
      className={`army army-${race}-${type}`}
      onClick={() => handleArmySelection()}
      id={`${type}-${y}-${x}`}
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
