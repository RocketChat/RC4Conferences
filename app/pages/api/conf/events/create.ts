import axios from "axios";

const eventUrl = process.env.NEXT_PUBLIC_EVENT_BACKEND_URL;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const headers = {
        "Content-Type": "application/vnd.api+json",
        Authorization: `JWT ${req.body.auth}`,
      };
      const result = await axios.post(`${eventUrl}/v1/events`, req.body.data, {
        headers: headers,
      });

      res.status(200).send(result.data);
    } catch (error) {
      res
        .status(error.response?.status)
        .send({ error: error.response.data.errors?.[0] });
    }
    // Process a POST request
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Unsupported Route Method" });
  }
}
