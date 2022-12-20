import dynamic from "next/dynamic";
import { useState } from "react";

const RCComponent = dynamic(
  () => import("rc-component-react").then((mod) => mod.RCComponent),
  { ssr: false }
);

export const RCdesktopChat = ({ open, setOpen }) => {
  return (
    <>
      {open ? (
        <RCComponent
          moreOpts={true}
          isClosable={true}
          setClosableState={setOpen}
          width="auto"
          height={"55vh"}
          GOOGLE_CLIENT_ID={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          host={process.env.NEXT_PUBLIC_RC_URL}
          roomId={
            process.env.NEXT_PUBLIC_RC_ROOM_ID
              ? process.env.NEXT_PUBLIC_RC_ROOM_ID
              : "GENERAL"
          }
          channelName="General"
          anonymousMode={true}
          isFullScreenFromStart={false}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export const RCmobileChat = () => {
  const [open, setOpen] = useState(false);
  return (
    <RCComponent
      moreOpts={true}
      isClosable={true}
      setClosableState={setOpen}
      width="auto"
      height={"30vh"}
      GOOGLE_CLIENT_ID={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      host={process.env.NEXT_PUBLIC_RC_URL}
      roomId={
        process.env.NEXT_PUBLIC_RC_ROOM_ID
          ? process.env.NEXT_PUBLIC_RC_ROOM_ID
          : "GENERAL"
      }
      channelName="General"
      anonymousMode={true}
      isFullScreenFromStart={false}
    />
  );
};
