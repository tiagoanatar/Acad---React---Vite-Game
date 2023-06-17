import { generateWave } from './waveFunctionA';
import { STORE } from '../store';
import { ArmyPropsWithoutSelect } from '../../components/Army';
import { BasePropsWithoutSelect } from '../../components/Base';

type Terrain = 'grass' | 'sand' | 'sea';
type WaveTerrain = 'G' | 'S' | 'M' | 'F' | 'W';
type AboveTerrain = 'mountain' | 'forest' | '';

export interface GridItem {
  id: string;
  terrain: WaveTerrain;
  aboveTerrain: AboveTerrain; // TODO: Keep or delete?
  x: number;
  y: number;
  rangeCheck: boolean;
  rangeValue: number;
  army: ArmyPropsWithoutSelect[];
  base: BasePropsWithoutSelect[];
}

function gridItem(): GridItem {
  return {
    id: '',
    terrain: 'G',
    aboveTerrain: '',
    x: 0,
    y: 0,
    rangeCheck: false,
    rangeValue: 0,
    army: [],
    base: []
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
      map[player.y][player.x].base[0] = {
        id: 'human-base-1',
        faction: 0,
        race: 'human',
        type: 'city',
        life: 55,
        lifeRef: 80,
        rank: 0,
        y: player.y,
        x: player.x
      }

      // Enemy
      map[enemy.y][enemy.x].base[0] = {
        id: 'orc-base-1',
        faction: 1,
        race: 'orc',
        type: 'city',
        life: 74,
        lifeRef: 80,
        rank: 0,
        y: enemy.y,
        x: enemy.x
      }

      // Set first army location
      armyFirstLocation({player, enemy});
    }
  }

  // Set first army location
  function armyFirstLocation(positions: {player: GridItem, enemy: GridItem}){
    const { player, enemy } = positions;

    // Player
    map[player.y][player.x+1].army[0] = {
      id: 'human-knight-1',
      faction: 0,
      race: 'human',
      type: 'knight',
      life: 55,
      lifeRef: 80,
      rank: 0,
      y: player.y,
      x: player.x+1,
      index: 0
    }

    // Enemy
    map[enemy.y][enemy.x+1].army[0] = {
      id: 'orc-knight-1',
      faction: 0,
      race: 'orc',
      type: 'knight',
      life: 74,
      lifeRef: 80,
      rank: 0,
      y: enemy.y,
      x: enemy.x+1,
      index: 0
    }
  }

  if (map.length === 0) {
    feedMap();
    selectPlayersPosition();
  }

  return map.flat(2);
}
