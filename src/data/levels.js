/**
 * Level definitions for Chaos Vault – Phase 1.
 * Array order = unlock order. Level N+1 unlocks when level N is cleared.
 */
export const levels = [
  {
    id: 'lantern-sweep',
    code: '1-1',
    zone: 'seeker-woods',
    name: 'Lantern Sweep',
    algorithm: 'Linear Search',
    difficulty: 'Starter',
    parSeconds: 30,
    mission: 'Sweep the lantern beam across every element until you find the hidden target.',
  },
  {
    id: 'halving-door',
    code: '1-2',
    zone: 'seeker-woods',
    name: 'Halving Door',
    algorithm: 'Binary Search',
    difficulty: 'Starter',
    parSeconds: 20,
    mission: 'Find the hidden target by repeatedly cutting a sorted list in half. Beware of index truncation traps!',
  },
  {
    id: 'bubble-belt',
    code: '2-1',
    zone: 'sorting-foundry',
    name: 'Bubble Belt',
    algorithm: 'Bubble Sort',
    difficulty: 'Easy',
    parSeconds: 75,
    mission: 'Walk the conveyor belt and swap adjacent mis-ordered crates until every pair is in order.',
  },
  {
    id: 'crane-pick',
    code: '2-2',
    zone: 'sorting-foundry',
    name: 'Crane Pick',
    algorithm: 'Selection Sort',
    difficulty: 'Easy',
    parSeconds: 45,
    mission: 'Scan the unsorted region for the smallest crate and crane-drop it into the next sorted slot.',
  },
  {
    id: 'card-hand',
    code: '2-3',
    zone: 'sorting-foundry',
    name: 'Card Hand',
    algorithm: 'Insertion Sort',
    difficulty: 'Easy',
    parSeconds: 60,
    mission: 'Take the next card from the deck and slide it into its correct position in your sorted hand.',
  },
  {
    id: 'zipper-lanes',
    code: '3-1',
    zone: 'divide-peaks',
    name: 'Zipper Lanes',
    algorithm: 'Merge Sort',
    difficulty: 'Medium',
    parSeconds: 60,
    mission: 'Split the convoy in half recursively, then merge the sorted halves back together.',
  },
  {
    id: 'gap-jumper',
    code: '3-2',
    zone: 'divide-peaks',
    name: 'Gap Jumper',
    algorithm: 'Shell Sort',
    difficulty: 'Medium',
    parSeconds: 60,
    mission: 'Compare elements separated by shrinking gaps and swap when out of order.',
  },
  {
    id: 'mail-docks',
    code: '4-1',
    zone: 'digit-docks',
    name: 'Mail Docks',
    algorithm: 'Radix Sort',
    difficulty: 'Medium',
    parSeconds: 60,
    mission: 'Sort parcels digit by digit into the correct harbour bucket, from least to most significant.',
  },
];

export const TOTAL_LEVELS = levels.length;

/**
 * Get a level by its id (e.g. 'lantern-sweep').
 */
export function getLevel(levelId) {
  return levels.find((l) => l.id === levelId);
}

/**
 * Get a level by its code (e.g. '1-1').
 */
export function getLevelByCode(code) {
  return levels.find((l) => l.code === code);
}

/**
 * Get the index of a level in the unlock order.
 */
export function getLevelIndex(levelId) {
  return levels.findIndex((l) => l.id === levelId);
}

/**
 * Get all levels belonging to a zone.
 */
export function getLevelsForZone(zoneId) {
  return levels.filter((l) => l.zone === zoneId);
}
