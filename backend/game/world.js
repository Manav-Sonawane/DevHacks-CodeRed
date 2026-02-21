const { TILE, MAP_WIDTH, MAP_HEIGHT, TILE_HEALTH, SOLID_TILES } = require('./constants');

let world = [];

/**
 * Generate a 40×40 grid world with random tile distribution.
 * ~60% grass, ~20% trees, ~10% stone, ~10% food
 */
function generateWorld() {
    world = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        const row = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            // Border is always grass for clean edges
            if (x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_HEIGHT - 1) {
                row.push({ type: TILE.GRASS, health: 0 });
                continue;
            }

            const rand = Math.random();
            let type;
            if (rand < 0.60) type = TILE.GRASS;
            else if (rand < 0.80) type = TILE.TREE;
            else if (rand < 0.90) type = TILE.STONE;
            else type = TILE.FOOD;

            const health = TILE_HEALTH[type] || 0;
            row.push({ type, health });
        }
        world.push(row);
    }
    return world;
}

function getWorld() {
    return world;
}

function getTile(x, y) {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return null;
    return world[y][x];
}

function isSolid(x, y) {
    const tile = getTile(x, y);
    if (!tile) return true; // out of bounds = solid
    return SOLID_TILES.has(tile.type);
}

function isInBounds(x, y) {
    return x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT;
}

/**
 * Damage a tile. Returns the updated tile, or null if invalid.
 * When health reaches 0, tile converts to grass.
 */
function damageTile(x, y, amount = 1) {
    if (!isInBounds(x, y)) return null;
    const tile = world[y][x];
    if (tile.type === TILE.GRASS) return null; // can't break grass

    tile.health -= amount;
    if (tile.health <= 0) {
        tile.type = TILE.GRASS;
        tile.health = 0;
    }
    return tile;
}

/**
 * Find a random grass tile (used for spawning players/mobs).
 */
function findRandomGrassTile() {
    let attempts = 0;
    while (attempts < 1000) {
        const x = Math.floor(Math.random() * MAP_WIDTH);
        const y = Math.floor(Math.random() * MAP_HEIGHT);
        if (world[y][x].type === TILE.GRASS) return { x, y };
        attempts++;
    }
    // Fallback: first grass tile
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (world[y][x].type === TILE.GRASS) return { x, y };
        }
    }
    return { x: 0, y: 0 };
}

module.exports = {
    generateWorld,
    getWorld,
    getTile,
    isSolid,
    isInBounds,
    damageTile,
    findRandomGrassTile,
};
