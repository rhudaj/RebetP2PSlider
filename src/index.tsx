// STYLES
import "./styles.sass";
// Other Imports
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Slider from "./slider/slider";
import { GlowingCircle, GlowingLeftArrows, GlowingRightArrows} from "./animations/Animations";

function App() {

    const [msg, setMsg] = useState("");

    const onSlideLeft = () => {
        setMsg("Slid all the way Left!");
    }

    const onSlideRight = () => {
        setMsg("Slid all the way Right!");
    }

    return (
        <div id="App">
            <GlowingCircle/>
            <div className="message">{msg}</div>
            <Slider onSlideLeft={onSlideLeft} onSlideRight={onSlideRight}/>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
