import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaRocketchat } from "react-icons/fa";
import styles from "../../../../styles/Jitsi.module.css";
import { verifyValidRCchat } from "../helper";

export const EventHeader = ({ eventData, open, setOpen }) => {
  const eventName = eventData?.data?.attributes?.name;
  const eventOrg = eventData?.data?.attributes?.["owner-name"];
  const validRCflag = verifyValidRCchat();

  const renderTooltip = (props) => (
    <Tooltip id="chat-error-tooltip" {...props}>
      {validRCflag.msg}
    </Tooltip>
  );

  return (
    <div className={styles.event_header}>
      <div className={styles.event_header_content}>
        <span className={styles.event_header_name}>
          {eventName ? eventName : "Event Name"}
        </span>
        <span className={styles.event_header_org}>
          {eventOrg ? eventOrg : "Org"}
        </span>
      </div>
      {validRCflag.valid ? (
        <Button
          style={{ marginRight: "1em" }}
          variant="light"
          onClick={() => setOpen(!open)}
        >
          <FaRocketchat color="red" size={20} />
        </Button>
      ) : (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <Button style={{ marginRight: "1em" }} variant="light">
            <FaRocketchat color="red" size={20} />
          </Button>
        </OverlayTrigger>
      )}
    </div>
  );
};
