import axios from "axios";

const eventUrl = process.env.NEXT_PUBLIC_EVENT_BACKEND_URL;

export default async function handler(req, res) {
  const { eid } = req.query;

  if (req.method === "PATCH") {
    try {
      const headers = {
        "Content-Type": "application/vnd.api+json",
        Authorization: `JWT ${req.body.auth}`,
      };
      const result = await axios.patch(
        `${eventUrl}/v1/events/${eid}`,
        req.body.data,
        {
          headers: headers,
        }
      );

      res.status(200).send(result.data);
    } catch (error) {
      res
        .status(error.response.status)
        .send({ error: error.response.data.errors?.[0] });
    }
    // Process a POST request
  } else if (req.method === "GET") {
    try {
      const headers = {
        Accept: "application/vnd.api+json",
      };
      const result = await axios.get(
        `${eventUrl}/v1/events/${eid}?include=tickets`,
        {
          headers: headers,
        }
      );

      res.status(200).send(result.data);
    } catch (error) {
      res
        .status(error.response.status)
        .send({ error: error.response.data.errors?.[0] });
    }
  } else if (req.method === "DELETE") {
    try {
      const headers = {
        "Content-Type": "application/vnd.api+json",
        Authorization: `JWT ${req.body}`,
      };

      const result = await fetch(`${eventUrl}/v1/events/${eid}`, {
        method: "DELETE",
        headers: headers,
      });

      res.status(200).send(result.data);
    } catch (error) {
      res.status(error.response.status).send({ error: error.response.data });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Unsupported Route Method" });
  }
}
