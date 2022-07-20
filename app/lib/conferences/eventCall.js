import axios from "axios";

const eventUrl = process.env.NEXT_PUBLIC_EVENT_BACKEND_URL;
const nextDeployUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

//NextJS local API route call begins
export const signCook = async (mail) => {
  const res = await axios.post(`${nextDeployUrl}/api/conf/signCook`, mail);
  return res;
};

export const unsignCook = async (hash) => {
  const res = await axios.post(`${nextDeployUrl}/api/conf/unsignCook`, hash);
  return res;
};
//NextJS local API route call ends

// Auth calls begins
export const checkEmail = async (emailData) => {
  const res = await axios.post(`${eventUrl}/v1/users/check_email`, emailData);
  return res;
};

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
    Authorization: `JWT ${auth}`,
  };
  const res = await axios.post(`${eventUrl}/v1/events`, data, {
    headers: headers,
  });
  return res;
};
// Event Create Call Ends

// Event Ticket Publish Call Begins

export const publishEventTicket = async (data, auth) => {
  const headers = {
    "Content-Type": "application/vnd.api+json",
    Authorization: `JWT ${auth}`,
  };
  const res = await axios.post(`${eventUrl}/v1/tickets`, data, {
    headers: headers,
  });
  return res;
};
// Event Ticket Publish Call Ends

////// Event Fetch Call Begins
export const getEventDeatils = async (eid) => {
  const headers = {
    Accept: "application/vnd.api+json",
  };
  const res = await axios.get(`${eventUrl}/v1/events/${eid}?include=tickets`);
  return res;
};

export const getUserEventDeatils = async (uid, auth) => {
  const headers = {
    Accept: "application/vnd.api+json",
    Authorization: `JWT ${auth}`,
  };
  const res = await axios.get(`${eventUrl}/v1/users/${uid}/events`, {
    headers: headers,
  });
  return res;
};

// Event Speaker call
export const getEventSpeakers = async (eid, auth) => {
  const headers = {
    Accept: "application/vnd.api+json",
    Authorization: `JWT ${auth}`,
  };
  const res = await axios.get(`${eventUrl}/v1/events/${eid}/speakers`, {
    headers: headers,
  });
  return res;
};

export const addEventSpeakers = async (data, auth) => {
  const headers = {
    Accept: "application/vnd.api+json",
    Authorization: `JWT ${auth}`,
    "Content-Type": "application/vnd.api+json",
  };
  const res = await axios.post(`${eventUrl}/v1/speakers`, data, {
    headers: headers,
  });
  return res;
};
////// Event Fetch Call Ends
