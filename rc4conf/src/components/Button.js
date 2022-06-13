import React from "react"

export const EventButton = ({bg, margin}) => {
    return (
        <button style={{backgroundColor: bg, margin: margin}} type="warning">
            Event, Click!
        </button>
    )
}