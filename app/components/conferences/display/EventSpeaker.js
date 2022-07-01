import { useEffect, useState } from "react";
import { Button, Col, Collapse, Container, Image, Row } from "react-bootstrap";
import { getEventSpeakers } from "../../../lib/conferences/eventCall";
import styles from "../../../styles/event.module.css";

const avatarGenerate = (sn) => {
    const res = `https://ui-avatars.com/api/?name=${sn}&background=random&size=1080`
    return res
}

export const EventSpeaker = ({ eid }) => {
  const [speaker, setSpeaker] = useState(null);
  const [open, setOpen] = useState({});

  useEffect(async () => {
    if (!speaker) {
      await getSpeakers();
    }
  }, []);

  const getSpeakers = async () => {
    const res = await getEventSpeakers(eid);
    setSpeaker(res.data);
  };


  const handleBioOpen = (e) => {
    const tmod = e.target.id
    setOpen((prev) => ({
        ...prev,
        [tmod]: !open[tmod]
    }))
  }
  return (
    <div>
      {speaker &&
        speaker.data.map((spk) => {
          return (
            <Container key={spk.id} className="mb-3">
              <div className={styles.event_speaker_avatar}>
                <Image
                  width={100}
                  roundedCircle
                  src={spk.attributes["photo-url"] || avatarGenerate(spk.attributes.name)}
                  placeholder={avatarGenerate(spk.attributes.name)}
                />
              </div>

              <Row className={styles.speaker_intro}>
                <div className={styles.event_speaker_name}>
                  {spk.attributes.name}
                </div>
                <div className={styles.event_speaker_title}>
                  {spk.attributes.position}
                </div>
                <div className={styles.event_speaker_bio} >
                  {spk.attributes["short-biography"]}
                </div>
              </Row>
              <Row className={styles.speaker_intro}>
                <Col>
                  <Button
                  as={"span"}
                    variant="light"
                    size="sm"
                    id={spk.id}
                    onClick={handleBioOpen}
                  >
                    {`Learn More>`}
                  </Button>
                  <Collapse in={open[spk.id]}>
                    <div id="example-collapse-text">
                      {spk.attributes["long-biography"] || "Hey, looks like this fellow speaker likes surprises."}
                    </div>
                  </Collapse>
                </Col>
              </Row>
            </Container>
          );
        })}
    </div>
  );
};
