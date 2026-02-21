/**
 * Keyboard input handler for player actions.
 * Returns a cleanup function.
 */
export function setupInput(emit) {
    const keyHandler = (e) => {
        switch (e.key.toLowerCase()) {
            case 'w':
                emit('move', { dx: 0, dy: -1 });
                break;
            case 'a':
                emit('move', { dx: -1, dy: 0 });
                break;
            case 's':
                emit('move', { dx: 0, dy: 1 });
                break;
            case 'd':
                emit('move', { dx: 1, dy: 0 });
                break;
            case 'e':
                emit('breakBlock');
                break;
            case ' ':
                e.preventDefault();
                emit('attack');
                break;
            default:
                break;
        }
    };

    window.addEventListener('keydown', keyHandler);

    return () => {
        window.removeEventListener('keydown', keyHandler);
    };
}
