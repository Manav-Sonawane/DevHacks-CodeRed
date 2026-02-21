const { MAX_HEALTH, MAX_HUNGER, HUNGER_LOSS_PER_TICK, STARVATION_DAMAGE, FOOD_HUNGER_RESTORE, MAX_HUNGER: MH } = require('./constants');
const { findRandomGrassTile, isSolid, isInBounds, getTile } = require('./world');
const { TILE } = require('./constants');

const players = {};

function createPlayer(id) {
    const spawn = findRandomGrassTile();
    const player = {
        id,
        x: spawn.x,
        y: spawn.y,
        health: MAX_HEALTH,
        hunger: MAX_HUNGER,
        facing: { dx: 0, dy: -1 }, // facing up by default
    };
    players[id] = player;
    return player;
}

function getPlayer(id) {
    return players[id] || null;
}

function getAllPlayers() {
    return players;
}

function removePlayer(id) {
    delete players[id];
}

/**
 * Move player by (dx, dy). Validates bounds and solid tiles.
 * Returns true if move succeeded.
 */
function movePlayer(id, dx, dy) {
    const player = players[id];
    if (!player) return false;

    // Normalize to single-tile step
    dx = Math.sign(dx);
    dy = Math.sign(dy);
    if (dx === 0 && dy === 0) return false;

    // Update facing direction
    player.facing = { dx, dy };

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (!isInBounds(newX, newY)) return false;
    if (isSolid(newX, newY)) return false;

    player.x = newX;
    player.y = newY;
    return true;
}

/**
 * Tick hunger for all players.
 */
function tickHungerAll() {
    for (const id of Object.keys(players)) {
        const p = players[id];
        p.hunger = Math.max(0, p.hunger - HUNGER_LOSS_PER_TICK);
        if (p.hunger <= 0) {
            p.health = Math.max(0, p.health - STARVATION_DAMAGE);
        }
    }
}

/**
 * Player eats food — restore hunger.
 */
function eatFood(id) {
    const player = players[id];
    if (!player) return false;
    player.hunger = Math.min(MAX_HUNGER, player.hunger + FOOD_HUNGER_RESTORE);
    return true;
}

/**
 * Apply damage to player. Returns true if player died.
 */
function damagePlayer(id, amount) {
    const player = players[id];
    if (!player) return false;
    player.health = Math.max(0, player.health - amount);
    return player.health <= 0;
}

/**
 * Get the tile the player is facing (for break / attack).
 */
function getFacingTile(id) {
    const player = players[id];
    if (!player) return null;
    return {
        x: player.x + player.facing.dx,
        y: player.y + player.facing.dy,
    };
}

module.exports = {
    createPlayer,
    getPlayer,
    getAllPlayers,
    removePlayer,
    movePlayer,
    tickHungerAll,
    eatFood,
    damagePlayer,
    getFacingTile,
};
