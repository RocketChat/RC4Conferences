# Day of Event Components Setup

- [Day of Event Setup (Optional)](#day-of-event-setup-optional)
    - [Embedded Rocket.Chat](#embedded-chat)
    - [GreenRoom Page](#greenroom-setup)
    - [Mainstage Page](#mainstage-setup)
    - [RTMP Server URI](#rtmp-server-uri)
        - [Twitch RTMP URI](#twitch-rtmp-uri)
        - [Vimeo RTMP URI](#vimeo-rtmp-uri)

## Day of Event Setup (Optional)

** If you are not working on anything related to the Mainstage or Greenroom Page, please feel free to skip this setup.
> Note: Please restart the client-side application after any of the following changes
### <ins>Embedded Chat</ins>

RC4Conferences integrates the [RC Embedded Chat Component](https://github.com/RocketChat/EmbeddedChat) to enable smooth and real-time communication during the live conferences, between the Speakers and the Event Attendees.

For trying out the Embedded Chat in __RC4Conferences__, please setup the Embedded Chat by following the instructions [here](https://github.com/RocketChat/EmbeddedChat#setting-up-authentication) from the steps mentioned in there note down the Google Cloud Client ID and the Rocket Chat instance url. Now after getting the Google Cloud Client ID and the Rocket Chat instance url paste them in the `app/.env` with the following key name,
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your google client id"
NEXT_PUBLIC_RC_URL="your url of the RC instance"
NEXT_PUBLIC_RC_ROOM_ID="public channel room id"
```

_The `NEXT_PUBLIC_RC_ROOM_ID` defaults to "GENERAL"._


### <ins>GreenRoom Setup</ins>
In RC4Conferences, the greenroom page is the space where Event Speakers come together, and speak. Speaker interface is built on top of [Jitsi React SDK](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-sdk/). 
Jitsi provides a way to stream the call over RTMP, to setup we require a RTMP server URI (e.g., `rtmp://live.rconf.shop`), add this to the `app/.env` as:

```
NEXT_PUBLIC_ROCKET_CHAT_GREENROOM_RTMP="rtmp url to broadcast the stream"
```
> To get the RTMP URI please follow the steps [here](#rtmp-server-link).
### <ins>Mainstage Setup</ins>
>Note: Skip this setup in case of using Twitch or Vimeo RTMP URIs. Please stay tuned until [#65](https://github.com/RocketChat/RC4Conferences/issues/65) and [#64](https://github.com/RocketChat/RC4Conferences/issues/64) is done.

On Mainstage page, during the conference, the attendees view the stream of Speakers talk received from the Greenroom Page. Stream data from Jitsi is sent to the RTMP forest, and from there we can have multiple relays, for example, "Singapore Relay" and "North America Relay". To get the setup right, please enter this two relay links in the `app/.env` as
```
NEXT_PUBLIC_SERVER_STREAM_LINK0="Relay link"
NEXT_PUBLIC_SERVER_STREAM_LINK1="Any other region relay link"
```

In order to provide a better stream to the attendees, based on their proximate distance to the relay region, the attendees are served the content based on their IP address. For locating users based on their IP address, __RC4Conferences__ makes use of [IPinfo](https://ipinfo.io/) API service, to get started, follow this [link](https://ipinfo.io/blog/getting-started-a-step-by-step-guide-for-ipinfo-users/) from the point number __3__, copy the "Access key"/"Token Number" and paste in the `app/.env` as,
```
NEXT_PUBLIC_IPINFO_TOKEN="token from ipinfo"
```
Congratulations! 🎉 You have successfully setup the Day of Event Components. 
<hr />

> fun-try: Visit [here](https://github.com/RocketChat/RC4Conferences/contribute) to find Good first issues. Or append a `/contribute` at the end of any GitHub repository to find'em anytime.
<hr />

Once all the environment variables are set stop the NextJS and re-run the following script to start the Client-side NextJS.
```
sh startNext.sh localhost

sh startNextGp.sh localhost (Only for Gitpod Users)
```
_Note: Please replace the "localhost" (127.0.0.1) with your static IP if you are doing environment setup on your VM. For e.g. `173.456.1.19`_

### RTMP Server URI

#### <ins>Twitch RTMP URI</ins>

Steps to get a RTMP server URI on Twitch:
1. Go [here](https://stream.twitch.tv/ingests/) and choose the best server, which would be at the top of the list of items which would be for me `rtmp://bom01.contribute.live-video.net/app/{stream_key}`
2. Replace the `stream_key` with the key you get from [here](https://www.twitch.tv/broadcast/dashboard/streamkey) it would be a long string e.g., `live_782944617_qB6DwHtSgAMc5i9Vf2kuW21tJwIHZb`
3. Now the stream URI becomes `rtmp://bom01.contribute.live-video.net/app/live_782944617_qB6DwHtSgAMc5i9Vf2kuW21tJwIHZb`, which you will use for `NEXT_PUBLIC_ROCKET_CHAT_GREENROOM_RTMP`.


#### <ins>Vimeo RTMP URI</ins>

To get the RTMP URI on the Vimeo platform, follow the steps mentioned in their [article](https://help.livestream.com/hc/en-us/articles/360002069647-Finding-the-RTMP-URL-and-Stream-Key-for-My-Event) it is explained the best in there.

>Now, since these custom RTMP URIs are provided by a third-party service, any stream you do on the greenroom page will be visible on the Twitch, Vimeo dashboard.
We are open to contributions for embedding this stream e.g., Twitch, Vimeo in RC4Conferences.

Thank you!