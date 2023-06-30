import { STORE } from '../store';

//////////////////////////////////////////
// VARS
//////////////////////////////////////////

interface FinalCell {
  type: string;
  frequency: number;
  u: string[];
  l: string[];
  r: string[];
  d: string[];
}

export interface Map {
  final: FinalCell;
  y: number;
  x: number;
  id: number;
  vari: [];
  collapse: boolean;
}

const MAP_SIZE_X = STORE.combatMap.size;
const MAP_SIZE_Y = STORE.combatMap.size;
const map: Map[] | any = []
// [
//   {
//     final: {
//       type: "G",
//       frequency: 0,
//       u: [],
//       l: [],
//       r: [],
//       d: [],
//     },
//     y: 0,
//     x: 0,
//     id: 0,
//     vari: [],
//     collapse: false,
//   },
// ];

const map_b: any = []; // complex strcutures
let map_id = 0;

// sample array

// G - grass
// S - sand
// W - water

// object array
const tile_objects_01: any = [];

function map_data({ type, frequency, u, l, r, d }: FinalCell) {
  return {
    type: type,
    frequency: frequency,
    u: u,
    l: l,
    r: r,
    d: d,
  };
}

//////////////////////////////////////
//tile set 01 -- grass, water and sand
//////////////////////////////////////

tile_objects_01[0] = map_data({
  type: "G",
  frequency: 1,
  u: ["G", "S", "F", "M"], // u
  l: ["G", "S", "F", "M"], // l
  r: ["G", "S", "F", "M"], // r
  d: ["G", "S", "F", "M"], // d
});

tile_objects_01[1] = map_data({
  type: "S",
  frequency: 1,
  u: ["G", "S", "W"], // u
  l: ["G", "S", "W"], // l
  r: ["G", "S", "W"], // r
  d: ["G", "S", "W"], // d
});

tile_objects_01[2] = map_data({
  type: "W",
  frequency: 1,
  u: ["W", "S"], // u
  l: ["W", "S"], // l
  r: ["W", "S"], // r
  d: ["W", "S"], // d
});

tile_objects_01[3] = map_data({
  type: "F",
  frequency: 1,
  u: ["G", "F"], // u
  l: ["G", "F"], // l
  r: ["G", "F"], // r
  d: ["G", "F"], // d
});

tile_objects_01[4] = map_data({
  type: "M",
  frequency: 35,
  u: ["G", "F", "M"], // u
  l: ["G", "F", "M"], // l
  r: ["G", "F", "M"], // r
  d: ["G", "F", "M"], // d
});

/* distance of 2 points */
function distance(x1: number, x2: number, y1: number, y2: number) {
  const a = x1 - x2;
  const b = y1 - y2;
  const c = Math.sqrt(a * a + b * b);
  return c;
}

///////////////////////////////////////////
// MAP LOAD
///////////////////////////////////////////

// class constructor
function map_gen(final: string, y: number, x: number, id: number, vari: []) {
  return {
    final: final,
    y: y,
    x: x,
    id: id,
    vari: vari,
    collapse: false,
  };
}

function map_load() {
  // SIMPLE - map object array creation
  for (let i = 0; i < MAP_SIZE_Y; i++) {
    map[i] = [];
    for (let j = 0; j < MAP_SIZE_X; j++) {
      map[i][j] = map_gen("X", i, j, map_id, []);

      for (let w = 0; w < tile_objects_01.length; w++) {
        map[i][j].vari[w] = tile_objects_01[w];
      }

      map_id = map_id + 1;
    }
  }

  map_id = 0;

  // COMPLEX - map object array creation - complex structures
  for (let i = 0; i < MAP_SIZE_Y; i++) {
    map_b[i] = [];
    for (let j = 0; j < MAP_SIZE_X; j++) {
      map_b[i][j] = map_gen("X", i, j, map_id, []);

      map_id = map_id + 1;
    }
  }

  map_id = 0;
}

///////////////////////////////////////////
// CHECK IF MAP CELS HAVE MORE THAN 1 VARIATION AVALIBLE
///////////////////////////////////////////

function check_cels() {
  for (let i = 0; i < MAP_SIZE_Y; i++) {
    for (let j = 0; j < MAP_SIZE_X; j++) {
      if (map[i][j].collapse != true) {
        // map[i][j].vari.length > 1 || map[i][j].final == 'X'
        return false;
      }
    }
  }

  return true;
}

///////////////////////////////////////////
// MAP CELLS INTERATOR
// determine smallest entropy(random options avalible) cell, choose a random value from it
// and save curent y and x
///////////////////////////////////////////

interface RandomStack {
  size: number;
  y: number;
  x: number;
  [key: string]: number;
}

let current_y = 0;
let current_x = 0;
let pick_smallest: RandomStack | null;

function interator() {
  const random_stack: RandomStack[] = [];
  const temp_index = [];
  let rand = 0;

  // search for smallest item
  function hasMin(attrib: string) {
    return (
      (random_stack.length &&
        random_stack.reduce(function (prev, curr) {
          return prev[attrib] < curr[attrib] ? prev : curr;
        })) ||
      null
    );
  }

  // feed temporary table
  for (let i = 0; i < MAP_SIZE_Y; i++) {
    for (let j = 0; j < MAP_SIZE_X; j++) {
      if (map[i][j].collapse != true) {
        // thus he will not get tiles that already collapse to 1 option
        random_stack.push({ size: map[i][j].vari.length, y: i, x: j });
      }
    }
  }

  // smallest result
  pick_smallest = hasMin("size");

  // feed index that will be chosen by random
  for (let w = 0; w < random_stack.length; w++) {
    if (pick_smallest?.size === random_stack[w].size) {
      temp_index.push([random_stack[w].y, random_stack[w].x]);
    }
  }

  rand = Math.floor(Math.random() * temp_index.length);

  if (temp_index.length > 0) {
    current_y = temp_index[rand][0];
    current_x = temp_index[rand][1];
  }
}

///////////////////////////////////////////
// COLLAPSE AT - Reduz variantes possiveis do current para 1
///////////////////////////////////////////

function colapse_at(y: number, x: number) {
  let rand = 0;
  const rand_array = [];

  if (map[y][x].collapse != true && map[y][x].vari.length > 1) {
    // map[y][x].collapse != true -- map[y][x].vari.length > 1

    // chosing random tile - based on frequency
    for (let i = 0; i < map[y][x].vari.length; i++) {
      for (let f = 0; f < map[y][x].vari[i].frequency; f++) {
        rand_array.push(i);
      }
    }

    rand = Math.floor(Math.random() * rand_array.length);

    // delete unneeded tiles
    for (let i = 0; i < map[y][x].vari.length; i++) {
      if (rand_array[rand] != i) {
        delete map[y][x].vari[i];
      }
    }

    // removing undefined items
    for (let i = 0; i < map[y][x].vari.length; i++) {
      if (map[y][x].vari[i] == undefined) {
        map[y][x].vari.splice(i, 1);
        i--;
      }
    }
  }

  // collapse all that have just 1 variation
  for (let i = 0; i < MAP_SIZE_Y; i++) {
    for (let j = 0; j < MAP_SIZE_X; j++) {
      if (map[i][j].vari.length == 1) {
        map[i][j].final = map[i][j].vari[0];
        map[i][j].collapse = true;
      }
    }
  }
}

///////////////////////////////////////////
// PROPAGATE
///////////////////////////////////////////

const temp_array: any = [];

function propagate(y: number, x: number) {
  const stack = [];
  stack[stack.length] = [y, x];

  // loop
  while (stack.length > 0) {
    const temp_y = stack[stack.length - 1][0];
    const temp_x = stack[stack.length - 1][1];

    let item_changed = false;

    // remove the current_y/x item that just add
    stack.pop();

    // compare variation lists and eliminate unnecessary ones
    for (let i = 0; i < MAP_SIZE_Y; i++) {
      for (let j = 0; j < MAP_SIZE_X; j++) {
        if (distance(temp_y, i, temp_x, j) == 1 && map[i][j].collapse != true) {
          // map[i][j].vari.length > 1

          for (let w = 0; w < map[temp_y][temp_x].vari.length; w++) {
            for (let p = 0; p < map[i][j].vari.length; p++) {
              // up
              if (i < temp_y) {
                if (
                  map[temp_y][temp_x].vari[w].u.includes(
                    map[i][j].vari[p].type
                  ) == true
                ) {
                  temp_array.push(map[i][j].vari[p].type);
                }
              }
              // left
              if (j < temp_x) {
                if (
                  map[temp_y][temp_x].vari[w].l.includes(
                    map[i][j].vari[p].type
                  ) == true
                ) {
                  temp_array.push(map[i][j].vari[p].type);
                }
              }
              // right
              if (j > temp_x) {
                if (
                  map[temp_y][temp_x].vari[w].r.includes(
                    map[i][j].vari[p].type
                  ) == true
                ) {
                  temp_array.push(map[i][j].vari[p].type);
                }
              }
              // down
              if (i > temp_y) {
                if (
                  map[temp_y][temp_x].vari[w].d.includes(
                    map[i][j].vari[p].type
                  ) == true
                ) {
                  temp_array.push(map[i][j].vari[p].type);
                }
              }
            } // for loop
          } // for loop

          // eliminating items before the next loop starts
          for (let z = 0; z < map[i][j].vari.length; z++) {
            if (
              temp_array.includes(map[i][j].vari[z].type) == false &&
              map[i][j].vari.length > 1
            ) {
              map[i][j].vari.splice(z, 1);
              item_changed = true;
              z--;
            }
          }

          if (item_changed == true) {
            stack.push([i, j]); // save index to keep using the while loop
            item_changed = false;
          }

          temp_array.length = 0; // clean table
        } // distance if
      } // for loop
    } // for loop
  } // while end
}

///////////////////////////////////////////
// MAIN WHILE
///////////////////////////////////////////

function main_while() {
  while (check_cels() == false) {
    interator();
    colapse_at(current_y, current_x);
    propagate(current_y, current_x);
  }
}

export function generateWave() {
  map_load();
  main_while();
  //console.log(map);
  return map;
}
