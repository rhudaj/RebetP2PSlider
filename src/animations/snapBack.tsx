import React from "react";

// Parameters to control the animation
export interface SnapBackOptions {
    time?: number;
    slowDownRate?: number;
    dampRate?: number;
    momentum?: number;
};

export const useSnapBack = (
    targetPos: number,
    options?: SnapBackOptions,
    onPosUpdate?: (pos: number)=>void,
    onFinished?: ()=>void,
) => {

    const [pos, setPos] = React.useState(null);
    const [isDone, setIsDone] = React.useState<boolean>(true); // Animation status
    const stepIndexRef = React.useRef(0); // To track the current step
    const animationRef = React.useRef(null); // For clearing animation when necessary

    // set defaults if options not specified (times are in ms)
    options = {
        time: options?.time ?? 1000,
        slowDownRate: options?.slowDownRate ?? 0.5,
        dampRate: options?.dampRate ?? 2,
        momentum: options?.momentum ?? 5
    }

    // setup parameters
    const interval = 16; // 16 ms for roughly 60 FPS
    const steps = Math.ceil(options.time / interval); // Number of steps for the animation

    React.useEffect(()=>{
        if(!pos || !onPosUpdate) return;
        onPosUpdate(pos);
    }, [pos])

    const factor = (t: number) => options.slowDownRate * Math.exp(-options.dampRate*t) * Math.cos(options.momentum*t);

    const start = (initPos: number) => {

        setIsDone(false);

        if (animationRef.current) {
            clearTimeout(animationRef.current); // Clear any ongoing animation
        }

        const diff = targetPos - initPos; // Distance to cover
        stepIndexRef.current = 0; // Reset step index

        const animate = () => {
            const stepIndex = stepIndexRef.current;
            const t = (stepIndex / steps) * Math.PI; // Map step to a value for `factor`

            // Compute new position using `factor` and set it
            const progress = 1 - factor(t);     // Progress as a value between 0 and 1 (1 at the start)
            const newPos = initPos + (diff * progress);

            setPos(newPos);

            if (stepIndex < steps) {
                stepIndexRef.current++;
                animationRef.current = setTimeout(animate, interval); // Schedule the next frame
            } else {
                setPos(targetPos);              // Ensure it snaps exactly to `targetPos` at the end
                setIsDone(true);            // Animation is done
                animationRef.current = null;
                if(onFinished) onFinished();
            }
        };

        animate();
    };

    const cancel = () => {
        if (animationRef.current) {
            clearTimeout(animationRef.current);
            animationRef.current = null;
        }
        setIsDone(true);
    };

    return { start, cancel, isDone };
};
