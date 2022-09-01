import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
  Row,
} from "react-bootstrap";
import {
  BiCamera,
  BiCameraOff,
  BiMicrophone,
  BiMicrophoneOff,
} from "react-icons/bi";
import { FaQuestionCircle, FaRocketchat } from "react-icons/fa";
import { MdLiveTv, MdPeople, MdScreenShare, MdSettings } from "react-icons/md";
import styles from "../../../../styles/event.module.css";

const rtmpKey = process.env.NEXT_PUBLIC_ROCKET_CHAT_GREENROOM_RTMP;

export const SpeakerChatToolbar = ({ setOpen, open }) => {
  return (
    <ButtonGroup size={"sm"}>
      <Button variant={"secondary"}>
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

export const SpeakerMiscToolbar = ({ apiRef, isAdmin }) => {
  const [speakers, setSpeakers] = useState(null);
  const [isopen, setIsopen] = useState(false);
  const feSpks = apiRef?.current?.getParticipantsInfo();
  useEffect(() => {
    const getCurrSpeakers = async () => {
      if (isopen && feSpks !== speakers) {
        setSpeakers(() => feSpks);
      }
      if (apiRef.current) {
        await apiRef.current.addEventListeners({
          videoConferenceJoined: handleJitsiParticipant,
          videoConferenceLeft: handleJitsiParticipant,
          participantJoined: handleJitsiParticipant,
          participantKickedOut: handleJitsiParticipant,
          participantLeft: handleJitsiParticipant,
        });
      }
    };
    getCurrSpeakers();
  }, [apiRef.current]);

  const handleJitsiParticipant = () => {
    const feSpks = apiRef?.current?.getParticipantsInfo();
    setSpeakers(feSpks);
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
  return apiRef.current ? (
    <ButtonGroup size={"sm"}>
      {isAdmin && (
        <DropdownButton
          as={ButtonGroup}
          title={<MdLiveTv size={20} />}
          drop={"up"}
        >
          <Dropdown.Item as={"button"} onClick={handleStartStream}>
            Go Live!
          </Dropdown.Item>
          <Dropdown.Item as={"button"} onClick={handleStopStream}>
            End Broadcast
          </Dropdown.Item>
        </DropdownButton>
      )}
      <DropdownButton
        as={ButtonGroup}
        title={<MdPeople size={20} />}
        drop={"up"}
        onClick={handlePeopleShow}
      >
        <Container
          style={{ overflow: "auto", maxHeight: "50vh", maxWidth: "50vw" }}
        >
          <Row>
            <Dropdown.Header>Speakers</Dropdown.Header>
            {Array.isArray(speakers) && speakers.length ? (
              speakers?.map((spk) => {
                return (
                  <Dropdown.ItemText key={spk.participantId}>
                    {spk.formattedDisplayName}
                  </Dropdown.ItemText>
                );
              })
            ) : (
              <Dropdown.Item disabled>
                The room is lonely, no one here
              </Dropdown.Item>
            )}
          </Row>
        </Container>
      </DropdownButton>
      <Button
        onClick={async () =>
          await apiRef.current.executeCommand("toggleShareScreen")
        }
      >
        <MdScreenShare size={20} />
        <div className={styles.greenroom_button_text}>Present</div>
      </Button>
    </ButtonGroup>
  ) : (
    <></>
  );
};

export const GreenRoomTool = ({ apiRef }) => {
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
    return devices[deviceType].map((edev) => {
      return (
        <Dropdown.Item
          as={"button"}
          devicetype={deviceType}
          key={edev.deviceId}
          name={edev.label}
          eventKey={edev.deviceId}
          onClick={handleSelect}
          active={edev.deviceId === currDev[deviceType]?.deviceId}
        >
          {edev.label}
        </Dropdown.Item>
      );
    });
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

  return (
    <div className={styles.deviceButton}>
      <ButtonGroup size={"lg"} className="m-auto">
        <Button
          variant="success"
          title="Click to toogle audio"
          name={"audioInput"}
          onClick={toggleDevice}
        >
          {mute ? (
            <BiMicrophoneOff name={"audioInput"} onClick={toggleDevice} />
          ) : (
            <BiMicrophone name={"audioInput"} onClick={() => toggleDevice} />
          )}
        </Button>
        <Button color="#f5455c" name={"videoInput"} onClick={toggleDevice}>
          {cammute ? (
            <BiCameraOff name={"videoInput"} onClick={toggleDevice} />
          ) : (
            <BiCamera name={"videoInput"} onClick={() => toggleDevice} />
          )}
        </Button>

        <DropdownButton
          as={ButtonGroup}
          title={<MdSettings />}
          autoClose="outside"
          variant={"secondary"}
          id="bg-nested-dropdown"
        >
          <div style={{ overflowY: "scroll", height: "30vh" }}>
            <Dropdown.Header>Microphone</Dropdown.Header>
            {devices ? showDevice("audioInput") : "No devices found"}
            <Dropdown.Divider></Dropdown.Divider>
            <Dropdown.Header>Camera</Dropdown.Header>
            {devices ? showDevice("videoInput") : "No devices found"}
          </div>
        </DropdownButton>
      </ButtonGroup>
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
