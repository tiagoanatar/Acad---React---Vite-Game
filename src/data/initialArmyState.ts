import { ArmyPropsWithoutSelect } from "../components/Army";

export interface InitialPosition {
  y0: number;
  x0: number;
  y1: number;
  x1: number;
}

export function initialArmyState({y0, x0, y1, x1}: InitialPosition): ArmyPropsWithoutSelect[][] {
  return [
    [
      {
        id: "0-0-human-knight",
        faction: 0,
        race: "human",
        type: "knight",
        life: 80,
        lifeRef: 80,
        rank: 0,
        y: y0,
        x: x0,
        index: 0,
      },
      {
        id: "0-1-human-knight",
        faction: 0,
        race: "human",
        type: "knight",
        life: 80,
        lifeRef: 80,
        rank: 0,
        y: 1,
        x: 1,
        index: 0,
      }
    ],
    [
      {
        id: "1-0-orc-knight",
        faction: 1,
        race: "orc",
        type: "knight",
        life: 80,
        lifeRef: 80,
        rank: 0,
        y: y1,
        x: x1,
        index: 0,
      },
    ],
  ];
}
