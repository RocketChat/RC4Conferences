import crypto from "crypto-js";

export default function handler(req, res) {
    if (req.method === 'POST') {
        const decrypted = crypto.AES.decrypt(req.body.hash, process.env.EVENT_USER_PASSPHRASE)
        res.status(200).json({
            mail: decrypted.toString(crypto.enc.Utf8),
        })
      } else {
        // Handle any other HTTP method
        res.status(400).json({error: "Unsupported Route Method"})
      }
  }