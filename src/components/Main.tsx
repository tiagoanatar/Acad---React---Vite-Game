import { useEffect, useState } from 'react';
import { generateWave, Map } from '../data/cenario/waveFunctionA';

export const Main = () => {

  // Prevent page refresh with the G5 by mistake
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //     event.returnValue = ''; // This line is necessary for Chrome compatibility
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);
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
