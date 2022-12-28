import {
  getEventDeatils,
  getEventSpeakers,
} from "../../../lib/conferences/eventCall";

export const verifySpeaker = async (eid, acook, mailid) => {
  let spkMail = [];
  let token = null;

  try {
    if (acook) token = JSON.parse(acook).access_token;

    const spkData = await getEventSpeakers(eid, token);
    spkData.data.map((ispk) => {
      spkMail.push(ispk.attributes.email);
    });
    if (spkMail.includes(mailid)) {
      return { isSpeaker: true };
    } else {
      return { isSpeaker: false };
    }
  } catch (e) {
    console.error("An error while getting speaker details", e);
    return { isSpeaker: null };
  }
};

export const verifyValidRCchat = () => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return {
      valid: false,
      msg: "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID, the google client id",
    };
  } else if (!process.env.NEXT_PUBLIC_RC_ROOM_ID) {
    return {
      valid: false,
      msg: "Missing NEXT_PUBLIC_RC_ROOM_ID, the id of the event room in RC",
    };
  } else if (!process.env.NEXT_PUBLIC_RC_URL) {
    return {
      valid: false,
      msg: "Missing NEXT_PUBLIC_RC_URL, the Rocket Chat instance URI",
    };
  } else {
    return { valid: true, msg: "Open Chat" };
  }
};
