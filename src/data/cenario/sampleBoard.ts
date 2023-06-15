import { generateWave } from './waveFunctionA';
import { STORE } from '../store';
import { BaseType, ArmyType } from '../types';

type Terrain = 'grass' | 'sand' | 'sea';
type WaveTerrain = 'G' | 'S' | 'M' | 'F' | 'W';
type AboveTerrain = 'mountain' | 'forest' | '';
type Race = 'human' | 'orc' | '';

export interface GridItem {
  id: string;
  terrain: WaveTerrain;
  aboveTerrain: AboveTerrain; // TODO: Keep or delete?
  x: number;
  y: number;
  control: {
    faction: number;
    race: Race;
    armyId: string;
    armyType: ArmyType;
    baseType: BaseType;
    baseId: string;
  };
}

function gridItem(): GridItem {
  return {
    id: '',
    terrain: 'G',
    aboveTerrain: '',
    x: 0,
    y: 0,
    control: {
      faction: 0,
      race: '',
      armyId: '',
      armyType: '',
      baseType: '',
      baseId: '',
    },
  };
}

// Main map
const map: GridItem[][] = [];

// Used for randomize player position
const basesPossibleTerrain: GridItem[] = [];

const waveData = generateWave();
const size = STORE.combatMap.size;

export function generateMap() {
  function feedMap() {
    for (let y = 0; y < size; y++) {
      map[y] = [];
      for (let x = 0; x < size; x++) {
        const newItem = gridItem();

        newItem.x = x;
        newItem.y = y;
        newItem.id = y + '-' + x;
        newItem.terrain = waveData[y][x].final.type;
        map[y][x] = newItem;

        // Save G(grass) or S(sand) in a array for future search
        if (newItem.terrain === 'G' || newItem.terrain === 'S') {
          basesPossibleTerrain.push(newItem);
        }
      }
    }
  }

  // Select player/enemy staring base
  function selectRandomValue() {
    const res =
      basesPossibleTerrain[
        Math.floor(Math.random() * basesPossibleTerrain.length)
      ];
    return { ...res };
  }

  function selectPlayersPosition() {
    const player = selectRandomValue();
    const enemy = selectRandomValue();

    // Conditional position of players base
    const xDistance = Math.abs(player.x - enemy.x) < 10;
    const yDistance = Math.abs(player.y - enemy.y) < 10;
    const playerPosition =
      player.x === 0 ||
      player.x === size - 1 ||
      player.y === 0 ||
      player.y === size - 1;
    const enemyPosition =
      enemy.x === 0 ||
      enemy.x === size - 1 ||
      enemy.y === 0 ||
      enemy.y === size - 1;
    if (xDistance || yDistance || playerPosition || enemyPosition) {
      selectPlayersPosition();
    } else {
      // Player
      map[player.y][player.x].control.faction = 0;
      map[player.y][player.x].control.baseType = 'city';
      map[player.y][player.x].control.race = 'human';

      // Enemy
      map[enemy.y][enemy.x].control.faction = 1;
      map[enemy.y][enemy.x].control.baseType = 'city';
      map[enemy.y][enemy.x].control.race = 'orc';

      // Set first army location
      armyFirstLocation({player, enemy});
    }
  }

  // Set first army location
  function armyFirstLocation(positions: {player: GridItem, enemy: GridItem}){
    const { player, enemy } = positions;

    // Player
    map[player.y][player.x+1].control.faction = 0;
    map[player.y][player.x+1].control.armyType = 'knight';
    map[player.y][player.x+1].control.race = 'human';

    // Enemy
    map[enemy.y][enemy.x+1].control.faction = 1;
    map[enemy.y][enemy.x+1].control.armyType = 'knight';
    map[enemy.y][enemy.x+1].control.race = 'orc';
  }

  if (map.length === 0) {
    feedMap();
    selectPlayersPosition();
  }

  return map;
}
