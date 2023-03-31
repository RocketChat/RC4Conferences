import crypto from "crypto-js";
import RocketChatInstance from "../../../components/auth/goauth/gapi";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const hasAllRequiredCreds =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
      process.env.NEXT_PUBLIC_RC_URL &&
      process.env.NEXT_PUBLIC_RC_ROOM_ID;

    const hasAllCookies = req.cookies.rc_uid && req.cookies.rc_token;

    if (!hasAllRequiredCreds || !hasAllCookies) {
      const encrypted = crypto.AES.encrypt(
        req.body.mail,
        process.env.EVENT_USER_PASSPHRASE
      );
      res.status(200).json({ hash: encrypted.toString() });
    } else {
      const RCInstance = new RocketChatInstance(
        process.env.NEXT_PUBLIC_RC_URL,
        process.env.NEXT_PUBLIC_RC_ROOM_ID
      );

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_RC_URL}/api/v1/me`,
          {
            headers: {
              "Content-Type": "application/text",
              "X-Auth-Token": req.cookies.rc_token,
              "X-User-Id": req.cookies.rc_uid,
            },
            method: "GET",
          }
        );

        const me = await response.json();

        if (me.email === req.body.mail) {
          const encrypted = crypto.AES.encrypt(
            req.body.mail,
            process.env.EVENT_USER_PASSPHRASE
          );
          res.status(200).json({ hash: encrypted.toString() });
        } else {
          res.status(401).json({ error: me?.message });
        }
      } catch (err) {
        console.error(err.message);
        res.status(405).json({ error: err.message });
      }
    }
    // Process a POST request
  } else {
    // Handle any other HTTP method
    res.status(400).json({ error: "Unsupported Route Method" });
  }
}
