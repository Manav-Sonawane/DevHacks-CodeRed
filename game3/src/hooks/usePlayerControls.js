import { useEffect, useRef } from 'react';

/**
 * Tracks which keyboard keys are currently held.
 * Returns a stable ref — safe to read inside useFrame without causing re-renders.
 *
 * Usage:
 *   const keys = usePlayerControls();
 *   if (keys.current['KeyW']) { ... }
 */
export function usePlayerControls() {
    const keys = useRef({});

    useEffect(() => {
        const onDown = (e) => { keys.current[e.code] = true; };
        const onUp = (e) => { keys.current[e.code] = false; };

        window.addEventListener('keydown', onDown);
        window.addEventListener('keyup', onUp);
        return () => {
            window.removeEventListener('keydown', onDown);
            window.removeEventListener('keyup', onUp);
        };
    }, []);

    return keys;
}
