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
  setArmySelect: Dispatch<SetStateAction<{
    y: number;
    x: number;
    active: boolean;
    copy: ArmyPropsWithoutSelect | null;
  }>>
}

export type ArmyPropsWithoutSelect = Omit<Props, "setArmySelect">;

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
  setArmySelect,
}: Props) => {
  const currentLife = convertToPercentage(lifeRef, life);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      const arrowKeys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"];
      const moveAmount = 54; // Amount to move in pixels

      if (arrowKeys.includes(key)) {
        event.preventDefault(); // Prevent default arrow key behavior (scrolling)

        // Calculate new position based on the pressed arrow key
        let newY = y;
        let newX = x;
        switch (key) {
          case "ArrowLeft":
            newX -= moveAmount;
            break;
          case "ArrowUp":
            newY -= moveAmount;
            break;
          case "ArrowRight":
            newX += moveAmount;
            break;
          case "ArrowDown":
            newY += moveAmount;
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [x, y, setArmySelect]);

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
