import crypto from "crypto-js";

export default function handler(req, res) {
    if (req.method === 'POST') {
      if (!req.body.hash) {
        res.status(401).json({error: "Not Authorized!"})
      }
        const decrypted = crypto.AES.decrypt(req.body.hash, process.env.EVENT_USER_PASSPHRASE)
        res.status(200).json({
            mail: decrypted.toString(crypto.enc.Utf8),
        })
      } else {
        // Handle any other HTTP method
        res.status(400).json({error: "Unsupported Route Method"})
      }
  }