import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { autoLogin, setCookie } from "./auth/AuthHelper";

const EventHome = ({ passcode }) => {
  const router = useRouter();
  let session = Cookies.get("event_auth");
  let umail = Cookies.get("user_mail");
  useEffect(() => {
    if (session) {
      session = JSON.parse(session);
    }
  });

  const handleAutoAuth = async () => {
    const res = await autoLogin(umail, passcode);
    if (res?.data) {
      setCookie(res);
      router.push("/conferences/create/basic-detail")
    }
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

  return <Button onClick={handleClick}>Create Event!</Button>;
};

export default EventHome;
