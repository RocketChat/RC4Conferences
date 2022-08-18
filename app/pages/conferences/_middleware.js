import { NextResponse } from "next/server";
import crypto from "crypto-js";

import { ssrVerifyAdmin } from "../../components/conferences/auth/AuthSuperProfileHelper";
import { verifySpeaker } from "../../components/conferences/dayOfEvent/helper";

const verifySignedInUser = (mail) => {
  const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(mail)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return;
}

const verifyGreenroomAccess = async (mail, eventIdentifier) => {
  let isAdmin = false
  if (mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
    isAdmin = await ssrVerifyAdmin({ email: mail });
  }

  const { isSpeaker } = await verifySpeaker(
    eventIdentifier,
    null,
    mail
  );

  if (!isAdmin && !isSpeaker) {
    return false
  }
  return true;
}

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const umail = request.cookies["hashmail"];

  if (!umail) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const eventIdentifier = request.page.params.eid

  const decrypted = crypto.AES.decrypt(
    umail,
    process.env.EVENT_USER_PASSPHRASE
  );

  const decryptedMail = decrypted.toString(crypto.enc.Utf8)

  if (request.nextUrl.pathname.startsWith("/conferences/mainstage")) {
    verifySignedInUser(decryptedMail)
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/conferences/greenroom")) {
    verifySignedInUser(decryptedMail)
    const hasAccess = await verifyGreenroomAccess(decryptedMail, eventIdentifier)

    if (!hasAccess) {
      return NextResponse.redirect(new URL(`/conferences/c/${eventIdentifier}`, request.url))
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/greenroom*", "mainstage/*", "/admin/*", "/create/*"],
};
