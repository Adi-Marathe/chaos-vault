# Chaos Vault

Chaos Vault is an educational puzzle game that teaches algorithmic thinking through interactive, tactile mini-games. Players sort crates, align lasers, and route packets to learn foundational computer science algorithms.

## How to Run

### Requirements
- Node.js (v18+ recommended)
- npm

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173` to play the game.

3. **Run the tests:**
   ```bash
   npx vitest run
   ```
   This validates the logic for all 8 algorithm engines.

4. **Build for production:**
   ```bash
   npm run build
   ```

## How to Play

### Progression
- Start on the **World Map**. You'll see 8 levels spread across 4 zones.
- Only the first level is unlocked by default. Clearing a level unlocks the next one.
- **Developer Cheat:** Press `U` on the World Map to instantly unlock or lock all levels for testing purposes.

### Playing a Level
Each level represents a different algorithm and features a unique board:
1. **Read the Briefing:** You'll be presented with a mission, par time, and max moves.
2. **Execute Actions:** Use the **on-screen buttons** or **keyboard shortcuts** to perform algorithmic operations (like Swap, Probe, Split, Merge, Jump, etc.).
3. **Follow the Rules:** You must perform the *exact* steps of the algorithm. Invalid moves (e.g., swapping the wrong pair or picking the wrong minimum) will result in a penalty.
4. **Win Condition:** Once the array/collection is fully sorted, the level completes.

### Penalties & Failing
- You have **3 Hearts** per level.
- Making an invalid algorithmic move consumes 1 Heart.
- Losing all 3 Hearts locks the vault. You must **Retry with a new seed**.
- Earning stars depends on minimizing mistakes and beating the par time.

### Result & Rewards
Upon clearing a level, you'll see a breakdown of your performance (Moves, Time, Mistakes) compared to Par. You earn Coins based on the stars collected and can unlock codex cards and new levels.

---

*© 2026 Chaos Vault · Algorithmic Playground*
