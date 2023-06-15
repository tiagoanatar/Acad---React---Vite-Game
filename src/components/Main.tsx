import { useEffect, useState } from 'react';
import { generateMap, GridItem } from '../data/cenario/sampleBoard';
import { Map } from './Map';

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

  // Map
  const [ map, setMap ] = useState(generateMap())

  // Bases
  function initialValue() {
    return {
      player: [],
      enemy: []
    }
  }
  const [ bases, setBases ] = useState(initialValue());

  return (
    <Map map={map} setMap={setMap} />
  );
};
