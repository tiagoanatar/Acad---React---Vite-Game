import { generateWave } from './waveFunctionA';

type Terrain = "grass" | "sand" | "sea";
type AboveTerrain = "mountain" | "forest";

interface GridItem {
  id: string;
  terrain: Terrain;
  aboveTerrain: AboveTerrain;
  x: number;
  y: number;
  control: {
    playerControl: number;
    armyId: string;
    baseId: string;
  };
}

const terrainTypes: Terrain[] = ["grass", "sand", "sea"];
const aboceTerrainTypes = ["forest", "mountain"];

const gridItem: GridItem = {
  id: "",
  terrain: "grass",
  aboveTerrain: "forest",
  x: 0,
  y: 0,
  control: {
    playerControl: 0,
    armyId: "",
    baseId: "",
  },
};

const map: GridItem[] = [];

export function generateMap(size: number) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        const newItem = {...gridItem};

        newItem.id = y+"-"+x

        if (y === 0 && x === 0){
            newItem.terrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
        } else {
            return false
        }

      map.push()
    }
  }

  return map;
}
