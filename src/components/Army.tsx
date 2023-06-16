import { convertToPercentage } from '../utils';
import { ArmyType } from '../data/types';
import { useEffect } from 'react';

export interface ArmyProps {
  id: string;
  faction: number;
  race: string;
  type: ArmyType;
  life: number;
  lifeRef: number;
  rank: number;
  y: number;
  x: number;
  setArmySelect: ({ y, x }: { y: number; x: number; active: boolean }) => void;
}

export type ArmyPropsWithoutSelect = Omit<ArmyProps, 'setArmySelect'>

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
  setArmySelect,
}: ArmyProps) => {
  const currentLife = convertToPercentage(lifeRef, life);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      const arrowKeys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
      const moveAmount = 54; // Amount to move in pixels

      if (arrowKeys.includes(key)) {
        event.preventDefault(); // Prevent default arrow key behavior (scrolling)

        // Calculate new position based on the pressed arrow key
        let newY = y;
        let newX = x;
        switch (key) {
          case 'ArrowLeft':
            newX -= moveAmount;
            break;
          case 'ArrowUp':
            newY -= moveAmount;
            break;
          case 'ArrowRight':
            newX += moveAmount;
            break;
          case 'ArrowDown':
            newY += moveAmount;
            break;
          default:
            break;
        }

        setArmySelect({ y: newY, x: newX, active: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [x, y, setArmySelect]);

  return (
    <div
      className={`army army-${race}-${type}`}
      onClick={() => setArmySelect({ y, x, active: true })}
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
