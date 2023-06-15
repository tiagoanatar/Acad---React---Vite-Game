import { convertToPercentage } from '../utils';
import { ArmyType } from '../data/types';

export interface ArmyProps {
  faction: number;
  type: ArmyType;
  life: number;
  lifeRef: number;
  rank: number;
  y: number;
  x: number;
}

export const Army = ({ faction, type, life, lifeRef, rank, y, x }: ArmyProps) => {
  const currentLife = convertToPercentage(lifeRef, life);
  return (
    <div className={`army army-${faction}-${type}`}>
      <div
        style={{
          background: `linear-gradient(to right, red ${currentLife}, black ${currentLife})`,
        }}
        className='life-bar'
      ></div>
    </div>
  );
};
