import { useState, useEffect } from 'react';
import { generateMap } from '../data/cenario/sampleBoard';
// Types
import { Turn } from '../data/types';
// Army state
import { initialArmyState } from "../data/initialArmyState";
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

  const { finalMap, armyPositions } = generateMap();
  const armyList = initialArmyState(armyPositions);

  // Map
  const [ map, setMap ] = useState(finalMap)

  // Turns
  const [ turn, setTurn ] = useState<Turn>('move')

  // Armies
  const [armies, setArmies] = useState(armyList);

  useEffect(() => {
    // setArmies(initialArmyState(armyPositions || {y0: 0, x0: 0, y1: 1, x1: 1}))
  },[armyPositions])


  console.log(map);
  console.log(armyPositions);
  
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
      <Map map={map} setMap={setMap} armies={armies} setArmies={setArmies} />
    </>
  );
};
