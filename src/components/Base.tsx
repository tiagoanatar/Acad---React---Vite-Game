import { convertToPercentage } from '../utils';
import { BaseType } from '../data/types';

interface Props {
  id: string;
  faction: number;
  race: string;
  type: BaseType;
  life: number;
  lifeRef: number;
  rank: number;
  y: number;
  x: number;
  setBaseSelect: ({ y, x }: { y: number; x: number; active: boolean }) => void;
}

export type BasePropsWithoutSelect = Omit<Props, 'setBaseSelect'>

export const Base = ({ faction, type, life, lifeRef, rank, y, x }: Props) => {
  const currentLife = convertToPercentage(lifeRef, life);
  return (
    <div className={`base base-${faction}-${type}`}>
      <div
        style={{
          background: `linear-gradient(to right, red ${currentLife}, black ${currentLife})`,
        }}
        className='life-bar'
      ></div>
    </div>
  );
};
