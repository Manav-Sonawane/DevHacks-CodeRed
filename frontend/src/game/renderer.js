const TILE_SIZE = 20;

// ── Tile Colors ──
const TILE_COLORS = {
    grass: '#2d5a27',
    tree: '#1a3d12',
    stone: '#6b6b6b',
    food: '#e8a838',
};

const TILE_BORDER_COLORS = {
    grass: '#3a7233',
    tree: '#245218',
    stone: '#585858',
    food: '#c8902e',
};

// ── Draw icons on special tiles ──
function drawTileIcon(ctx, type, x, y, size) {
    const cx = x + size / 2;
    const cy = y + size / 2;

    if (type === 'tree') {
        // Tree trunk
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(cx - 2, cy + 2, 4, size / 2 - 4);
        // Tree canopy
        ctx.fillStyle = '#2ecc40';
        ctx.beginPath();
        ctx.arc(cx, cy - 2, size / 3, 0, Math.PI * 2);
        ctx.fill();
    } else if (type === 'stone') {
        // Rock shape
        ctx.fillStyle = '#999';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 1, size / 3, size / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#aaa';
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy - 2, size / 5, size / 6, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (type === 'food') {
        // Berry / apple
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(cx, cy, size / 4, 0, Math.PI * 2);
        ctx.fill();
        // Leaf
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.ellipse(cx + 3, cy - 4, 3, 2, 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Render the full game scene on a canvas context.
 */
export function renderGame(ctx, canvas, world, players, mobs, myId) {
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    if (!world || world.length === 0) return;

    // ── Camera: center on current player ──
    const me = players[myId];
    let camX = 0;
    let camY = 0;
    if (me) {
        camX = me.x * TILE_SIZE - width / 2 + TILE_SIZE / 2;
        camY = me.y * TILE_SIZE - height / 2 + TILE_SIZE / 2;
    }

    // ── Calculate visible tile range ──
    const startCol = Math.max(0, Math.floor(camX / TILE_SIZE));
    const endCol = Math.min(world[0]?.length || 0, Math.ceil((camX + width) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(camY / TILE_SIZE));
    const endRow = Math.min(world.length, Math.ceil((camY + height) / TILE_SIZE) + 1);

    // ── Draw Tiles ──
    for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
            const tile = world[row][col];
            const screenX = col * TILE_SIZE - camX;
            const screenY = row * TILE_SIZE - camY;

            // Base tile
            ctx.fillStyle = TILE_COLORS[tile.type] || '#333';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

            // Tile border (subtle grid)
            ctx.strokeStyle = TILE_BORDER_COLORS[tile.type] || '#444';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

            // Icon for non-grass
            if (tile.type !== 'grass') {
                drawTileIcon(ctx, tile.type, screenX, screenY, TILE_SIZE);
            }
        }
    }

    // ── Draw Mobs ──
    for (const mob of Object.values(mobs)) {
        const screenX = mob.x * TILE_SIZE - camX;
        const screenY = mob.y * TILE_SIZE - camY;

        // Body
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(screenX + 5, screenY + 6, 3, 3);
        ctx.fillRect(screenX + 12, screenY + 6, 3, 3);
        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + 6, screenY + 7, 1.5, 1.5);
        ctx.fillRect(screenX + 13, screenY + 7, 1.5, 1.5);

        // Health bar above mob
        const healthPct = mob.health / 30;
        ctx.fillStyle = '#333';
        ctx.fillRect(screenX, screenY - 4, TILE_SIZE, 3);
        ctx.fillStyle = healthPct > 0.5 ? '#2ecc40' : healthPct > 0.25 ? '#f39c12' : '#e74c3c';
        ctx.fillRect(screenX, screenY - 4, TILE_SIZE * healthPct, 3);
    }

    // ── Draw Players ──
    for (const p of Object.values(players)) {
        const screenX = p.x * TILE_SIZE - camX;
        const screenY = p.y * TILE_SIZE - camY;
        const isMe = p.id === myId;

        // Player body (circle)
        ctx.fillStyle = isMe ? '#3b82f6' : '#8b5cf6';
        ctx.beginPath();
        ctx.arc(
            screenX + TILE_SIZE / 2,
            screenY + TILE_SIZE / 2,
            TILE_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Outline for current player
        if (isMe) {
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Direction indicator (small triangle showing facing)
        if (p.facing) {
            const fx = screenX + TILE_SIZE / 2 + p.facing.dx * 6;
            const fy = screenY + TILE_SIZE / 2 + p.facing.dy * 6;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(fx, fy, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Health bar above player
        const healthPct = p.health / 100;
        ctx.fillStyle = '#333';
        ctx.fillRect(screenX, screenY - 6, TILE_SIZE, 3);
        ctx.fillStyle = healthPct > 0.5 ? '#2ecc40' : healthPct > 0.25 ? '#f39c12' : '#e74c3c';
        ctx.fillRect(screenX, screenY - 6, TILE_SIZE * healthPct, 3);
    }

    // ── Draw facing indicator for current player ──
    if (me && me.facing) {
        const targetX = (me.x + me.facing.dx) * TILE_SIZE - camX;
        const targetY = (me.y + me.facing.dy) * TILE_SIZE - camY;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(targetX, targetY, TILE_SIZE, TILE_SIZE);
    }
}
