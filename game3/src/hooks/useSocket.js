import { useState, useEffect, useRef, useMemo } from 'react';
import { socket } from '../socket.js';

/**
 * useSocket — manages all server-driven multiplayer state.
 */
export function useSocket() {
    const [remotePlayers, setRemotePlayers] = useState({});
    const [foods, setFoods] = useState({});
    const [enemies, setEnemies] = useState({});
    const [dayProgress, setDayProgress] = useState(0);
    const [myHealth, setMyHealth] = useState(100);
    const [playerCount, setPlayerCount] = useState(0);
    const [connected, setConnected] = useState(false);

    const myIdRef = useRef(null);

    useEffect(() => {
        socket.on('init', ({ playerId, players, foods: initialFoods }) => {
            myIdRef.current = playerId;
            setConnected(true);
            setFoods(initialFoods);
            setMyHealth(players[playerId]?.health ?? 100);
            setPlayerCount(Object.keys(players).length);

            const remote = {};
            for (const [id, p] of Object.entries(players)) {
                if (id !== playerId) remote[id] = p;
            }
            setRemotePlayers(remote);
        });

        socket.on('gameState', ({ players, dayProgress: dp, enemies: es }) => {
            const myId = myIdRef.current;
            const remote = {};
            for (const [id, p] of Object.entries(players)) {
                if (id === myId) {
                    setMyHealth(p.health);
                } else {
                    remote[id] = p;
                }
            }
            setRemotePlayers(remote);
            setPlayerCount(Object.keys(players).length);
            setDayProgress(dp);
            setEnemies(es);
        });

        socket.on('playerJoined', (player) => {
            setRemotePlayers(prev => ({ ...prev, [player.id]: player }));
        });

        socket.on('playerLeft', (id) => {
            setRemotePlayers(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        });

        socket.on('playerTorchUpdate', ({ playerId, torchOn }) => {
            setRemotePlayers(prev => {
                if (!prev[playerId]) return prev;
                return { ...prev, [playerId]: { ...prev[playerId], torchOn } };
            });
        });

        socket.on('foodConsumed', ({ foodId, playerId, newHealth }) => {
            setFoods(prev => {
                const next = { ...prev };
                delete next[foodId];
                return next;
            });
            if (playerId === myIdRef.current) {
                setMyHealth(newHealth);
            }
        });

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));

        return () => {
            socket.off('init');
            socket.off('gameState');
            socket.off('playerJoined');
            socket.off('playerLeft');
            socket.off('playerTorchUpdate');
            socket.off('foodConsumed');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    return useMemo(() => ({
        socket,
        remotePlayers,
        foods,
        enemies,
        dayProgress,
        myHealth,
        playerCount,
        connected
    }), [remotePlayers, foods, enemies, dayProgress, myHealth, playerCount, connected]);
}
