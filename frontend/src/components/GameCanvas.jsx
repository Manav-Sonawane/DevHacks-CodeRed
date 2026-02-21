import { useEffect, useRef } from 'react';
import { renderGame } from '../game/renderer';
import { setupInput } from '../game/input';

export default function GameCanvas({ world, players, mobs, myId, emit }) {
    const canvasRef = useRef(null);
    const stateRef = useRef({ world, players, mobs, myId });

    // Keep state ref updated for the animation loop
    useEffect(() => {
        stateRef.current = { world, players, mobs, myId };
    }, [world, players, mobs, myId]);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const loop = () => {
            const { world, players, mobs, myId } = stateRef.current;
            renderGame(ctx, canvas, world, players, mobs, myId);
            animId = requestAnimationFrame(loop);
        };
        animId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    // Keyboard input
    useEffect(() => {
        if (!emit) return;
        const cleanup = setupInput(emit);
        return cleanup;
    }, [emit]);

    return (
        <canvas
            ref={canvasRef}
            id="game-canvas"
            className="block w-full h-full"
            style={{ imageRendering: 'pixelated' }}
        />
    );
}
