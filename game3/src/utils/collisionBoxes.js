/**
 * collisionBoxes.js — AABB collision boxes for all obstacles in the environment.
 * Each box is defined as { minX, maxX, minZ, maxZ }
 * Player is checked as a circle (radius) against these rectangles.
 */

const PLAYER_RADIUS = 0.4;

// Helper: create a collision box from center position + half-sizes
function box(cx, cz, hw, hd) {
    return { minX: cx - hw, maxX: cx + hw, minZ: cz - hd, maxZ: cz + hd };
}

// Shelf: W=3.5, D=1.0
function shelfBox(x, z) {
    return box(x, z, 1.75, 0.5);
}

const COLLISION_BOXES = [];

// ── WALLS (room boundary is ±35, but ROOM_BOUND is 34 so player already can't go past)
// We'll handle walls separately via clamping

// ── SECTION A: GROCERY SHELVES ──
for (const x of [-28, -22, -16, -10]) {
    for (const z of [-28, -22, -16, -10]) {
        COLLISION_BOXES.push(shelfBox(x, z));
    }
}

// ── FRIDGES (back wall) ──
for (const x of [-30, -28, -26, -24]) {
    COLLISION_BOXES.push(box(x, -30, 0.4, 0.35));
}

// ── SECTION B: DINING TABLES (x,z, table is 2x1) ──
for (const pos of [[10, -25], [16, -25], [22, -25], [10, -18], [16, -18], [22, -18]]) {
    COLLISION_BOXES.push(box(pos[0], pos[1], 1.0, 0.5));
}
// Counter
COLLISION_BOXES.push(box(28, -15, 1.5, 4));
// Fridges right side
COLLISION_BOXES.push(box(30, -20, 0.4, 0.35));
COLLISION_BOXES.push(box(30, -18, 0.4, 0.35));

// ── SECTION C: FURNITURE SHOWROOM ──
// Sofas (2 wide, 0.9 deep)
COLLISION_BOXES.push(box(10, 0, 1.0, 0.45));
COLLISION_BOXES.push(box(14, 0, 1.0, 0.45));
COLLISION_BOXES.push(box(10, 6, 1.0, 0.45));
COLLISION_BOXES.push(box(14, 6, 1.0, 0.45));
// Dining table
COLLISION_BOXES.push(box(20, 0, 1.0, 0.5));
// Beds
COLLISION_BOXES.push(box(22, 4, 0.8, 1.2));
COLLISION_BOXES.push(box(28, 8, 0.6, 1.1));
// Shelf
COLLISION_BOXES.push(shelfBox(26, 0));

// ── SECTION D: WEAPONS / TACTICAL ──
// Weapon racks (along wall)
COLLISION_BOXES.push(box(-30, 8, 0.15, 1.25));
COLLISION_BOXES.push(box(-30, 14, 0.15, 1.25));
COLLISION_BOXES.push(box(-30, 20, 0.15, 1.25));
// Crates
COLLISION_BOXES.push(box(-24, 8, 0.75, 0.75));
COLLISION_BOXES.push(box(-24, 12, 0.75, 0.75));
// Barrel stacks
COLLISION_BOXES.push(box(-20, 10, 0.6, 0.6));
COLLISION_BOXES.push(box(-16, 16, 0.6, 0.6));
// Shelves
COLLISION_BOXES.push(shelfBox(-18, 8));
COLLISION_BOXES.push(shelfBox(-12, 8));
COLLISION_BOXES.push(shelfBox(-18, 20));
COLLISION_BOXES.push(shelfBox(-12, 20));

// ── SECTION E: WAREHOUSE SHELVES ──
for (const x of [10, 16, 22, 28]) {
    for (const z of [20, 26]) {
        COLLISION_BOXES.push(shelfBox(x, z));
    }
}

// ── CHECKOUT LANES ──
for (const x of [-12, -4, 4, 12]) {
    COLLISION_BOXES.push(box(x, 28, 0.6, 1.25));
}

// ── HIDING CRATES ──
COLLISION_BOXES.push(box(-30, -5, 0.75, 0.75));
COLLISION_BOXES.push(box(30, -5, 0.75, 0.75));
COLLISION_BOXES.push(box(-5, 30, 0.75, 0.75));
COLLISION_BOXES.push(box(5, -30, 0.75, 0.75));
COLLISION_BOXES.push(box(0, 15, 0.75, 0.75));

// ── BARREL STACKS ──
COLLISION_BOXES.push(box(-30, 30, 0.6, 0.6));
COLLISION_BOXES.push(box(30, 30, 0.6, 0.6));

// ── SECTION WALLS (low dividers) ──
// Section A wall: pos=[-17, 1.5, -4], width=26
COLLISION_BOXES.push(box(-17, -4, 13, 0.15));
// Section B wall: pos=[4, 1.5, -20], rotated 90deg, width=16
COLLISION_BOXES.push(box(4, -20, 0.15, 8));
// Section C wall: pos=[4, 1.5, 5], rotated 90deg, width=20
COLLISION_BOXES.push(box(4, 5, 0.15, 10));
// Section D wall: pos=[-4, 1.5, 15], rotated 90deg, width=20
COLLISION_BOXES.push(box(-4, 15, 0.15, 10));

// ── PILLARS ──
// The 4 pillars at (±15, ±15) approximately
COLLISION_BOXES.push(box(-15, -15, 0.3, 0.3));
COLLISION_BOXES.push(box(15, -15, 0.3, 0.3));
COLLISION_BOXES.push(box(-15, 15, 0.3, 0.3));
COLLISION_BOXES.push(box(15, 15, 0.3, 0.3));


/**
 * Check if a circle (player position + radius) collides with any AABB.
 * Returns the corrected position (slid along walls).
 */
export function resolveCollisions(x, z) {
    let px = x;
    let pz = z;

    for (const b of COLLISION_BOXES) {
        // Find nearest point on the AABB to the player
        const nearestX = Math.max(b.minX, Math.min(px, b.maxX));
        const nearestZ = Math.max(b.minZ, Math.min(pz, b.maxZ));

        const dx = px - nearestX;
        const dz = pz - nearestZ;
        const distSq = dx * dx + dz * dz;

        if (distSq < PLAYER_RADIUS * PLAYER_RADIUS) {
            // Collision! Push the player out
            const dist = Math.sqrt(distSq);
            if (dist === 0) {
                // Player is exactly inside — push out in +X direction
                px = b.maxX + PLAYER_RADIUS;
            } else {
                const overlap = PLAYER_RADIUS - dist;
                px += (dx / dist) * overlap;
                pz += (dz / dist) * overlap;
            }
        }
    }

    return { x: px, z: pz };
}
