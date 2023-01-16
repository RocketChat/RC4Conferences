import axios from "axios";

const eventUrl = process.env.NEXT_PUBLIC_EVENT_BACKEND_URL;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const result = await axios.post(
        `${eventUrl}/v1/users/check_email`,
        req.body
      );

      res.status(200).send(result.data);
    } catch (error) {
      res.status(400).send({ error: error.response.data.errors });
    }
    // Process a POST request
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Unsupported Route Method" });
  }
}
