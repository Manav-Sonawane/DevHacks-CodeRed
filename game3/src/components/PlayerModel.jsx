import React, { useEffect, useRef, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { clone as SkeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';

const MODEL_PATH = './models/player_run.glb';

/**
 * PlayerModel — Loads the Mixamo character with baked-in run animation.
 * Plays the animation at different speeds based on state:
 *   Idle → frozen pose, Walk → 0.6x, Run → 1.0x
 */
export function PlayerModel({ animation = 'Idle', scale = 0.1, ...props }) {
    const group = useRef();
    const { scene, animations } = useGLTF(MODEL_PATH);

    // Clone scene so each player has its own independent skeleton
    const clonedScene = useMemo(() => {
        const clone = SkeletonClone(scene);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return clone;
    }, [scene]);

    // Clone animations and strip root motion (position tracks)
    // This prevents the character from sliding forward with the animation loop
    const clonedAnimations = useMemo(() => {
        return animations.map(clip => {
            const cloned = clip.clone();
            // Remove all position tracks (keeps only rotation/quaternion tracks)
            cloned.tracks = cloned.tracks.filter(track => {
                return !track.name.endsWith('.position');
            });
            return cloned;
        });
    }, [animations]);

    // Bind animations to the group that contains the cloned scene
    const { actions, names, mixer } = useAnimations(clonedAnimations, group);
    const currentAction = useRef(null);

    useEffect(() => {
        if (names.length > 0) {
            console.log('Available animations:', names);
        }
    }, [names]);

    // Play/pause based on animation state
    useEffect(() => {
        if (names.length === 0) return;

        const actionName = names[0];
        const action = actions[actionName];
        if (!action) return;

        // Stop previous
        if (currentAction.current && currentAction.current !== action) {
            currentAction.current.fadeOut(0.2);
        }

        action.reset().fadeIn(0.2).play();
        action.setLoop(THREE.LoopRepeat);

        if (animation === 'Idle') {
            action.timeScale = 0; // Freeze at first frame
        } else if (animation === 'Walk') {
            action.timeScale = 0.6;
        } else if (animation === 'Run') {
            action.timeScale = 1.0;
        }

        currentAction.current = action;
    }, [animation, names, actions]);

    return (
        <group ref={group} {...props} scale={scale} dispose={null}>
            <primitive object={clonedScene} />
        </group>
    );
}

useGLTF.preload(MODEL_PATH);
