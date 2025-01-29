import { MouseEvent, useEffect, useRef, useState } from "react"
import "./slider.sass"
import { GlowingCircle, GlowingLeftArrows, GlowingRightArrows } from "../animations/Animations";

const useSnapBack = (
    targetPos: number,
    time?: number,
    onPosUpdate?: (pos: number)=>void,
    onFinished?: ()=>void,
) => {

    const [pos, setPos] = useState(null);

    time = time ?? 1000; // Default to 50 ms
    const interval = 16; // 16 ms for roughly 60 FPS
    const steps = Math.ceil(time / interval); // Number of steps for the animation
    const stepIndexRef = useRef(0); // To track the current step
    const animationRef = useRef(null); // For clearing animation when necessary

    const SLOW_DOWN = 0.5;
    const DAMP_RATE = 2;
    const MOMENTUM = 5;

    useEffect(()=>{
        if(!pos) return;
        onPosUpdate(pos);
    }, [pos])

    const factor = (t: number) => SLOW_DOWN * Math.exp(-DAMP_RATE*t) * Math.cos(MOMENTUM*t);

    const start = (initPos: number) => {

        if (animationRef.current) {
            clearTimeout(animationRef.current); // Clear any ongoing animation
        }

        const diff = targetPos - initPos; // Distance to cover
        stepIndexRef.current = 0; // Reset step index

        let prev = initPos;

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
                prev = newPos;
            } else {
                setPos(targetPos); // Ensure it snaps exactly to `targetPos` at the end
                animationRef.current = null;
                onFinished();
            }
        };

        animate();
    };

    return { start };
};

const ImageContainer = (props: {src: string, id?: string}) => (
    <div className="image-container" id={props.id}>
        <img draggable={false} src={props.src}></img>
    </div>
);

export default function Slider(props: {
    onSlideLeft?: () => void;
    onSlideRight?: () => void;
}) {
    const [orbPos, setOrbPos] = useState<number>(50); // Percentage position (50 = center)
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const [side, setSide] = useState<number>(0); // -1 = left, 1 = right, 0 = center

    const sliderRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);

    const snapbackAnimation = useSnapBack(50, 1000, setOrbPos, () => setIsDrag(false)); // Snap back to center (50%)

    useEffect(() => {
        if (!isDrag) return;
        setSide(orbPos < 50 ? -1 : 1);
    }, [orbPos]);

    const handleDragStart = (e: MouseEvent) => {
        console.log("drag START");
        setIsDrag(true);
    };

    const handleDragEnd = () => {
        snapbackAnimation.start(orbPos);
        setSide(0);
        setIsDrag(false);
    };

    const handleDrag = (e: MouseEvent) => {
        if (!isDrag || !sliderRef.current || !orbRef.current) return;

        // Calculate new position as percentage relative to the slider's width
        const bounds = sliderRef.current.getBoundingClientRect();
        let newLeft = ((e.clientX - bounds.left) / bounds.width) * 100;

        // Clamp position between 0% and 100%
        if (newLeft < 0) {
            newLeft = 0;
            props.onSlideLeft?.();
        } else if (newLeft > 100) {
            newLeft = 100;
            props.onSlideRight?.();
        }

        setOrbPos(newLeft);
    };

    // The styling depends on the side the orb lies
    const Styles =
        side === -1
            ? {
                  slider_class: "lhs-active",
                  orb_color: "green",
                  close_color: "green",
                  check_color: "green",
              }
            : side === 1
            ? {
                  slider_class: "rhs-active",
                  orb_color: "red",
                  close_color: "red",
                  check_color: "red",
              }
            : {
                  slider_class: "",
                  orb_color: "orange",
                  close_color: "white",
                  check_color: "white",
              };

    return (
        <div
            id="slider"
            className={Styles.slider_class}
            ref={sliderRef}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => setIsDrag(false)}
        >
            <div
                id="drag-orb"
                ref={orbRef}
                onMouseDown={handleDragStart}
                style={{ left: `${orbPos}%`, transform: "translate(-50%)" }}
            >
                <ImageContainer
                    id="orb-img"
                    src={`StaticAssets/${Styles.orb_color}_button.png`}
                />
            </div>
            <div id="slider-sides">
                <div className="lhs">
                    <ImageContainer
                        src={`StaticAssets/${Styles.close_color}_close.png`}
                    />
                    <div className="text">Decline</div>
                </div>
                <GlowingLeftArrows />
                <GlowingRightArrows />
                <div className="rhs">
                    <ImageContainer
                        src={`StaticAssets/${Styles.check_color}_check.png`}
                    />
                    <div className="text">Accept</div>
                </div>
            </div>
        </div>
    );
}
