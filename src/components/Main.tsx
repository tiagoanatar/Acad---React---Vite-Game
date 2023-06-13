import { useEffect, useState } from 'react';
import { generateMap, GridItem } from '../data/cenario/sampleBoard';

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
  const [ map ]  = useState(generateMap())

  return (
    <div className='grid-container'>
      {map.length > 0 &&
        map.map((row: GridItem[], y) =>
          row.map((cell: GridItem, x:number) => (
            <div key={y+"-"+x} className={`grid-item type-${cell.terrain} ${cell.control.race}-${cell.control.baseType}`}></div>
          ))
        )}
    </div>
  );
};
