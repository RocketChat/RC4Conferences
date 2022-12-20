import { Button } from "react-bootstrap";
import { FaRocketchat } from "react-icons/fa";
import styles from "../../../../styles/Jitsi.module.css";

export const EventHeader = ({ eventData, open, setOpen }) => {
  const eventName = eventData?.data?.attributes?.name;
  const eventOrg = eventData?.data?.attributes?.["owner-name"];
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
      <Button
        style={{ marginRight: "1em" }}
        variant="light"
        onClick={() => setOpen(!open)}
      >
        <FaRocketchat color="red" size={20} />
      </Button>
    </div>
  );
};
