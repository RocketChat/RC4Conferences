import { useEffect, useState } from "react";
import Menubar from "../menubar";
import _ from "lodash";
import Cookies from "js-cookie";
import { verifyAdmin } from "./auth/AuthSuperProfileHelper";

export const VerifyUserRole = ({ menuprops }) => {
  if (!menuprops.menu?.topNavItems) {
    return <Menubar menu={menuprops.menu.topNavItems} />;
  }
  const [getCurrentUser, { data, error, loading }] = verifyAdmin();
  const [verified, setVerified] = useState(false);
  const umail = Cookies.get("user_mail");
  useEffect(() => {
    getCurrentUser({ email: umail });
  }, []);
  let menuCache = null;

  if (!menuprops.menu?.topNavItems) {
    return <Menubar menu={menuprops.menu.topNavItems} />;
  }

  const abortAdmin = () => {
    menuCache = _.cloneDeep(menuprops);

    menuCache.menu.topNavItems.data.attributes.body =
      menuCache.menu.topNavItems.data.attributes.body.filter(
        (element) => element.label !== "Admin"
      );
  };

  if (data) {
    const isAdmin = data.findUserByEmail?.rc4conf?.data[0].role;
    if (isAdmin === "Admin") {
      !verified && setVerified(true);
    }
  }

  if (error) {
    console.error(
      "An error ocurred while getting user details on Superprofile",
      error
    );
  }

  return (
    <>
      {abortAdmin()}
      {verified ? (
        <Menubar menu={menuprops.menu.topNavItems} />
      ) : (
        <Menubar menu={menuCache.menu.topNavItems} />
      )}
    </>
  );
};
