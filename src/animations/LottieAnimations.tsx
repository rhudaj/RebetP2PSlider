import Lottie from "lottie-react";
import glowingCircle from "./AnimatedAssets/glowing_circle.json"; // Adjust the path as needed
import glowingLeftArrows from "./AnimatedAssets/glowing_left_arrows.json"; // Adjust the path as needed

/**
 * Lottie animation component for a growing circle animation.
 */
export function GlowingCircle() {
    return (
        <Lottie
            animationData={glowingCircle}
            loop={true}
            style={{transform: "translateY(3%) scale(2.4)"}}
        />
    )
}

/**
 * Lottie animation component for a glowing arrows
 * @param isLeft sets the orientation of the arrows.
 */
export function GlowingArrows(props: {isLeft: boolean}) {
    // flip the orientation if `isLeft` is false
    const style = { transform: `scale(${2 * (props.isLeft?1:-1)})` }
    return (
        <Lottie
            className="glowing-arrows"
            animationData={glowingLeftArrows}
            loop={true}
            style={style}
        />
    )
}
