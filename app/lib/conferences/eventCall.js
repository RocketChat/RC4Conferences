import axios from "axios";

const eventUrl = process.env.NEXT_PUBLIC_EVENT_BACKEND_URL;

// Auth calls begins
export const eventAuthSignIn = async (signInf) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const res = await axios.post(`${eventUrl}/v1/auth/login`, signInf, {
    headers: headers,
  });
  return res;
};

export const eventAuthSignUp = async (signUpf) => {
  const headers = {
    "Content-Type": "application/vnd.api+json",
  };
  console.log("signUpf", signUpf)
  const res = await axios.post(`${eventUrl}/v1/users`, signUpf, {
    headers: headers,
  });
  return res;
};

// Auth call Ends

// Event Create Call Begins

export const publishEvent = async (data, auth) => {
  const headers = {
    "Content-Type": "application/vnd.api+json",
    "Authorization": `JWT ${auth}`
  };
  const res = await axios.post(`${eventUrl}/v1/events`, data, {
    headers: headers,
  });
  return res;
}
// Event Create Call Ends

// Event Ticket Publish Call Begins

export const publishEventTicket = async (data, auth) => {
  const headers = {
    "Content-Type": "application/vnd.api+json",
    "Authorization": `JWT ${auth}`
  };
  const res = await axios.post(`${eventUrl}/v1/tickets`, data, {
    headers: headers,
  });
  return res;
}
// Event Ticket Publish Call Ends

////// Event Fetch Call Begins
export const getEventDeatils = async (eid) => {
  const headers = {
    "Accept": "application/vnd.api+json",
  };
  const res = await axios.get(`${eventUrl}/v1/events/${eid}?include=tickets`);
  return res;
}

// Event Speaker call
export const getEventSpeakers = async (eid) => {
  const headers = {
    "Accept": "application/vnd.api+json",
  };
  const res = await axios.get(`${eventUrl}/v1/events/${eid}/speakers`);
  return res;
}
////// Event Fetch Call Ends
