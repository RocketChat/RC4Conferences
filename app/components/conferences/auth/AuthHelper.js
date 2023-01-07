import crypto from "crypto-js";
import Cookies from "js-cookie";
import {
  checkEmail,
  eventAuthSignIn,
  eventAuthSignUp,
  userAdminPatch,
  userSetVerified,
} from "../../../lib/conferences/eventCall";

export const generatePassword = async (mail) => {
  const passcode = crypto.HmacSHA256(mail, process.env.EVENT_USER_PASSPHRASE);

  return passcode.toString(crypto.enc.Base64);
};

export const setCookie = (res) => {
  let cookieData = {
    ...res.data,
  };
  const jwtDec = JSON.parse(
    Buffer.from(res.data.access_token.split(".")[1], "base64").toString()
  );
  cookieData["jwtInfo"] = jwtDec;
  const expTime = new Date(jwtDec.exp * 1000);
  Cookies.set("event_auth", JSON.stringify(cookieData), { expires: expTime });
};

const signIn = async (mail, passcode) => {
  const toPost = {
    email: mail,
    password: passcode,
  };
  const res = await eventAuthSignIn(toPost);
  return res;
};

const signUp = async (mail, passcode) => {
  const toPost = {
    data: {
      attributes: {
        email: mail,
        password: passcode,
      },
      type: "user",
    },
  };
  const res = await eventAuthSignUp(toPost);
  return res;
};

const setAdmin = async (uid, token) => {
  const toSend = {
    "data": {
      "attributes": {
        "is-admin": true
      },
      "type": "user",
      "id": uid
    }
  }
  const toVerifyData = {
    "data": {
      "attributes": {
        "is-verified": true
      },
      "type": "user",
      "id": uid
    }
  }
  await userAdminPatch(uid, toSend, token)
  await userSetVerified(uid, toVerifyData, token)
}

export const autoLogin = async (mail, passcode) => {
  try {
    const emailData = {
      email: mail,
    };
    const signedIn = await checkEmail(emailData);
    if (signedIn.data.exists) {
      const ressignin = await signIn(mail, passcode);
      return ressignin;
    } else {
      const ressignup = await signUp(mail, passcode);
      
      const ressignin = await signIn(
        ressignup.data.data.attributes.email,
        passcode
      );
      await setAdmin(ressignup.data.data.id, ressignin.data.access_token)
      return ressignin;
    }
  } catch (error) {
    console.error("An error occurred while authorizing", error);
    throw new Error(`An error occurred while authorizing: ${error}`);
  }
};
