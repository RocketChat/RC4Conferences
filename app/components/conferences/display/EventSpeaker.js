import { useEffect, useState } from "react"
import { getEventSpeakers } from "../../../lib/conferences/eventCall"

export const EventSpeaker = ({eid}) => {
    const [speaker, setSpeaker] = useState(null)

    useEffect(() => {
        if (!speaker) {
            getSpeakers()
        }
    })
    const getSpeakers = async () => {
        const res = await getEventSpeakers(eid)
        setSpeaker(res.data)
        console.log("res speaker", res)
    }
    return (
        <div>
            Speakers for event
        </div>
    )
}