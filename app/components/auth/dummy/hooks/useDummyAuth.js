import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { signCook } from "../../../../lib/conferences/eventCall";

const createDummyUser = () => {
  return {
    id: 1,
    name: "dummy.cat",
    image:
      "https://user-images.githubusercontent.com/25859075/29918905-88dcc646-8e5c-11e7-81ec-242bc58dce1b.jpg",
    email: process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL,
    emailVerified: false,
    phoneNumber: null,
    displayName: "dummy.cat",
  };
};

export const useDummyAuth = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const isStoredInSession = JSON.parse(sessionStorage.getItem("dummy_user"));
    if (isStoredInSession) {
      setUser(isStoredInSession);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const dummy_user = createDummyUser();
      const hashmail = await signCook({ mail: dummy_user.email });
      setUser(dummy_user);
      sessionStorage.setItem("dummy_user", JSON.stringify(dummy_user));
      Cookies.set("hashmail", hashmail.data.hash);
    } catch (e) {
      console.error("An error occurred while setting up user", e);
    }
  };

  const handleLogout = () => {
    setUser({});
    sessionStorage.removeItem("dummy_user");
    Cookies.remove("hashmail");
  };

  return {
    user,
    handleLogin,
    handleLogout,
  };
};
