import Cookies from 'js-cookie';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaRocketchat } from 'react-icons/fa';
import styles from '../../../../styles/Jitsi.module.css';
import { verifyValidRCchat } from '../helper';

export const EventHeader = ({ eventData, open, setOpen }) => {
  const eventName = eventData?.data?.name;
  const eventOrg = eventData?.data?.['owner-name'];
  const validRCflag = verifyValidRCchat();

  const handleOpen = () => {
    const hashmail = Cookies.get('hashmail');
    if (hashmail) {
      validRCflag = { valid: true, msg: 'Open Chat' };
      setOpen(!open);
    } else {
      alert('Please login to open chat, at the top right corner');
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="chat-error-tooltip" {...props}>
      {validRCflag.msg}
    </Tooltip>
  );

  return (
    <div className={styles.event_header}>
      <div className={styles.event_header_content}>
        <span className={styles.event_header_name}>
          {eventName ? eventName : 'Event Name'}
        </span>
        <span className={styles.event_header_org}>
          {eventOrg ? eventOrg : 'Org'}
        </span>
      </div>
      {validRCflag.valid ? (
        <Button
          style={{ marginRight: '1em' }}
          variant="light"
          onClick={handleOpen}
        >
          <FaRocketchat color="red" size={20} />
        </Button>
      ) : (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <Button style={{ marginRight: '1em' }} variant="light">
            <FaRocketchat color="red" size={20} />
          </Button>
        </OverlayTrigger>
      )}
    </div>
  );
};
