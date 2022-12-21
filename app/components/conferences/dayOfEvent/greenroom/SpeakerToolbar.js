import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Popover,
  Row,
} from "react-bootstrap";
import {
  BiCamera,
  BiCameraOff,
  BiMicrophone,
  BiMicrophoneOff,
} from "react-icons/bi";
import { FaDumpster, FaQuestionCircle, FaRocketchat } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { MdLiveTv, MdPeople, MdScreenShare, MdSettings } from "react-icons/md";
import styles from "../../../../styles/Jitsi.module.css";

const rtmpKey = process.env.NEXT_PUBLIC_ROCKET_CHAT_GREENROOM_RTMP;

export const SpeakerChatSet = ({ setOpen, open }) => {
  return (
    <div>
      <Button className={styles.gtoolbar_button} variant={"secondary"}>
        <FaQuestionCircle />
      </Button>
      <Button className={styles.gtoolbar_button} onClick={() => setOpen(!open)}>
        <FaRocketchat />
      </Button>
    </div>
  );
};

export const SpeakerMiscSet = ({ apiRef, isAdmin }) => {
  const [speakers, setSpeakers] = useState(null);
  const [isopen, setIsopen] = useState(false);
  const [join, setJoin] = useState(false);
  const feSpks = apiRef?.current?.getParticipantsInfo();

  useEffect(() => {
    const getCurrSpeakers = async () => {
      if (isopen && feSpks !== speakers) {
        setSpeakers(() => feSpks);
      }
      if (apiRef.current) {
        await apiRef.current.addEventListeners({
          videoConferenceJoined: handleJoin,
          videoConferenceLeft: handleJitsiParticipant,
          participantJoined: handleJitsiParticipant,
          participantKickedOut: handleJitsiParticipant,
          participantLeft: handleJitsiParticipant,
        });
      }
    };
    getCurrSpeakers();
  }, [apiRef.current, isopen]);

  const handleJitsiParticipant = () => {
    const feSpks = apiRef?.current?.getParticipantsInfo();
    setSpeakers(feSpks);
  };

  const handleJoin = () => {
    setJoin(true);
    // alert("joined")
    handleJitsiParticipant;
  };

  const handleStartStream = async () => {
    try {
      await apiRef.current.executeCommand("startRecording", {
        mode: "stream",
        rtmpStreamKey: rtmpKey,
        youtubeStreamKey: "",
      });
    } catch (e) {
      console.error("An error ocurred while starting sthe stream", e);
    }
  };

  const handleStopStream = async () => {
    try {
      await apiRef.current.stopRecording("stream");
    } catch (e) {
      console.error("An error ocurred while starting sthe stream", e);
    }
  };

  const handlePeopleShow = () => {
    setIsopen(!isopen);
  };

  const popoverStream = (
    <Popover id="popover-basic">
      <Popover.Header as={"summary"}>Stream Control</Popover.Header>
      <Popover.Body>
        {rtmpKey ? (
          <ListGroup as="ul">
            <ListGroup.Item as={"button"} onClick={handleStartStream}>
              Go Live!
            </ListGroup.Item>
            <ListGroup.Item as={"button"} onClick={handleStopStream}>
              End Broadcast!
            </ListGroup.Item>
          </ListGroup>
        ) : (
          "Please setup RTMP URI"
        )}
      </Popover.Body>
    </Popover>
  );

  const popoverPeople = (
    <Popover>
      <Popover.Header as={"summary"}>Speakers</Popover.Header>
      <Popover.Body>
        <ListGroup as="ul" variant={"flush"}>
          {Array.isArray(speakers) && speakers.length ? (
            speakers?.map((spk) => {
              return (
                <ListGroup.Item as={"small"} key={spk.participantId}>
                  {spk.formattedDisplayName}
                </ListGroup.Item>
              );
            })
          ) : (
            <ListGroup.Item disabled>
              The room is lonely, no one here
            </ListGroup.Item>
          )}
        </ListGroup>
      </Popover.Body>
    </Popover>
  );

  return join ? (
    <div className={styles.gtoolbar_button_set}>
      {isAdmin && (
        <div className={styles.gtoolbar_button_div}>
          <OverlayTrigger
            trigger="click"
            placement="top"
            overlay={popoverStream}
          >
            <Button title="Present Screen" variant="light">
              <MdLiveTv />
            </Button>
          </OverlayTrigger>
          <span style={{ fontSize: "65%" }}>Stream</span>
        </div>
      )}
      <div className={styles.gtoolbar_button_div}>
        <OverlayTrigger
          trigger="click"
          placement="top"
          overlay={popoverPeople}
        >
          <Button variant="light" onClick={handlePeopleShow}>
            <MdPeople />
          </Button>
        </OverlayTrigger>
        <span style={{ fontSize: "65%" }}>Speakers</span>
      </div>
      <div className={styles.gtoolbar_button_div}>
        <Button
          onClick={async () =>
            await apiRef.current.executeCommand("toggleShareScreen")
          }
          variant={"light"}
        >
          <MdScreenShare color={"#0d6efd"} />
        </Button>
        <span style={{ fontSize: "65%" }}>Present</span>
      </div>
    </div>
  ) : (
    <></>
  );
};

export const DeviceButtonSet = ({ apiRef }) => {
  const [mute, setMute] = useState(false);
  const [cammute, setCammute] = useState(false);
  const [devices, setDevices] = useState(null);
  const [currDev, setCurrDev] = useState({});

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devList = await apiRef.current.getAvailableDevices();
        const currdevList = await apiRef.current.getCurrentDevices();

        setDevices(devList);
        setCurrDev(currdevList);
      } catch (e) {
        console.error("Error while updating device list", e);
      }
    };
    getDevices();
  }, [apiRef.current]);

  const handleSelect = async (e) => {
    const devicetype = e.target.getAttribute("devicetype");

    try {
      if (devicetype === "audioInput") {
        await apiRef.current.setAudioInputDevice(e.target.name);
      }
      if (devicetype === "videoInput") {
        await apiRef.current.setVideoInputDevice(e.target.name);
      }
      setCurrDev({ ...currDev, [devicetype]: e.target.name });

      setTimeout(async () => {
        const devList = await apiRef.current.getCurrentDevices();
        setCurrDev(devList);
      }, 600);
    } catch (err) {
      console.error(
        `An error while changing ${e.target.getAttribute("devicetype")} device`,
        err
      );
    }
  };

  const showDevice = (deviceType) => {
    return (
      <ListGroup as={"ul"}>
        {devices[deviceType].map((edev) => {
          return (
            <ListGroup.Item
              as={"button"}
              devicetype={deviceType}
              key={edev.deviceId}
              name={edev.label}
              eventKey={edev.deviceId}
              onClick={handleSelect}
              active={edev.deviceId === currDev[deviceType]?.deviceId}
            >
              {edev.label}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  };

  const toggleDevice = async (e) => {
    if (e.target.getAttribute("name") === "audioInput") {
      await apiRef.current.executeCommand("toggleAudio");
      setMute(!mute);
    }
    if (e.target.getAttribute("name") === "videoInput") {
      await apiRef.current.executeCommand("toggleVideo");
      setCammute(!cammute);
    }
  };

  const popover = (
    <Popover id="popover-basic">
      <details>
        <Popover.Header as={"summary"}>Microphone Device</Popover.Header>
        <Popover.Body>
          {devices ? showDevice("audioInput") : "No devices found"}
        </Popover.Body>
      </details>
      <details>
        <Popover.Header as={"summary"}>Camera Device</Popover.Header>

        <Popover.Body>
          {devices ? showDevice("videoInput") : "No devices found"}
        </Popover.Body>
      </details>
    </Popover>
  );

  return (
    <div className={styles.gtoolbar_button_set}>
      <div className={styles.gtoolbar_button_div}>
        <Button variant="light" name={"videoInput"} onClick={toggleDevice}>
          {cammute ? (
            <BiCameraOff color={"#0d6efd"} name={"videoInput"} />
          ) : (
            <BiCamera color={"#0d6efd"} name={"videoInput"} />
          )}
        </Button>
        <span style={{ fontSize: "65%" }}>Camera</span>
      </div>
      <div className={styles.gtoolbar_button_div}>
        <OverlayTrigger trigger="click" placement="top" overlay={popover}>
          <Button variant="light">
            <FiSettings />
          </Button>
        </OverlayTrigger>
        <span style={{ fontSize: "65%" }}>Setting</span>
      </div>
      <div className={styles.gtoolbar_button_div}>
        <Button
          variant="light"
          title="Click to toogle audio"
          name={"audioInput"}
          onClick={toggleDevice}
        >
          {mute ? (
            <BiMicrophoneOff name={"audioInput"} color={"#0d6efd"} />
          ) : (
            <BiMicrophone name={"audioInput"} color={"#0d6efd"} />
          )}
        </Button>
        <span style={{ fontSize: "65%" }}>Mic</span>
      </div>
    </div>
  );
};

export const GreenRoomToolBar = ({ apiRef, isAdmin }) => {
  return (
    <div
      style={{
        background: "white",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <DeviceButtonSet apiRef={apiRef} />
      <SpeakerMiscSet apiRef={apiRef} isAdmin={isAdmin} />
      {/* <SpeakerChatSet /> */}
    </div>
  );
};

//Commented out an alternative recursive function, to be preserved for avoiding future wheel reinventing

// const changeDevice = async (
//   devList,
//   nextDevice,
//   deviceType,
//   currDevList,
//   currIndex,
//   nextDeviceInd
// ) => {
//   console.log("nextDeviceInd", nextDeviceInd, "currIndex", currIndex)
//   if (nextDeviceInd != currIndex) {
//     const t = await apiRef.current.setAudioInputDevice(
//       nextDevice.label,
//       nextDevice.deviceId
//     );
//     // setTimeout(async () => {
//     //   const changedCurrDevList = await apiRef.current.getCurrentDevices();
//     //   console.log("changedCurrDevList", changedCurrDevList[deviceType])
//     // }, 1);
//
//     if (
//       changedCurrDevList[deviceType].deviceId ===
//       currDevList[deviceType].deviceId
//     ) {

//       let tempNextDeviceInd = nextDeviceInd + 1;
//       let tempDevListLen = devList[deviceType].length;

//       if (tempNextDeviceInd >= tempDevListLen)
//         tempNextDeviceInd -= tempDevListLen;

//         let tempNext = devList[deviceType][tempNextDeviceInd];
//       console.log("checknextDevice", tempNext)
//       await changeDevice(
//         devList,
//         tempNext,
//         deviceType,
//         changedCurrDevList,
//         currIndex,
//         tempNextDeviceInd
//       );
//     }

//     else {
//       return;
//     }
//   }
//   else {
//     return
//   }
// };
