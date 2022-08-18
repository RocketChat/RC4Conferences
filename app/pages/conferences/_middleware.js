import { NextResponse } from "next/server";
import crypto from "crypto-js";
import {
  getEventDeatils,
  getEventSpeakers,
} from "../../lib/conferences/eventCall";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const umail = request.cookies["hashmail"];

  if (!umail) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const decrypted = crypto.AES.decrypt(
    umail,
    process.env.EVENT_USER_PASSPHRASE
  );

  const decryptedMail = decrypted.toString(crypto.enc.Utf8)

  if (request.nextUrl.pathname.startsWith("/conferences/mainstage")) {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(decryptedMail)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/conferences/greenroom")) {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    console.log("check logged in", emailRegex.test(decryptedMail))
    if (!emailRegex.test(decryptedMail)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next();
  }

  // const res = await getEventSpeakers("1", "token");
  // console.log("res is", res.data);
  // try {
  // const mailres = await unsignCook({
  //     hash: umail,
  //   });
  //   console.log("mailres", mailres.data)
  // }
  // catch(e) {
  //     console.error("An error whil decipehering", e)
  // }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/greenroom*", "mainstage/*", "/admin/*", "/create/*"],
};
