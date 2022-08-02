import { Button, ButtonGroup } from "react-bootstrap";
import { FaQuestionCircle, FaRocketchat } from "react-icons/fa";
import { MdScreenShare } from "react-icons/md";
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

export const SpeakerMiscToolbar = ({apiRef}) => {
    return(
        <ButtonGroup size={"sm"}>
            {apiRef.current && <Button onClick={async () => await apiRef.current.executeCommand('toggleShareScreen')}>
                <MdScreenShare size={20} />
                <div className={styles.greenroom_button_text}>Present</div>
            </Button>}
        </ButtonGroup>
    )
}
