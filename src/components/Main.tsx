import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { generateMap } from "../data/cenario/sampleBoard";
// Types
import { Turn } from "../data/types";
// Army initial state
import { initialArmyState } from "../data/initialArmyState";
// Components
import { Map } from "./map/Map";
import { Header } from "./layout/Header";
import { DrawerArmy } from "./layout/DrawerArmy";

export const Main = () => {
  // Prevent page refresh with the G5 by mistake *** uncomment latter
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
  const [map, setMap] = useState(finalMap);

  // Turns
  const [turn, setTurn] = useState<Turn>("move");

  // Armies
  const [armies, setArmies] = useState(armyList);

  console.log(map);
  console.log("armies", armies);
  console.log(armyPositions);

  // Bases
  function initialValue() {
    return {
      player: [],
      enemy: [],
    };
  }
  const [bases, setBases] = useState(initialValue());

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <button onClick={open}>Army List</button>
      <Header turn={turn} setTurn={setTurn} />
      <Map map={map} setMap={setMap} armies={armies} setArmies={setArmies} />
      <DrawerArmy opened={opened} close={close} armies={armies} />
    </>
  );
};
