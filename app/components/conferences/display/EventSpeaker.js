import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Collapse,
  Container,
  Image,
  Row,
} from "react-bootstrap";
import { getEventSpeakers } from "../../../lib/conferences/eventCall";
import styles from "../../../styles/event.module.css";
import { useMediaQuery } from "@rocket.chat/fuselage-hooks";

const avatarGenerate = (sn) => {
  const res = `https://ui-avatars.com/api/?name=${sn}&background=random&size=1080`;
  return res;
};

export const SmEventSpeaker = ({ eid }) => {
  const [speaker, setSpeaker] = useState(null);
  const [open, setOpen] = useState({});

  useEffect(() => {
    const fetchSpeakers = async () => {
      if (!speaker) {
        await getSpeakers();
      }
    };
    fetchSpeakers();
  }, []);

  const getSpeakers = async () => {
    const res = await getEventSpeakers(eid);
    setSpeaker(res);
  };

  const handleBioOpen = (e) => {
    const tmod = e.target.id;
    setOpen((prev) => ({
      ...prev,
      [tmod]: !open[tmod],
    }));
  };
  return (
    <div>
      {speaker &&
        speaker.data.map((spk) => {
          return (
            <Container key={spk.id} className="mb-3">
              <div className={styles.event_speaker_avatar}>
                <Image
                  width={70}
                  roundedCircle
                  src={
                    spk.attributes["photo-url"] ||
                    avatarGenerate(spk.attributes.name)
                  }
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
                <div className={styles.event_speaker_bio}>
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
                      {spk.attributes["long-biography"] ||
                        "Hey, looks like this fellow speaker likes surprises."}
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

export const MdEventSpeaker = ({ eid }) => {
  const [speaker, setSpeaker] = useState(null);
  const [open, setOpen] = useState({});

  useEffect(() => {
    const fetchSpeakers = async () => {
      if (!speaker) {
        await getSpeakers();
      }
    };
    fetchSpeakers();
  }, []);

  const getSpeakers = async () => {
    const res = await getEventSpeakers(eid);
    setSpeaker(res);
  };

  const handleBioOpen = (e) => {
    const tmod = e.target.id;
    setOpen((prev) => ({
      ...prev,
      [tmod]: !open[tmod],
    }));
  };
  return (
    <div>
      {speaker &&
        speaker.data.map((spk) => {
          return (
            <Container key={spk.id} className="mb-3">
              <Row className={styles.event_speaker_row}>
                <Col sm={2} md={2}>
                  <div className={styles.event_speaker_avatar}>
                    <Image
                      fluid
                      roundedCircle
                      src={
                        spk.attributes["photo-url"] ||
                        avatarGenerate(spk.attributes.name)
                      }
                      placeholder={avatarGenerate(spk.attributes.name)}
                    />
                  </div>
                </Col>
                <Col>
                  <Row>
                    <Row className={styles.speaker_intro}>
                      <Col md="auto" className={styles.event_speaker_name}>
                        {spk.attributes.name}
                      </Col>
                      <Col md="auto" className={styles.event_speaker_title}>
                        {spk.attributes.position}
                      </Col>
                    </Row>
                    <div className={styles.event_speaker_bio}>
                      {spk.attributes["short-biography"]}
                      <Badge
                        pill
                        as={"span"}
                        text="dark"
                        bg="white"
                        id={spk.id}
                        onClick={handleBioOpen}
                      >
                        {`Learn More>`}
                      </Badge>
                    </div>
                  </Row>
                  <Row>
                    <Col>
                      <Collapse in={open[spk.id]}>
                        <div id="example-collapse-text">
                          {spk.attributes["long-biography"] ||
                            "Hey, looks like this fellow speaker likes surprises."}
                        </div>
                      </Collapse>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          );
        })}
    </div>
  );
};
