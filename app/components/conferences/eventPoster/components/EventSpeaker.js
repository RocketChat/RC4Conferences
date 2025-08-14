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
            {props.github && (
              <Button variant="link" href={props.github}>
                <FaGithub />
              </Button>
            )}
            {props.email && (
              <Button variant="link" href={`mailto:${props.email}`}>
                <FiMail />
              </Button>
            )}
            {props.twitter && (
              <Button variant="link" href={props.twitter}>
                <FaTwitter />
              </Button>
            )}
            {props.linkedin && (
              <Button variant="link" href={props.linkedin}>
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
                  src={spk['photo_url'] || avatarGenerate(spk.name)}
                  placeholder={avatarGenerate(spk.name)}
                />
              </div>

              <Row className={styles.speaker_intro}>
                <div className={styles.event_speaker_name}>
                  {spk.name}
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
                <div className={styles.event_speaker_title}>{spk.position}</div>
                <div className={styles.event_speaker_bio}>
                  {spk['short_biography']}
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
                      {spk['long_biography'] ||
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
  const [open, setOpen] = useState({});
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <Container>
        <Row>
          <ButtonGroup>
            {props.github && (
              <Button variant="link" href={props.github}>
                <FaGithub />
              </Button>
            )}
            {props.email && (
              <Button variant="link" href={`mailto:${props.email}`}>
                <FiMail />
              </Button>
            )}
            {props.twitter && (
              <Button variant="link" href={props.twitter}>
                <FaTwitter />
              </Button>
            )}
            {props.linkedin && (
              <Button variant="link" href={props.linkedin}>
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
                      className={styles.profile_img}
                      src={spk['photo_url'] || avatarGenerate(spk.name)}
                      placeholder={avatarGenerate(spk.name)}
                    />
                  </div>
                </Col>
                <Col>
                  <Row>
                    <Row className={styles.speaker_intro}>
                      <Col md="auto" className={styles.event_speaker_name}>
                        {spk.name}
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
                        {spk.position}
                      </Col>
                    </Row>
                    <div className={styles.event_speaker_bio}>
                      {spk['short_biography']}
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
                          {spk['long_biography'] ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: spk['long_biography'],
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
