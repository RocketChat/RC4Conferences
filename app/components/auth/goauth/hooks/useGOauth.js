import Cookies from "js-cookie";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { signCook } from "../../../../lib/conferences/eventCall";
import RocketChatInstance from "../gapi";
import { useGoogleLogin } from "../useGoogleLogin";

export const useRCGoogleAuth = () => {
  const [user, setUser] = useState({});
  const {signIn} = useGoogleLogin(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
  const {signOut} = useGoogleLogin()
  const RCInstance = new RocketChatInstance(process.env.NEXT_PUBLIC_RC_URL, process.env.NEXT_PUBLIC_RC_ROOM_ID);

  useEffect(() => {
    const isStoredInSession = JSON.parse(sessionStorage.getItem("grc_user"));
    if (isStoredInSession) {
      setUser(isStoredInSession);
    }
  }, []);

  const handleLogin = async (role) => {
    try {

      const res = await RCInstance.googleSSOLogin(signIn)
      const hashmail = await signCook({ mail: res.me.email });
            sessionStorage.setItem("grc_user", JSON.stringify(res.me));

      setUser(res.me);

      Cookies.set("hashmail", hashmail.data.hash);

    } catch (e) {
      console.error("An error occurred while setting up user", e);
    }
  };

  const handleLogout = async () => {
    setUser({});
    const res = await RCInstance.logout(signOut)

    sessionStorage.removeItem("grc_user");
    Cookies.remove("hashmail");
    Cookies.remove("event_auth");
    // Router.reload();
  };

  return {
    user,
    handleLogin,
    handleLogout,
  };
};
