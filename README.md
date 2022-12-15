# RC4Conferences
Rocket Chat for Virtual Conferences a.k.a __RC4Confernces__ (in short) is a set of scalable components for communities to build, manage, and run virtual conferences of any size. RC4Conferences extends [RC4Community](https://github.com/RocketChat/RC4Community) which is a set of tools to build and grow massive online communities with Rocket.Chat.

## Table of Contents

- [Installation](#installation)
    - [Pre-requisites](#pre-requisites)
    - [Local Development Setup](#local-development-setup)
        - [Server-Side](#server-side-setup)
        - [Client-Side](#client-side-setup)
    - [Gitpod Development Setup](#gitpod-development-setup)
        - [Server-Side](#server-side-setup-1)
        - [Client-side](#client-side-setup-1)
    - [Day of Event Setup (Optional)](#day-of-event-setup-optional)
        - [Embedded Rocket.Chat](#embedded-chat)
        - [GreenRoom Page](#greenroom-setup)
        - [Mainstage Page](#mainstage-setup)
        - [RTMP Server URI](#rtmp-server-uri)
- [Usage](#usage)
    - [Create an Event](#create-an-event)
    - [Preview an Event](#preview-an-event)
    - [Day of Event Page](#greenroom-and-mainstage-page)

# Installation


## Pre-requisites
- [Docker](https://docs.docker.com/desktop/install/linux-install/)
- Docker Compose
- [Node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) ~16.x.x
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 
- Bash shell
- we recommend: 8GB system memory (please use Gitpod for better resources)

## Local Development Setup

### <ins> Server Side Setup </ins>

The server-side of RC4Conferences comprises of Eventyay's [Open Event Server](https://github.com/fossasia/open-event-server) Docker Image, [FaunaDB development Docker Image](https://docs.fauna.com/fauna/current/build/tools/dev), and [Strapi CMS](https://strapi.io/). To start both of the services simulataneously, please run the following, 
 
```
sh startdevenv.sh localhost
```
_Note: Please replace the "localhost" (127.0.0.1) with your static IP if you are doing environment setup on your VM. For e.g. `173.456.1.19`_

The above script shall successfully with starting 5 ports 
- 8080
- 8443
- 8444
- 8084
- Random port for Strapi (defaults to 1337)

In case of any error output while script is executing, please rectify them, or else open a new issue, the community shall help you at earliest.

You have successfully setup the backend of __RC4Conferences__, now please move forward 🚀 to setting up the client-side. 

### <ins> Client Side Setup </ins>

The client-side of RC4Conferences is developed using NextJS, to start the development environment of NextJS please run the following,
```
sh startNext.sh localhost
```
_Note: Please replace the "localhost" (127.0.0.1) with your static IP if you are doing environment setup on your VM. For e.g. `173.456.1.19`_

On a successful execution of script, the NextJS will start on port `3000` (default) or if it is occupied the next available port shall be used e.g., `3001`.

Congratulations! 🎉 You have successfully setup both the Client-Side and Server-Side. 

## Gitpod Development Setup

To start the development on Gitpod, click on the button "Open in Gitpod"
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/RocketChat/RC4Conferences)

### <ins>Server-side setup</ins>

Same as mentioned in the Local Development [Server-side setup](#server-side-setup)

### <ins>Client-side setup</ins>
The client-side of RC4Conferences is developed using NextJS, to start the development environment of NextJS please run the following,
```
sh startNextGp.sh localhost
```
_Note: Please replace the "localhost" (127.0.0.1) with your static IP if you are doing environment setup on your VM. For e.g. `173.456.1.19`_

On a successful execution of script, the NextJS will start on port `3000` (default) or if it is occupied the next available port shall be used e.g., `3001`.

Congratulations! 🎉 You have successfully setup both the Client-Side and Server-Side. 

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
On Mainstage page, during the conference, the attendees view the stream of Speakers talk from the Greenroom Page. Stream data from Jitsi is sent to the RTMP forest, and from there we can have multiple relays, for example, "Singapore Relay" and "North America Relay". To get the setup right, please enter this two relay links in the `app/.env` as
```
NEXT_PUBLIC_SERVER_STREAM_LINK0="Relay link"
NEXT_PUBLIC_SERVER_STREAM_LINK1="Any other region relay link"
```

In order to provide a better stream to the attendees, based on their proximate distance to the relay region, the attendees are served the content based on their IP address. For locating users based on their IP address, __RC4Conferences__ makes use of [IPinfo](https://ipinfo.io/) API service, to get started, follow this [link](https://ipinfo.io/blog/getting-started-a-step-by-step-guide-for-ipinfo-users/) from the point number __3__, copy the "Access key"/"Token Number" and paste in the `app/.env` as,
```
NEXT_PUBLIC_IPINFO_TOKEN="token from ipinfo"
```
Congratulations! 🎉 You have successfully setup the Day of Event Components. 

Once all the environment variables are set run the following script to start the Client-side NextJS.
```
sh startNext.sh localhost

sh startNextGp.sh localhost (Only for Gitpod Users)
```
_Note: Please replace the "localhost" (127.0.0.1) with your static IP if you are doing environment setup on your VM. For e.g. `173.456.1.19`_

### RTMP Server URI

Steps to get a RTMP server URI:
1. Go [here](https://stream.twitch.tv/ingests/) and choose the best server, which would be at the top of the list of items which would be for me `rtmp://bom01.contribute.live-video.net/app/{stream_key}`
2. Replace the `stream_key` with the key you get from [here](https://www.twitch.tv/broadcast/dashboard/streamkey) it would be a long string e.g., `live_782944617_qB6DwHtSgAMc5i9Vf2kuW21tJwIHZb`
3. Now the stream URI becomes `rtmp://bom01.contribute.live-video.net/app/live_782944617_qB6DwHtSgAMc5i9Vf2kuW21tJwIHZb`, which you will use for `NEXT_PUBLIC_ROCKET_CHAT_GREENROOM_RTMP`.
4. Now, since this is a third-party service, any stream you do on the greenroom page will be visible on the Twitch dashboard.
5. We are open to contributions for embedding this stream e.g., Twitch, Vimeo in RC4Conferences.

Thank you!

# Usage

## Create an Event
To get started with creating a Event, on the homepage first login with "Admin" role. Once successfully logged in an additional top navbar item __Admin__ becomes available.
Here is a demo walkthrough of creating a event:

https://user-images.githubusercontent.com/61188295/207706981-d70725bd-e93e-4ac7-b926-eb32551b4b81.mp4


## Preview an Event

Event details can be seen on the `conferenences/c/[eid]` page which includes the _Event poster, Event name, Event date, Event description, Event sessions, Event speakers_. Please refer to the below demo walkthrough.

https://user-images.githubusercontent.com/61188295/207707047-e5abb73d-f08e-47d7-9a29-fa64921b8333.mp4


## Admin Dashboard - Manage Events
On the Admin dashboard all the events created by the user would be listed along with some additional options to do:
- Add Event speakers
- Delete Event speakers
- Delete an Event

Here is a walkthrough demo of Admin dashboard page.

https://user-images.githubusercontent.com/61188295/207707100-a6d70089-74c9-4352-84e7-7512da505567.mp4



## Role based access
Greenroom page is only accessible by users with a _Speaker_ and _Admin_ role, whereas Mainstage page is accessible by all the _Admin_, _Speaker_, and _Attendee_ role users.
Below is a walkthrough of trying out the role based access on the Greenroom page.

https://user-images.githubusercontent.com/61188295/207707148-5ce39306-9e51-4dcf-a826-302fdc9738cb.mp4


## Greenroom and Mainstage Page
On the Day of Event, Attendees and Speakers interact through the Greenroom and Mainstage page.

Below is a walkthrough which shows how the _Event Admin_ starts a live stream on Greenroom page, and simulataneously the broadcast is shown on the Mainstage page.
Furthermore, the Speakers and Attendees share their messages using the Embedded Chat window.

https://user-images.githubusercontent.com/61188295/207707250-535c02a9-db6a-470a-afcd-8aed89e47d67.mp4


>Fun try: Try refreshing the `/conferences` page. (Hint: Background image)


### Additional Resources
[Open Event Server custom deployment docs](./open-event-server/README.md)

[Fauna Superprofile local docker custom setup docs](./superprofile/README.md)

[Fauna Superprofile SaaS custom setup docs](./superprofile/cloud/README.md)

[Details about different env files in open-event-server directory](./open-event-server/README.md#details-about-different-env-files)
