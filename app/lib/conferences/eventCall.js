import axios from "axios";

const eventUrl = process.env.NEXT_PUBLIC_EVENT_BACKEND_URL;
const nextDeployUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

//NextJS local API route call begins
export const signCook = async (mail) => {
  const res = await axios.post(`${nextDeployUrl}/api/conf/signCook`, mail);
  return res;
};

export const unsignCook = async (hash) => {
  const res = await fetch(`${nextDeployUrl}/api/conf/unsignCook`, {
    method: "POST",
    body: JSON.stringify(hash)});
  return res.json();
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

export const userAdminPatch = async (uid, data, auth) => {
  const headers = {
    "Content-Type": "application/vnd.api+json",
    Authorization: `JWT ${auth}`,
  };
  const res = await axios.patch(`${eventUrl}/v1/users/${uid}`, data, {
    headers: headers,
  });
  return res;
};

export const userSetVerified = async (uid, data, auth) => {
  const headers = {
    "Content-Type": "application/vnd.api+json",
    Authorization: `JWT ${auth}`,
  };

  const res = await axios.patch(`${eventUrl}/v1/users/${uid}`, data, {
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

export const getAllEvents = async (eid) => {
  const headers = {
    Accept: "application/vnd.api+json",
  };
  const res = await axios.get(`${eventUrl}/v1/events`);
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
  const res = await fetch(`${eventUrl}/v1/events/${eid}/speakers?sort=id`, {
    headers: headers,
  });
  return res.json();
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

export const deleteEventSpeaker = async (sid, auth) => {
  const headers = {
    Accept: "application/vnd.api+json",
    Authorization: `JWT ${auth}`,
  };
  const res = await axios.delete(`${eventUrl}/v1/speakers/${sid}`, {
    headers: headers,
  });
  return res;
};

export const deleteEvent = async (sid, auth) => {
  const headers = {
    Accept: "application/vnd.api+json",
    Authorization: `JWT ${auth}`,
  };
  const res = await axios.delete(`${eventUrl}/v1/events/${sid}`, {
    headers: headers,
  });
  return res;
};
////// Event Fetch Call Ends
