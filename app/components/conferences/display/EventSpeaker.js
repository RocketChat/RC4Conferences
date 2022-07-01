import { useEffect, useState } from "react"
import { Col, Container, Image, Row } from "react-bootstrap"
import { getEventSpeakers } from "../../../lib/conferences/eventCall"

export const EventSpeaker = ({eid}) => {
    const [speaker, setSpeaker] = useState(null)

    useEffect(async () => {
        if (!speaker) {
            await getSpeakers()
        }
    }, [])

    const getSpeakers = async () => {
        const res = await getEventSpeakers(eid)
        setSpeaker(res.data)
        console.log("res speaker", res)
    }
    return (
        <div>
            {
                speaker && speaker.data.map(spk => {
                    return (
                    <Container>
                        <Row >
                            <p>{spk.attributes.name}</p>

                        </Row>
                        <Row xs={1}>
                        <Image width={10} roundedCircle src={spk.attributes["photo-url"]} />

                        </Row>
                    </Container>
                    )
                    
                })
            }
        </div>
    )
}