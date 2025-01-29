import "./GlowingCircle.sass"
import Lottie from "lottie-react";
import glowingCircle from "./AnimatedAssets/glowing_circle.json"; // Adjust the path as needed
import glowingLeftArrows from "./AnimatedAssets/glowing_left_arrows.json"; // Adjust the path as needed
import glowingRightArrows from "./AnimatedAssets/glowing_right_arrows.json"; // Adjust the path as needed



export function GlowingCircle() {
    return (
        <div className="glow-container">
            <svg className="svg-glow" width="250" height="250" viewBox="0 0 250 250">
                <defs>
                    <radialGradient id="glow-gradient">
                        <stop offset="0%" stopColor="rgba(255,140,0,0.8)" />
                        <stop offset="70%" stopColor="rgba(255,140,0,0)" />
                    </radialGradient>
                </defs>
                <circle cx="125" cy="125" r="100" fill="url(#glow-gradient)" filter="blur(20px)" />
            </svg>
            <Lottie
                id="glowing-circle"
                className="lottie-div"
                animationData={glowingCircle}
                loop={true}
            />
        </div>
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
