import { generateWave, FinalCell } from './waveFunctionA';
import { COREVALUES } from '../consts';
import { GridItem } from '../types';
import { InitialPosition } from "../initialArmyState";

function gridItem(): GridItem {
  return {
    id: '',
    terrain: 'G',
    aboveTerrain: '',
    x: 0,
    y: 0,
    rangeCheck: false,
    rangeValue: 0,
    pathActive: false,
    army: '',
    base: []
  };
}

// Main map
const map: GridItem[][] = [];

// Used for randomize player position
const basesPossibleTerrain: GridItem[] = [];

const waveData = generateWave();
const size = COREVALUES.combatMap.size;

// Exported first armies position
let armyPositions: InitialPosition;

export function generateMap() {
  function feedMap() {
    for (let y = 0; y < size; y++) {
      map[y] = [];
      for (let x = 0; x < size; x++) {
        const newItem = gridItem();

        newItem.x = x;
        newItem.y = y;
        newItem.id = y + '-' + x;
        newItem.terrain = (waveData[y][x].final as FinalCell).type;
        map[y][x] = newItem;

        basesPossibleTerrain.push(newItem);
      }
    }
  }

  // Select player/enemy starting base
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
    map[player.y][player.x+1].army = '0-0-human-knight';
    map[1][1].army = '0-1-human-knight';

    // Enemy
    map[enemy.y][enemy.x+1].army = '1-0-orc-knight';

    armyPositions = {y0: player.y, x0: player.x+1, y1: enemy.y, x1: enemy.x+1};
  }

  if (map.length === 0) {
    feedMap();
    selectPlayersPosition();
  }

  const finalMap = map.flat(2);
  return { finalMap, armyPositions };
}
