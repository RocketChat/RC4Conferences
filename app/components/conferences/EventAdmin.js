import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Menubar from "../menubar";
import _ from "lodash";
import Cookies from "js-cookie";

const FindUserByMail = gql`
  query findUser($email: String!) {
    findUserByEmail(email: $email) {
      _id
      uid
      displayName
      email
      photoURL
      phoneNumber
      rc4conf {
        data {
          role
        }
      }
    }
  }
`;

export const VerifyUserRole = ({ menuprops }) => {
  const [getCurrentUser, { data, error, loading }] =
    useLazyQuery(FindUserByMail);
  const [verified, setVerified] = useState(false);
  const umail = Cookies.get("user_mail");
  useEffect(() => {
    getCurrentUser({
      variables: {
        email: umail,
      },
    });
  }, []);
  let menuCache = null;

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
