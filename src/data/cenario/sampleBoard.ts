import { generateWave } from "./waveFunctionA";
import { STORE } from "../store";

type Terrain = "grass" | "sand" | "sea";
type WaveTerrain = "G" | "S" | "M" | "F" | "W";
type AboveTerrain = "mountain" | "forest" | "";
type Base = "city" | "castle" | "temple" | "";
type Race = "human" | "orc";

export interface GridItem {
  id: string;
  terrain: WaveTerrain;
  aboveTerrain: AboveTerrain; // TODO: Keep or delete?
  x: number;
  y: number;
  control: {
    playerControl: number;
    race: Race;
    armyId: string;
    baseType: Base;
    baseId: string;
  };
}

const gridItem: GridItem = {
  id: "",
  terrain: "G",
  aboveTerrain: "",
  x: 0,
  y: 0,
  control: {
    playerControl: 0,
    race: "human",
    armyId: "",
    baseType: "",
    baseId: "",
  },
};

// Main map
const map: GridItem[][] = [];

// Used for randomize player position
const grassMap: GridItem[] = [];

const waveData = generateWave();
const size = STORE.combatMap.size;

export function generateMap() {
  for (let y = 0; y < size; y++) {
    map.unshift([]);
    for (let x = 0; x < size; x++) {
      const newItem = { ...gridItem };

      newItem.x = x;
      newItem.y = y;
      newItem.id = y + "-" + x;
      newItem.terrain = waveData[y][x].final.type;
      map[y].unshift(newItem);

      if (newItem.terrain === "G") {
        grassMap.push(newItem);
      }
    }
  }

  // Select player/enemy base
  function selectRandomValue() {
    const res = grassMap[Math.floor(Math.random() * grassMap.length)];
    return res
  }

  function selectPlayersPosition() {
    const player = selectRandomValue();
    const enemy = selectRandomValue();
    if (player.id === enemy.id) {
      selectPlayersPosition();
    }
console.log(player)
    // Player
    map[player.y][player.x].control.playerControl = 0;
    map[player.y][player.x].control.baseType = "city";
    map[player.y][player.x].control.race = "human";

    // Enemy
    map[enemy.y][enemy.x].control.playerControl = 1;
    map[enemy.y][enemy.x].control.baseType = "city";
    map[enemy.y][enemy.x].control.race = "orc";
  }

  selectPlayersPosition();

  return map;
}
