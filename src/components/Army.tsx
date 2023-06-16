import { convertToPercentage } from '../utils';
import { ArmyType } from '../data/types';
import { useEffect, useState } from 'react';

export interface ArmyProps {
  faction: number;
  type: ArmyType;
  life: number;
  lifeRef: number;
  rank: number;
  y: number;
  x: number;
  setArmySelect: ({ y, x }: { y: number; x: number; active: boolean }) => void;
}

export const Army = ({
  faction,
  type,
  life,
  lifeRef,
  rank,
  y,
  x,
  setArmySelect,
}: ArmyProps) => {
  const [ pos, setPos ] = useState({y: 0, x: 0});
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
      className={`army army-${faction}-${type}`}
      onClick={() => setArmySelect({ y, x, active: true })}
      style={{ top: y, left: x }}
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
