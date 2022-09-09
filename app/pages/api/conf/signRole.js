import crypto from "crypto-js";

export default function handler(req, res) {
  if (req.method === "POST") {
    const encrypted = crypto.AES.encrypt(req.body, process.env.EVENT_USER_PASSPHRASE);
    res.status(200).json({ hash: encrypted.toString() });
    // Process a POST request
  } else {
    // Handle any other HTTP method
    res.status(400).json({ error: "Unsupported Route Method" });
  }
}
