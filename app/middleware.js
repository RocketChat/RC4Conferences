import { NextResponse, URLPattern } from "next/server";
import crypto from "crypto-js";

import { ssrVerifyAdmin, ssrVerifySpeaker } from "./components/conferences/auth/AuthSuperProfileHelper";
import { verifySpeaker } from "./components/conferences/dayOfEvent/helper";

const verifySignedInUser = (mail) => {
  const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(mail)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return;
}

const verifyGreenroomAccess = async (mail, eventIdentifier, rolecookie) => {
  let isAdmin = false
  if (mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
    isAdmin = await ssrVerifyAdmin({ email: mail });
  }

  const { isSpeaker } = await verifySpeaker(
    eventIdentifier,
    null,
    mail
  );

  const {hashRole, isSuperSpeaker} = await ssrVerifySpeaker({email: mail}, rolecookie)

  if (!isAdmin && !isSpeaker) {
    return {hashRole, hasAccess: false}
  }
  return {hashRole, hasAccess: true};
}

const verifyAdminAccess = async (mail) => {
  let isAdmin = false
  if (mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
    isAdmin = await ssrVerifyAdmin({ email: mail });
  }

  if (!isAdmin) {
    return false
  }
  return true;
}

const PATTERNS = [
  [
    new URLPattern({ pathname: '/:locale/:slocal/:slug' }),
    ({ pathname }) => pathname.groups,
  ],
]

const params = (url) => {
  const input = url.split('?')[0]
  let result = {}

  for (const [pattern, handler] of PATTERNS) {
    const patternResult = pattern.exec(input)
    if (patternResult !== null && 'pathname' in patternResult) {
      result = handler(patternResult)
      break
    }
  }
  return result
}

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const umail = request.cookies.get("hashmail")
  const oesCookie = request.cookies.get("event_auth")
  const rolecookie = request.cookies.get("hashrole")

  if (!umail) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // const eventIdentifier = request.page?.params?.eid
  const { locale, slug } = params(request.url)
  const eventIdentifier = slug

  const decrypted = crypto.AES.decrypt(
    umail,
    process.env.EVENT_USER_PASSPHRASE
  );

  const decryptedMail = decrypted.toString(crypto.enc.Utf8)

  if (request.nextUrl.pathname.startsWith("/conferences/create") || request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    verifySignedInUser(decryptedMail)

    const isAdmin = await verifyAdminAccess(decryptedMail)
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (!oesCookie) {
      return NextResponse.redirect(new URL(`/conferences`, request.url))
    }

    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/conferences/c")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/conferences/mainstage")) {
    verifySignedInUser(decryptedMail)
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/conferences/greenroom")) {
    const response = NextResponse.next()

    verifySignedInUser(decryptedMail)
    let now = new Date()
    now.setHours(now.getHours()+1)
    
    const {hashRole, hasAccess} = await verifyGreenroomAccess(decryptedMail, eventIdentifier, rolecookie)
    if (!hasAccess) {
      return NextResponse.redirect(new URL(`/conferences/c/${eventIdentifier}?error=0`, request.url))
    }
    
    response.cookies.set("hashrole", hashRole?.hash, {expires: now})
    return response
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/conferences/mainstage/:path*', '/conferences/greenroom/:path*', '/conferences/create/:path*', '/conferences/admin/:path*'],
};
