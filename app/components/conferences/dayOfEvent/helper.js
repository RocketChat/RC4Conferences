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
