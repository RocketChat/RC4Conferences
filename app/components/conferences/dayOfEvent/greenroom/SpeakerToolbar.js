import { Button, ButtonGroup } from "react-bootstrap";
import { FaQuestionCircle, FaRocketchat } from "react-icons/fa";
import styles from "../../../../styles/event.module.css";

export const SpeakerChatToolbar = ({ setOpen, open }) => {
  return (
    <ButtonGroup size={"sm"}>
      <Button>
        <FaQuestionCircle />
        <div className={styles.greenroom_button_text}>Question</div>
      </Button>
      <Button onClick={() => setOpen(!open)}>
        <FaRocketchat />
        <div className={styles.greenroom_button_text}>Chat</div>
      </Button>
    </ButtonGroup>
  );
};
