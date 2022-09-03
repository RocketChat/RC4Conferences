import Cookies from "js-cookie";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { signCook } from "../../../../lib/conferences/eventCall";
import RocketChatInstance from "../gapi";
import { useGoogleLogin } from "../useGoogleLogin";

export const useRCGoogleAuth = () => {
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userOrEmail, setUserOrEmail] = useState(null);
  const [method, setMethod] = useState(undefined);

  const { signIn } = useGoogleLogin(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  const { signOut } = useGoogleLogin();

  const RCInstance = new RocketChatInstance(
    process.env.NEXT_PUBLIC_RC_URL,
    process.env.NEXT_PUBLIC_RC_ROOM_ID
  );

  useEffect(() => {
    const isStoredInSession = JSON.parse(sessionStorage.getItem("grc_user"));
    if (isStoredInSession) {
      setUser(isStoredInSession);
    }
  }, []);

  const handleLogin = async (acsCode) => {
    try {
      const res = await RCInstance.googleSSOLogin(signIn, acsCode);
      if (res?.me) {
        const hashmail = await signCook({ mail: res.me.email });
        sessionStorage.setItem("grc_user", JSON.stringify(res.me));
        setUser(res.me);

        Cookies.set("hashmail", hashmail.data.hash);
      }
      if (res.error === "totp-required") {
        setUserOrEmail(res.details.emailOrUsername);
        setIsModalOpen(true);
        if (res.details.availableMethods.length > 1) {
          setMethod("totp");
        } else {
          setMethod(res.details.availableMethods[0]);
        }
      }
    } catch (e) {
      console.error("A error occurred while setting up user", e);
    }
  };

  const handleLogout = async () => {
    setUser({});
    await RCInstance.logout(signOut);

    sessionStorage.removeItem("grc_user");
    Cookies.remove("hashmail");
    Cookies.remove("event_auth");
    // Router.reload();
  };

  const handleResend = async () => {
    const res = await RCInstance.resend2FA(userOrEmail)
    return res
  }

  return {
    user,
    handleLogin,
    handleLogout,
    handleResend,
    isModalOpen,
    setIsModalOpen,
    method,
    userOrEmail
  };
};
