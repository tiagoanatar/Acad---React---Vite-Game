import { useState } from 'react';
import { generateMap } from '../data/cenario/sampleBoard';
// Types
import { Turn } from '../data/types';
// Components
import { Map } from './map/Map';
import { Header } from './layout/Header';

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

  // Turns
  const [ turn, setTurn ] = useState<Turn>('move')

  console.log(map);
  
  // Bases
  function initialValue() {
    return {
      player: [],
      enemy: []
    }
  }
  const [ bases, setBases ] = useState(initialValue());

  return (
    <>
      <Header turn={turn} setTurn={setTurn} />
      <Map map={map} setMap={setMap} />
    </>
  );
};
