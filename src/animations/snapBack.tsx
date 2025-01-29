import React from "react";

// Parameters to control the animation
export interface SnapBackOptions {
    time?: number;
    slowDownRate?: number;
    dampRate?: number;
    momentum?: number;
};

/**
 * Custom animation for snapping a position to a target position
 * over time using a cosine with exponential decay.
 * @param targetPos    where we would like to end
 * @param options      options to control the interpolation
 * @param onPosUpdate  callback for when the animation updates position
 * @param onFinished   callback for when the animation is over
 */
export const useSnapBack = (
    targetPos: number,
    options?: SnapBackOptions,
    onPosUpdate?: (pos: number)=>void,
    onFinished?: ()=>void,
) => {

    // Animation status
    const [pos, setPos] = React.useState(null);
    const [isDone, setIsDone] = React.useState<boolean>(true);
    // References to track the current step and for clearing animation when necessary
    const stepIndexRef = React.useRef(0);
    const animationRef = React.useRef(null);

    // Set defaults if options not specified (times are in ms)
    options = {
        time: options?.time ?? 1000,
        slowDownRate: options?.slowDownRate ?? 0.5,
        dampRate: options?.dampRate ?? 2,
        momentum: options?.momentum ?? 5
    }

    // setup parameters
    const interval = 16;                                // 16 ms for roughly 60 FPS
    const steps = Math.ceil(options.time / interval);   // Number of steps for the animation

    // tell the user the position updated
    React.useEffect(()=>{
        if(!pos || !onPosUpdate) return;
        onPosUpdate(pos);
    }, [pos])

    // the function we use to update the position.
    const factor = (t: number) => options.slowDownRate * Math.exp(-options.dampRate*t) * Math.cos(options.momentum*t);

    // function for user to start the animation, starting with an inital position
    const start = (initPos: number) => {

        setIsDone(false);

        if (animationRef.current) {
            // Clear any ongoing animation
            clearTimeout(animationRef.current);
        }

        const diff = targetPos - initPos;   // Distance to cover
        stepIndexRef.current = 0;           // Reset step index

        // recursive function
        const animate = () => {
            const stepIndex = stepIndexRef.current;
            const t = (stepIndex / steps) * Math.PI;    // Map step to a value for `factor`

            // Compute new position using `factor` and set it
            const progress = 1 - factor(t);             // Progress as a value between 0 and 1 (1 at the start)
            setPos(initPos + (diff * progress));        // update the position

            if (stepIndex < steps) {
                stepIndexRef.current++;
                animationRef.current = setTimeout(animate, interval); // Schedule the next frame
            } else {
                setPos(targetPos);              // Ensure it snaps exactly to `targetPos` at the end
                setIsDone(true);                // Animation is done
                animationRef.current = null;
                if(onFinished) onFinished();
            }
        };

        animate();
    };

    // callback to cancel the animation
    const cancel = () => {
        if (animationRef.current) {
            clearTimeout(animationRef.current);
            animationRef.current = null;
        }
        setIsDone(true);
    };

    return { start, cancel, isDone };
};
