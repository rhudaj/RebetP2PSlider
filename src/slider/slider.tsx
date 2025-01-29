import React from "react"
import "./slider.sass"
import { GlowingCircle, GlowingArrows } from "../animations/LottieAnimations";
import { useSnapBack } from "../animations/snapBack";
import ColorSchemes from "./colorSchemes";

const asset_folder = "StaticAssets"; // relative to public/

/**
 * Wrapper for a "StaticAsset" (an image in /public/StaticAssets)
 * @param subFolder the folder within `asset_folder`
 * @param color the specific color (e.g. 'orange')
 * @param flip if we want to flip the image horizontally
 * @returns container that wraps an image
 */
const StaticAsset = (props: {subFolder: string, color: string, id?: string, flip?: boolean}) => {
    // get the path to find the asset:
    const src = `${asset_folder}/${props.subFolder}/${props.color}.png`;
    const style = props.flip ? {transform: "scaleX(-1)"} : null;
    return (
        <div className="image-container" id={props.id}>
            <img draggable={false} src={src} style={style}/>
        </div>
    )
};

const CENTER = 50;  // percent out of "100% of the width"

/**
 * Slider component
 * @param onSlideLeft handles the case where the slider goes all the way left
 * @param onSlideLeft handles the case where the slider goes all the way right
 */
function Slider(props: {
    onSlideLeft?: () => void;
    onSlideRight?: () => void;
}) {

    // ---------------------- STATE ----------------------

    const [orbPos, setOrbPos] = React.useState<number>(CENTER); // Percentage position (50 = center)
    const [isDrag, setIsDrag] = React.useState<boolean>(false); // wether/not the orb is being dragged by the user

    // References so that we can keep track of boundingRect size
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const orbRef = React.useRef<HTMLDivElement>(null);

    // A custom animation that snaps back the orb to CENTER pos
    const snapbackAnimation = useSnapBack(
        CENTER,                 // Snap back to center (50%)
        undefined,              // no options (use defaults)
        setOrbPos,              // called when position updates
        () => setIsDrag(false)  // called when the animation is done
    );

    // ---------------------- CONTROLS ----------------------

    const handleDragStart = (e: React.MouseEvent) => {
        // cancel the animation if not done
        if (!snapbackAnimation.isDone) {
            snapbackAnimation.cancel()
        }
        setIsDrag(true);
    };

    const handleDragEnd = () => {
        snapbackAnimation.start(orbPos);
        setIsDrag(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrag || !sliderRef.current || !orbRef.current) return;

        // Calculate new position as percentage relative to the slider's width
        const bounds = sliderRef.current.getBoundingClientRect();
        let newLeft = ((e.clientX - bounds.left) / bounds.width) * 100;

        // Clamp position between 0% and 100%
        // Also, if we've hit an edge, report back to the parent (if specified)
        if (newLeft < 0) {
            newLeft = 0;
            props.onSlideLeft?.();
        } else if (newLeft > 100) {
            newLeft = 100;
            props.onSlideRight?.();
        }

        setOrbPos(newLeft);
    };

    // ------------------------ VIEW -------------------------

    // The color scheme for styling depends on which side the orb lies
    const colorScheme =
        (!isDrag || orbPos === CENTER) ? "orange" :
        orbPos < CENTER ? "red" : "green"

    const CurStyles = ColorSchemes[colorScheme];

    // Wether we show Static/Animated assets depends on `isDrag`
    const Assets = {
        // Default items (don't depend on `isDrag` status):
        check: <StaticAsset id="check-img" subFolder='check' color={colorScheme==='orange'?'white':colorScheme} />,
        close: <StaticAsset id="close-img" subFolder='close' color={colorScheme==='orange'?'white':colorScheme}/>,
        // Assets that depend on `isDrag` status for being static/animated:
        ...(isDrag ? {
            // use static assets
            orb: <StaticAsset id="orb-img" subFolder='slider_circle' color={colorScheme}/>,
            arrows: (
                <>
                <StaticAsset id="left-arrows-img" subFolder='left_arrows' color={colorScheme}/>
                <StaticAsset id="right-arrows-img" subFolder='left_arrows' color={colorScheme} flip={true}/>
                </>
            )
        } : {
            // use animations
            orb: <GlowingCircle/>,
            arrows: (
                <>
                <GlowingArrows isLeft={true}/>
                <GlowingArrows isLeft={false}/>
                </>
            )
        })
    };

    return (
        <div
            id="slider-div"
            ref={sliderRef} // Use to keep track of the
            style={{
                backgroundImage: `linear-gradient(to bottom, ${CurStyles.sliderDark}, ${CurStyles.sliderLight}`,
                borderColor:  CurStyles.sliderBorderLight,
                color: CurStyles.text,
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
        >
            {/* div for the background gradient (replaces ::after) */}
            <span id="slider-border" style={{backgroundImage: `linear-gradient(to right, ${CurStyles.sliderBorderLight}, ${CurStyles.sliderBorderDark}, ${CurStyles.sliderBorderLight})`}}/>

            {/* the draggable orb (relative to parent div) */}
            <div
                id="orb"
                ref={orbRef}
                style={{left: `${orbPos}%`,}}
                onMouseDown={handleDragStart}
            >
                {Assets.orb}
            </div>

            {/* The rest are items that fit in the div layout */}

            <div id="lhs">
                {Assets.check}
                <div className="text">Decline</div>
            </div>

            {Assets.arrows}

            <div id="rhs">
                {Assets.close}
                <div className="text">Accept</div>
            </div>
        </div>
    );
}

export default Slider;