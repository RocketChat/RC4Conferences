import { gql, useLazyQuery } from "@apollo/client";
import client from "../../../apollo-client";
import { signRole, unsignCook } from "../../../lib/conferences/eventCall";

export const FIND_USER_BY_MAIL = gql`
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

export const verifyAdmin = () => {
  const [getCurrentUser, { data, error, loading }] =
    useLazyQuery(FIND_USER_BY_MAIL);

  const callVerify = (prop) => {
    getCurrentUser({
      variables: {
        email: prop.email,
      },
    });
  };

  return [callVerify, { data, error, loading }];
};

export const ssrVerifyAdmin = async (prop) => {
  const { data } = await client.query({
    query: FIND_USER_BY_MAIL,
    variables: { email: prop.email },
  });

  if (data && data.findUserByEmail?.rc4conf?.data[0].role === "Admin") {
    return true;
  } else {
    return false;
  }
};

export const ssrVerifySpeaker = async (prop, hcookie) => {
  let hashRole = undefined;

  if (hcookie !== "undefined") {
    try {
      const dcryptStrRole = await unsignCook({ hash: hcookie });
      const dcryptRole = JSON.parse(dcryptStrRole.mail);

      if (dcryptRole?.role === "speaker") {
        return { hashRole: { hash: hcookie }, isSuperSpeaker: true };
      } else {
        return { hashRole: { hash: hcookie }, isSuperSpeaker: false };
      }
    } catch (e) {
      return { hashRole: { hash: hcookie }, isSuperSpeaker: false };
    }
  }

  const { data } = await client.query({
    query: FIND_USER_BY_MAIL,
    variables: { email: prop.email },
  });

  if (data.findUserByEmail?.rc4conf) {
    hashRole = await signRole({
      email: prop.email,
      role: data.findUserByEmail?.rc4conf?.data[0].role,
    });
  }

  if (data && data.findUserByEmail?.rc4conf?.data[0].role === "Speaker") {
    return { hashRole, isSuperSpeaker: true };
  } else {
    return { hashRole, isSuperSpeaker: false };
  }
};
