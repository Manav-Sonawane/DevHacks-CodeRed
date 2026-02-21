import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from './Environment.jsx';
import { LocalPlayer } from './LocalPlayer.jsx';
import { RemotePlayer } from './RemotePlayer.jsx';
import { Enemy } from './Enemy.jsx';
import { FoodItem } from './FoodItem.jsx';

function SceneContents({ socket, remotePlayers, foods, enemies, serverDayProgress, onBatteryChange, onHidingChange, inventory, setInventory }) {
    const ambientRef = useRef();
    const sunRef = useRef();
    const fogRef = useRef();
    const [localDayProgress, setLocalDayProgress] = useState(0);

    useFrame(() => {
        const dp = serverDayProgress !== undefined ? serverDayProgress : 0;
        setLocalDayProgress(dp);

        // Peak the sun only during the first 33.3% (Daytime)
        const sunFactor = dp < 0.333 ? Math.sin((dp / 0.333) * Math.PI) : 0;

        if (ambientRef.current) {
            // Day is much brighter now
            ambientRef.current.intensity = 0.3 + sunFactor * 1.5;
        }
        if (sunRef.current) {
            sunRef.current.intensity = sunFactor * 2.5;
        }
        if (fogRef.current) {
            fogRef.current.near = 10 + sunFactor * 25;
            fogRef.current.far = 50 + sunFactor * 100;
        }
    });

    return (
        <>
            <fog ref={fogRef} attach="fog" args={['#020208', 8, 45]} />
            <ambientLight ref={ambientRef} intensity={0.3} color="#ffffff" />
            <directionalLight ref={sunRef} position={[10, 20, 10]} intensity={0} color="#fffcf0" />

            <Environment dayProgress={localDayProgress} />

            <LocalPlayer socket={socket} onBatteryChange={onBatteryChange} foods={foods} onHidingChange={onHidingChange} inventory={inventory} setInventory={setInventory} />

            {Object.values(remotePlayers).map((p) => (
                <RemotePlayer key={p.id} playerData={p} />
            ))}

            {enemies && Object.values(enemies).map((e) => (
                <Enemy key={e.id} enemyData={e} />
            ))}

            {foods && Object.values(foods).map((f) => (
                <FoodItem key={f.id} food={f} />
            ))}
        </>
    );
}

export const Game = React.memo(({ socket, remotePlayers, foods, enemies, dayProgress, onBatteryChange, onHidingChange, inventory, setInventory }) => {
    return (
        <Canvas
            style={{ position: 'absolute', top: 0, left: 0 }}
            camera={{ fov: 75, near: 0.1, far: 120, position: [0, 1.6, 28], rotation: [0, Math.PI, 0] }}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
            <SceneContents
                socket={socket}
                remotePlayers={remotePlayers}
                foods={foods}
                enemies={enemies}
                serverDayProgress={dayProgress}
                onBatteryChange={onBatteryChange}
                onHidingChange={onHidingChange}
                inventory={inventory}
                setInventory={setInventory}
            />
        </Canvas>
    );
});
