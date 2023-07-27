import { BasePropsWithoutSelect } from '../components/Base';

// Base
export type BaseType = 'castle' | 'city' | 'farm' | 'fortress' | 'template' | '';

// Army
export type ArmyType = 'knight' | 'lancer' | 'archer' | 'mage' | '';

// Turn
export type Turn = 'move' | 'attack' | 'enemy';

// Terrain
type WaveTerrain = 'G' | 'S' | 'M' | 'F' | 'W' | string;
type AboveTerrain = 'mountain' | 'forest' | '';

export interface GridItem {
  id: string;
  terrain: WaveTerrain;
  aboveTerrain: AboveTerrain; // TODO: Keep or delete?
  x: number;
  y: number;
  rangeCheck: boolean;
  rangeValue: number;
  pathActive: boolean;
  army: string;
  base: BasePropsWithoutSelect[];
}