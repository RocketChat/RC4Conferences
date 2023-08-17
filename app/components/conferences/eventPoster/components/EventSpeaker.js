import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Collapse,
  Container,
  Image,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import styles from '../styles/index.module.css';

import { TiContacts } from 'react-icons/ti';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

const avatarGenerate = (sn) => {
  const res = `https://ui-avatars.com/api/?name=${sn}&background=random&size=1080`;
  return res;
};

export const SmEventSpeaker = ({ eid, speaker }) => {
  const [open, setOpen] = useState({});
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <Container>
        <Row>
          <ButtonGroup>
            {props.attributes.github && (
              <Button variant="link" href={props.attributes.github}>
                <FaGithub />
              </Button>
            )}
            {props.attributes.email && (
              <Button variant="link" href={`mailto:${props.attributes.email}`}>
                <FiMail />
              </Button>
            )}
            {props.attributes.twitter && (
              <Button variant="link" href={props.attributes.twitter}>
                <FaTwitter />
              </Button>
            )}
            {props.attributes.linkedin && (
              <Button variant="link" href={props.attributes.linkedin}>
                <FaLinkedin />
              </Button>
            )}
          </ButtonGroup>
        </Row>
      </Container>
    </Tooltip>
  );

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
                    spk.attributes['photo-url'] ||
                    avatarGenerate(spk.attributes.name)
                  }
                  placeholder={avatarGenerate(spk.attributes.name)}
                />
              </div>

              <Row className={styles.speaker_intro}>
                <div className={styles.event_speaker_name}>
                  {spk.attributes.name}
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip(spk)}
                  >
                    <Button size="sm" variant="link">
                      <TiContacts />
                    </Button>
                  </OverlayTrigger>
                </div>
                <div className={styles.event_speaker_title}>
                  {spk.attributes.position}
                </div>
                <div className={styles.event_speaker_bio}>
                  {spk.attributes['short-biography']}
                </div>
              </Row>
              <Row className={styles.speaker_intro}>
                <Col>
                  <Button
                    as={'span'}
                    variant="light"
                    size="sm"
                    id={spk.id}
                    onClick={handleBioOpen}
                    style={{ cursor: 'pointer' }}
                  >
                    {`Learn More>`}
                  </Button>
                  <Collapse in={open[spk.id]}>
                    <div id="example-collapse-text">
                      {spk.attributes['long-biography'] ||
                        'Hey, looks like this fellow speaker likes surprises.'}
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

export const MdEventSpeaker = ({ eid, speaker }) => {
  console.log("speaker is", speaker)
  const [open, setOpen] = useState({});
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <Container>
        <Row>
          <ButtonGroup>
            {props.attributes.github && (
              <Button variant="link" href={props.attributes.github}>
                <FaGithub />
              </Button>
            )}
            {props.attributes.email && (
              <Button variant="link" href={`mailto:${props.attributes.email}`}>
                <FiMail />
              </Button>
            )}
            {props.attributes.twitter && (
              <Button variant="link" href={props.attributes.twitter}>
                <FaTwitter />
              </Button>
            )}
            {props.attributes.linkedin && (
              <Button variant="link" href={props.attributes.linkedin}>
                <FaLinkedin />
              </Button>
            )}
          </ButtonGroup>
        </Row>
      </Container>
    </Tooltip>
  );

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
                <Col sm={3} md={2}>
                  <div className={styles.event_speaker_avatar}>
                    <Image
                      fluid
                      roundedCircle
                      src={
                        spk.attributes['photo-url'] ||
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
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 1000 }}
                          overlay={renderTooltip(spk)}
                        >
                          <Button size="sm" variant="link">
                            <TiContacts size={'20'} />
                          </Button>
                        </OverlayTrigger>
                      </Col>
                      <Col md="auto" className={styles.event_speaker_title}>
                        {spk.attributes.position}
                      </Col>
                    </Row>
                    <div className={styles.event_speaker_bio}>
                      {spk.attributes['short-biography']}
                      <Badge
                        pill
                        as={'span'}
                        text="dark"
                        bg="white"
                        id={spk.id}
                        onClick={handleBioOpen}
                        style={{ cursor: 'pointer' }}
                      >
                        {`Learn More>`}
                      </Badge>
                    </div>
                  </Row>
                  <Row>
                    <Col>
                      <Collapse in={open[spk.id]}>
                        <div
                          id="example-collapse-text"
                          className={styles.speaker_bio_expand}
                        >
                          {spk.attributes['long-biography'] ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: spk.attributes['long-biography'],
                              }}
                            />
                          ) : (
                            'Hey, looks like this fellow speaker likes surprises.'
                          )}
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
