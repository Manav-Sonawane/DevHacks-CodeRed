const { MOB_HEALTH, MOB_DAMAGE, MOB_AGGRO_RANGE } = require('./constants');
const { findRandomGrassTile, isSolid, isInBounds } = require('./world');

let nextMobId = 1;
const mobs = {};

function spawnMobs(count) {
    for (let i = 0; i < count; i++) {
        const spawn = findRandomGrassTile();
        const id = `mob_${nextMobId++}`;
        mobs[id] = {
            id,
            x: spawn.x,
            y: spawn.y,
            health: MOB_HEALTH,
        };
    }
    return mobs;
}

function getAllMobs() {
    return mobs;
}

function getMob(id) {
    return mobs[id] || null;
}

function removeMob(id) {
    delete mobs[id];
}

/**
 * Damage a mob. Returns true if the mob died.
 */
function damageMob(id, amount) {
    const mob = mobs[id];
    if (!mob) return false;
    mob.health = Math.max(0, mob.health - amount);
    if (mob.health <= 0) {
        removeMob(id);
        return true;
    }
    return false;
}

/**
 * Manhattan distance between two points.
 */
function distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Find closest player within aggro range.
 */
function findClosestPlayer(mob, players) {
    let closest = null;
    let closestDist = Infinity;
    for (const p of Object.values(players)) {
        const d = distance(mob, p);
        if (d <= MOB_AGGRO_RANGE && d < closestDist) {
            closest = p;
            closestDist = d;
        }
    }
    return closest;
}

/**
 * Tick all mobs — chase nearest player or wander randomly.
 * Returns array of { playerId, damage } for any attacks.
 */
function tickMobs(players) {
    const attacks = [];

    for (const mob of Object.values(mobs)) {
        const target = findClosestPlayer(mob, players);

        if (target) {
            // Move one step toward target
            const dx = Math.sign(target.x - mob.x);
            const dy = Math.sign(target.y - mob.y);

            // Prefer axis with greater distance
            let moveX = mob.x;
            let moveY = mob.y;

            if (Math.abs(target.x - mob.x) >= Math.abs(target.y - mob.y)) {
                moveX += dx;
            } else {
                moveY += dy;
            }

            // Check if new position is valid
            if (isInBounds(moveX, moveY) && !isSolid(moveX, moveY)) {
                mob.x = moveX;
                mob.y = moveY;
            }

            // Attack if adjacent (distance 1)
            if (distance(mob, target) <= 1) {
                attacks.push({ playerId: target.id, damage: MOB_DAMAGE });
            }
        } else {
            // Random wander
            const dirs = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 },
            ];
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            const newX = mob.x + dir.dx;
            const newY = mob.y + dir.dy;
            if (isInBounds(newX, newY) && !isSolid(newX, newY)) {
                mob.x = newX;
                mob.y = newY;
            }
        }
    }

    return attacks;
}

/**
 * Find mob at a specific tile position.
 */
function getMobAt(x, y) {
    for (const mob of Object.values(mobs)) {
        if (mob.x === x && mob.y === y) return mob;
    }
    return null;
}

module.exports = {
    spawnMobs,
    getAllMobs,
    getMob,
    removeMob,
    damageMob,
    tickMobs,
    getMobAt,
};
