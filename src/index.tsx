// STYLES
import "./index.sass";
// Other Imports
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Slider from "./slider/slider";

const RESET_MSG_WAIT = 2000;

/**
 * The root div. Displays the slider and checks for the slider's state
 * which can result in a displayed message.
 * @returns
 */
function App() {

    // STATE

    const [msg, setMsg] = useState("");

    // CONTROLS

    const onSlideLeft = () => {
        setMsg("Slid all the way Left!");
        // display the message temporarily
        setTimeout(()=>setMsg(""), RESET_MSG_WAIT);
    }

    const onSlideRight = () => {
        setMsg("Slid all the way Right!");
        // display the message temporarily
        setTimeout(()=>setMsg(""), RESET_MSG_WAIT);
    }

    // VIEW

    return (
        <div id="App">
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
