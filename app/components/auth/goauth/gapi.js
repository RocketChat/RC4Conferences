import { Rocketchat } from "@rocket.chat/sdk";
import Cookies from "js-cookie";

export default class RocketChatInstance {
  host = process.env.NEXT_PUBLIC_RC_URL;
  rid = "";
  rcClient = null;

  constructor(host, rid) {
    this.host = host;
    this.rid = rid;
    this.rcClient = new Rocketchat({
      protocol: "ddp",
      host: this.host,
      useSsl: !/http:\/\//.test(host),
    });
  }

  getCookies() {
    return {
      rc_token: Cookies.get("rc_token"),
      rc_uid: Cookies.get("rc_uid"),
    };
  }

  setCookies(cookies) {
    Cookies.set("rc_token", cookies.rc_token || "");
    Cookies.set("rc_uid", cookies.rc_uid || "");
  }

  async googleSSOLogin(signIn, acsCode) {
    const tokens = await signIn();
    let acsPayload = null

    if (typeof acsCode === "string") { 
      acsPayload=acsCode
    }

    console.log("checoldscm....", acsCode)

    const payload = acsCode
      ? JSON.stringify({
          serviceName: "google",
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          expiresIn: 3600,
          totp: {
            code: acsPayload,
          },
        })
      : JSON.stringify({
          serviceName: "google",
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          expiresIn: 3600,
        });
    try {
      const req = await fetch(`${this.host}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });
      const response = await req.json();

      if (response.status === "success") {
        this.setCookies({
          rc_token: response.data.authToken,
          rc_uid: response.data.userId,
        });
        if (!response.data.me.username) {
          await this.updateUserUsername(
            response.data.userId,
            response.data.me.name
          );
        }
        return { status: response.status, me: response.data.me };
      }

      if (response.error === "totp-required") {
        return response;
      }
    } catch (err) {
      console.error(err.message);
      throw new Error(err.message);
    }
  }

  async logout() {
    try {
      const response = await fetch(`${this.host}/api/v1/logout`, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": Cookies.get("rc_token"),
          "X-User-Id": Cookies.get("rc_uid"),
        },
        method: "POST",
      });
      this.setCookies({});
      return await response.json();
    } catch (err) {
      console.error(err.message);
      throw new Error(err.message);

    }
  }

  async resend2FA(emailOrUsername) {
    try {
      const response = await fetch(`${this.host}/api/v1/users.2fa.sendEmailCode`, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": null,
          "X-User-Id": null,
        },
        mode: "cors",
        method: "POST",
        body: JSON.stringify({
          emailOrUsername: emailOrUsername,
        })
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
      throw new Error(err.message);

    }
  }

  async updateUserUsername(userid, username) {
    let newUserName = username.replace(/\s/g, ".").toLowerCase();
    try {
      const response = await fetch(`${this.host}/api/v1/users.update`, {
        body: `{"userId": "${userid}", "data": { "username": "${newUserName}" }}`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": Cookies.get("rc_token"),
          "X-User-Id": Cookies.get("rc_uid"),
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
      throw new Error(err.message);

    }
  }

  async channelInfo() {
    try {
      const response = await fetch(
        `${this.host}/api/v1/channels.info?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": Cookies.get("rc_token"),
            "X-User-Id": Cookies.get("rc_uid"),
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err.message);
      throw new Error(err.message);

    }
  }

  async realtime(callback) {
    try {
      await this.rcClient.connect();
      await this.rcClient.resume({ token: Cookies.get("rc_token") });
      await this.rcClient.subscribe("stream-room-messages", this.rid);
      await this.rcClient.onMessage((data) => {
        callback(data);
      });
    } catch (err) {
      await this.close();
    }
  }

  async close() {
    await this.rcClient.unsubscribeAll();
    await this.rcClient.disconnect();
  }

  async getMessages(anonymousMode = false) {
    const endp = anonymousMode ? "anonymousread" : "messages";
    try {
      const messages = await fetch(
        `${this.host}/api/v1/channels.${endp}?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": Cookies.get("rc_token"),
            "X-User-Id": Cookies.get("rc_uid"),
          },
          method: "GET",
        }
      );
      return await messages.json();
    } catch (err) {
      console.log(err.message);
    }
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${this.host}/api/v1/chat.sendMessage`, {
        body: `{"message": { "rid": "${this.rid}", "msg": "${message}" }}`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": Cookies.get("rc_token"),
          "X-User-Id": Cookies.get("rc_uid"),
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err.message);
      throw new Error(err.message);

    }
  }
}
