import crypto from "crypto-js";

export default function handler(req, res) {
  if (req.method === "POST") {
    let hashObject = undefined;
    if (typeof req.body == "object") {
      hashObject = req.body;
    }
    if (typeof req.body == "string") {
      hashObject = JSON.parse(req.body);
    }
    if (!hashObject?.hash) {
      res.status(401).json({ error: "Not Authorized!" });
      res.end();
    }
    const decrypted = crypto.AES.decrypt(
      hashObject?.hash,
      process.env.EVENT_USER_PASSPHRASE
    );
    res.status(200).json({
      mail: decrypted.toString(crypto.enc.Utf8),
    });
  } else {
    // Handle any other HTTP method
    res.status(400).json({ error: "Unsupported Route Method" });
  }
}
