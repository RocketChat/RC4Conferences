import React, { useState } from "react"
import axios from "axios"

export const EventButton = ({bg, margin}) => {
    const [joke, setJoke] = useState("")
    const handleClick = async () => {
        const res = await axios.get("https://api.chucknorris.io/jokes/random")
        try {
            console.log("res", res)
            setJoke(res.data.value)
        }
        catch(e) {
            console.error("Package error", e)
        }
    }
    return (
        <div>
        <button onClick={handleClick} style={{backgroundColor: bg, margin: margin}} type="warning">
            Event, Click!
        </button>
        <p>
            {joke}
        </p>
        </div>
        
    )
}