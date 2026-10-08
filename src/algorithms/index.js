/**
 * Algorithm registry.
 * Maps algorithm names (as used in level data) to engine modules.
 * If a level's engine is not registered yet, the Level page shows "Coming soon".
 */
import * as bubble from './bubble.js';
import * as linear from './linear.js';
import * as binary from './binary.js';
import * as selection from './selection.js';
import * as insertion from './insertion.js';
import * as merge from './merge.js';
import * as shell from './shell.js';
import * as radix from './radix.js';

const engines = {
  'Bubble Sort': bubble,
  'Linear Search': linear,
  'Binary Search': binary,
  'Selection Sort': selection,
  'Insertion Sort': insertion,
  'Merge Sort': merge,
  'Shell Sort': shell,
  'Radix Sort': radix,
};

/**
 * Get the engine module for the given algorithm name.
 * Returns null if not yet implemented.
 */
export function getEngine(algorithmName) {
  return engines[algorithmName] || null;
}

/**
 * Check if an engine is registered for the given algorithm name.
 */
export function hasEngine(algorithmName) {
  return algorithmName in engines;
}
