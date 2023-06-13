import { useState } from 'react';
import { generateWave } from '../data/cenario/waveFunctionA';

export const WaveTest = () => {
  const [ map ]  = useState(generateWave())

  return (
    <div className='grid-container'>
      {map.length > 0 &&
        map.map((row: any) =>
          row.map((cell: any) => (
            <div key={cell.id} className={`grid-item type-${cell.final.type}`}></div>
          ))
        )}
    </div>
  );
};
