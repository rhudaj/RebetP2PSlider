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


const CENTER = 50;

export default function Slider(props: {
    onSlideLeft?: ()=>void,
    onSlideRight?: ()=>void,
}) {

    const [orbPos, setOrbPos] = useState<number>(0);
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const [side, setSide] = useState<number>(0); // 0 => center, -1 => left, +1 => right
    const [dragOffset, setDragOffset] = useState<number>(0); // Offset between cursor and orb's position

    const [orbWidth, setOrbWidth] = useState<number>(0);

    const sliderRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);

    const snapbackAnimation = useSnapBack(CENTER, 1000, setOrbPos, ()=>setIsDrag(false));

    useEffect(()=>{
        const orbRect = orbRef.current.getBoundingClientRect();
        setOrbWidth(orbRect.right - orbRect.left);
    }, [orbRef])

    useEffect(()=>{
        const bounds = sliderRef.current.getBoundingClientRect();
        const W = bounds.right - bounds.left
        const center = (W - orbWidth) / 2
        const center_pct = center / W
        console.log(`W = ${W}, orbWidth = ${orbWidth} => orbWidth/W = ${orbWidth/W} => center_pct = ${center_pct}`);
        setOrbPos(center_pct * 100)
    }, [orbWidth])

    useEffect(()=>{
        if(!isDrag) return;
        setSide( orbPos < CENTER ? -1 : 1 )
    }, [orbPos]);

    const handleDragStart = (e: MouseEvent) => {
        console.log("drag START")
        setIsDrag(true);
        // Calculate the offset between the cursor and the orb's left edge
        const orbRect = orbRef.current.getBoundingClientRect();
        const offset = e.clientX - orbRect.left;
        setDragOffset(offset);
    };

    const handleDragEnd = (e: MouseEvent) => {
        snapbackAnimation.start(orbPos);
        setSide(0);
        setIsDrag(false);
    };

    const handleDrag = (e: MouseEvent) => {

        if(!isDrag) return;

        const bounds = sliderRef.current.getBoundingClientRect();

        let newLeft = e.clientX - bounds.left - dragOffset;

        // Clamp the position within the slider's boundaries
        const min_x = 0;
        const max_x = bounds.width - orbWidth;
        if (newLeft < min_x) {
            newLeft = min_x;
            // Call the callback
            props.onSlideLeft?.();
        } else if (newLeft > max_x) {
            newLeft = max_x;
            props.onSlideRight?.();
        }

        // Set position as a percentage
        setOrbPos(newLeft / bounds.width * 100);
    };


    // The styling depends on the side the orb lies.
    const Styles = (side===-1) ? {
        slider_class: "lhs-active",
        orb_color: "green",
        close_color: "green",
        check_color: "green",
    } : (side === 1) ? {
        slider_class: "rhs-active",
        orb_color: "red",
        close_color: "red",
        check_color: "red",
    } : {
        slider_class: "",
        orb_color: "orange",
        close_color: "white",
        check_color: "white",
    }

    return (
        <div
            id="slider"
            className={Styles.slider_class}
            ref={sliderRef}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={()=>setIsDrag(false)}
        >
            <div
                id="drag-orb"
                ref={orbRef}
                onMouseDown={handleDragStart}
                style={{left: `${orbPos}%`}}
            >
                <ImageContainer id="orb-img" src={`StaticAssets/${Styles.orb_color}_button.png`}/>
            </div>
            <div id="slider-sides">
                <div className="lhs">
                    <ImageContainer src={`StaticAssets/${Styles.close_color}_close.png`}/>
                    <div className="text">Decline</div>
                </div>
                <GlowingLeftArrows/>
                <GlowingRightArrows/>
                <div className="rhs">
                    <ImageContainer src={`StaticAssets/${Styles.check_color}_check.png`}/>
                    <div className="text">Accept</div>
                </div>
            </div>
        </div>
    )
};