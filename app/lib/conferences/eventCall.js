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
  console.log("signUpf", data)
  console.log("auth", auth)
  const res = await axios.post(`${eventUrl}/v1/events`, data, {
    headers: headers,
  });
  return res;
}
// Event Create Call Ends
