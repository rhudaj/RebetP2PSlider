import "./GlowingCircle.sass"
import Lottie from "lottie-react";
import glowingCircle from "./AnimatedAssets/glowing_circle.json"; // Adjust the path as needed
import glowingLeftArrows from "./AnimatedAssets/glowing_left_arrows.json"; // Adjust the path as needed
import glowingRightArrows from "./AnimatedAssets/glowing_right_arrows.json"; // Adjust the path as needed



export function GlowingCircle() {
    return (
        <Lottie id="glowing-circle" className="lottie-div" animationData={glowingCircle} loop={true} />
    );
}


export function GlowingLeftArrows() {
    return (
        <Lottie className="glowing-arrows" animationData={glowingLeftArrows} loop={true} />
    );
}


export function GlowingRightArrows() {
    return (
        <Lottie className="glowing-arrows" animationData={glowingRightArrows} loop={true} />
    );
}
