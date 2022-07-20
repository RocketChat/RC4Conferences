import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { autoLogin, setCookie } from "./auth/AuthHelper";

const EventHome = ({ passcode }) => {
  const router = useRouter();
  const [load, setLoad] = useState(false);
  let session = Cookies.get("event_auth");
  let umail = process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL;
  useEffect(() => {
    if (session) {
      session = JSON.parse(session);
    }
  });

  const handleAutoAuth = async () => {
    setLoad(true);
    const res = await autoLogin(umail, passcode);
    if (res?.data) {
      setCookie(res);
      router.push("/conferences/create/basic-detail");
    }
    setLoad(false)
  };

  const handleClick = () => {
    if (session?.access_token) {
      router.push("/conferences/create/basic-detail");
    } else {
      passcode && umail
        ? handleAutoAuth()
        : router.push("/conferences/confAuth");
    }
  };

  return (
    <Button disabled={load} onClick={handleClick}>
      {load ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        "Create Event!"
      )}
    </Button>
  );
};

export default EventHome;
