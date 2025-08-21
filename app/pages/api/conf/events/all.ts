import axios from "axios";

const eventUrl = process.env.NEXT_PUBLIC_EVENT_BACKEND_URL;

// GET all events data from `${eventUrl}/v1/events` and handle errors
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const headers = {
        Accept: "application/vnd.api+json",
      };
      const result = await axios.get(`${eventUrl}/v1/events`);

      res.status(200).send({ data: result.data });
    } catch (error) {
      res
        .status(error.response?.status)
        .send({ error: error.response.data.errors?.[0] });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Unsupported Route Method" });
  }
}
