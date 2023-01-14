import { useEffect, useState } from "react";
// import Menubar from "../menubar";
import NewMenubar from "../menubar/newMenuBar";
import _ from "lodash";
import Cookies from "js-cookie";
import { verifyAdmin } from "./auth/AuthSuperProfileHelper";
import { unsignCook } from "../../lib/conferences/eventCall";

export const VerifyUserRole = ({ menuprops }) => {
  if (!menuprops.menu?.topNavItems) {
    return <Menubar menu={menuprops.menu.topNavItems} />;
  }
  const [getCurrentUser, { data, error, loading }] = verifyAdmin();
  const [verified, setVerified] = useState(false);
  const hashmail = Cookies.get("hashmail");
  useEffect(() => {
    const decipherEmail = async () => {
      try {
        if (hashmail) {
          const res = await unsignCook({ hash: hashmail });
          getCurrentUser({ email: res.mail });
        }
      } catch {
        console.error("Error while deciphering");
        throw new Error("Error while deciphering");
      }
    };
    decipherEmail();
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
    const isAdmin = data.findUserByEmail?.rc4conf?.data[0]?.role;
    if (isAdmin === "Admin") {
      !verified && setVerified(true);
    }
  }

  if (error) {
    console.error(
      "An error ocurred while getting user details on Superprofile",
      error
    );
    throw new Error(`An error ocurred while getting user details on Superprofile: ${error?.response?.data?.errors?.[0]?.detail}`);
  }

  return (
    <>
      {abortAdmin()}
      {verified ? (
        // <Menubar menu={menuprops.menu.topNavItems} />
        <NewMenubar menu={menuprops.menu.topNavItems} />
      ) : (
        // <Menubar menu={menuCache.menu.topNavItems} />
        <NewMenubar menu={menuCache.menu.topNavItems} />
      )}
    </>
  );
};
