import styles from '../../../../styles/event.module.css';
import { DoEWrapper } from '../wrapperComponent';
import { SpeakerChatToolbar } from './SpeakerToolbar';
import { Card, Collapse } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ssrVerifyAdmin } from '../../auth/AuthSuperProfileHelper';
import { unsignCook } from '../../../../lib/conferences/eventCall';
import Cookies from 'js-cookie';
import Jitsibroadcaster from './Jitsibroadcaster';

const EventSpeakerStage = ({
  spkdata,
  eventdata,
  eventIdentifier,
  open,
  setOpen,
}) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const hashmail = Cookies.get('hashmail');

        const res = await unsignCook({ hash: hashmail });
        const mail = res.mail;

        if (mail) {
          const isAdminRes = await ssrVerifyAdmin({ email: mail });
          setIsAdmin(isAdminRes);
        }
      } catch (e) {
        console.error('An error while verifying admin access', e);
      }
    };
    verifyAdminAccess();
  }, []);

  return (
    <div>
      <div className={styles.greenroom_jitsi}>
        <Jitsibroadcaster
          room={
            eventdata
              ? eventdata.data?.['chat-room-name']
              : `DemoDay-${eventIdentifier}`
          }
          disName={'Speakers'}
          isAdmin={isAdmin}
          eventData={eventdata}
          open={open}
          setOpen={setOpen}
        />
      </div>
    </div>
  );
};

export default EventSpeakerStage;
