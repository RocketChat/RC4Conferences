import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Menubar from "../menubar";
import _ from "lodash";

const FindUserByMail = gql`
  query findUser($email: String!) {
    findUserByEmail(email: $email) {
      _id
      uid
      displayName
      email
      photoURL
      phoneNumber
      events {
        data {
          role
        }
      }
    }
  }
`;

export const VerifyUserRole = ({ menuprops }) => {
  const [getCurrentUser, { data, error, loading }] = useLazyQuery(FindUserByMail);
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    getCurrentUser({
        variables: {
            email: "acat0@rocket.chat"
        }
    })
  }, []);
  let menuCache=null

  const abortAdmin = () => {
    menuCache = _.cloneDeep(menuprops);

    menuCache.menu.topNavItems.data.attributes.body =
    menuCache.menu.topNavItems.data.attributes.body.filter(
        (element) => element.label !== "Admin"
      );
  };

  if (data) {
      const isAdmin = data.findUserByEmail?.events?.data[0].role
      if (isAdmin === "Admin"){
          !verified && setVerified(true)
      }
  }

  return (
    <>
      {abortAdmin()}
      {verified ? <Menubar menu={menuprops.menu.topNavItems} />  : <Menubar menu={menuCache.menu.topNavItems} />}
    </>
  );
};
