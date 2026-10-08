/**
 * Zone definitions for Chaos Vault.
 * Order matches the world-map layout; "soon" zones are not playable in Phase 1.
 */
export const zones = [
  {
    id: 'boot-camp',
    name: 'Boot Camp',
    zone: 0,
    status: 'soon',
    color: 'var(--zone-ice)',
    algorithms: 'Tutorial & Basics',
    difficulty: 'Starter',
    description: 'Calibrate your scanner and learn interval division fundamentals.',
  },
  {
    id: 'seeker-woods',
    name: 'Seeker Woods',
    zone: 1,
    status: 'active',
    color: 'var(--zone-mint)',
    algorithms: 'Linear & Binary Search',
    difficulty: 'Starter',
    description: 'Master linear and binary search to navigate the enchanted forest.',
  },
  {
    id: 'sorting-foundry',
    name: 'Sorting Foundry',
    zone: 2,
    status: 'active',
    color: 'var(--zone-orange-start)',
    gradient: 'linear-gradient(135deg, var(--zone-orange-start), var(--zone-orange-end))',
    algorithms: 'Bubble, Selection & Insertion Sort',
    difficulty: 'Easy',
    description: 'Harness steam pistons to swap and order disordered value packets along the belt.',
  },
  {
    id: 'divide-peaks',
    name: 'Divide Peaks',
    zone: 3,
    status: 'active',
    color: 'var(--zone-slate-navy)',
    darkText: true,
    algorithms: 'Merge Sort & Shell Sort',
    difficulty: 'Medium',
    description: 'Shatter heavy datasets into recursive halves and reconstruct in sorted order.',
  },
  {
    id: 'digit-docks',
    name: 'Digit Docks',
    zone: 4,
    status: 'active',
    color: 'var(--zone-lilac)',
    algorithms: 'Radix Sort',
    difficulty: 'Medium',
    description: 'Bucket sort numeric values digit by digit across harbor sorting bays.',
  },
  {
    id: 'chaos-core',
    name: 'Chaos Core',
    zone: 5,
    status: 'soon',
    color: 'var(--zone-near-black)',
    darkText: true,
    algorithms: 'Hybrid & Advanced',
    difficulty: 'Boss',
    description: 'The master vault reactor where multiple algorithmic mechanics combine.',
  },
];

export function getZone(zoneId) {
  return zones.find((z) => z.id === zoneId);
}
