import dynamic from 'next/dynamic';
import { useState } from 'react';
import { verifyValidRCchat } from './helper';
const EmbeddedChat = dynamic(() => import('@embeddedchat/react'), {
  ssr: false,
});

export const RCdesktopChat = ({ open, setOpen }) => {
  const validRCflag = verifyValidRCchat();

  return (
    <>
      {open && validRCflag.valid ? (
        <EmbeddedChat
          moreOpts={true}
          isClosable={true}
          setClosableState={setOpen}
          width="auto"
          height={'55vh'}
          GOOGLE_CLIENT_ID={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          host={process.env.NEXT_PUBLIC_RC_URL}
          roomId={
            process.env.NEXT_PUBLIC_RC_ROOM_ID
              ? process.env.NEXT_PUBLIC_RC_ROOM_ID
              : 'GENERAL'
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
  const validRCflag = verifyValidRCchat();

  return (
    <>
      {validRCflag.valid ? (
        <EmbeddedChat
          moreOpts={true}
          isClosable={true}
          setClosableState={setOpen}
          width="auto"
          height={'30vh'}
          GOOGLE_CLIENT_ID={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          host={process.env.NEXT_PUBLIC_RC_URL}
          roomId={
            process.env.NEXT_PUBLIC_RC_ROOM_ID
              ? process.env.NEXT_PUBLIC_RC_ROOM_ID
              : 'GENERAL'
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
