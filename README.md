# RC4Conferences
Rocket Chat for Virtual Conferences a.k.a __RC4Confernces__ (in short) is a set of scalable components for communities to build, manage, and run virtual conferences of any size. RC4Conferences extends [RC4Community](https://github.com/RocketChat/RC4Community) which is a set of tools to build and grow massive online communities with Rocket.Chat.

## Table of Contents

- [Installation]()
    - [Pre-requisites]()
    - [Local Development Setup]()
        - [Server-Side]()
        - [Client-Side]()
    - [Gitpod Development Setup]()
        - [Server-Side]()
        - [Client-side]()
    - [Optional Features Setup]()
        - [Embedded Rocket.Chat]()
        - [GreenRoom Page]()
        - [Mainstage Page]()
- [Usage]()
    - ...

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

## Optional Features Setup
> Note: Please restart the client-side application after any of the following changes
### <ins>Embedded Chat</ins>

RC4Conferences integrates the [RC Embedded Chat Component](https://github.com/RocketChat/EmbeddedChat) to enable smooth and real-time communication during the live conferences, between the Speakers and the Event Attendees.

For trying out the Embedded Chat in __RC4Conf erences__, please setup the Embedded Chat by following the instructions [here](https://github.com/RocketChat/EmbeddedChat#setting-up-authentication) from the steps mentioned in there note down the Google Cloud Client ID and the Rocket Chat instance url. Now after getting the Google Cloud Client ID and the Rocket Chat instance url paste them in the `app/.env` with the following key name,
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your google client id"
NEXT_PUBLIC_RC_URL="your url of the RC instance"
NEXT_PUBLIC_RC_ROOM_ID="public channel room id"
```

_The `NEXT_PUBLIC_RC_ROOM_ID` defaults to "GENERAL"._

**Optional Starts

### <ins>GreenRoom Setup</ins>
In RC4Conferences, the greenroom page is the space where the Event Speakers come together, and speak. The Speaker interface is built on top of [Jitsi React SDK](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-sdk/),



3. For Greenroom and Mainstage Page to work, there is a need to add some additional environment vars (`app/.env`), which are as followed.
```
NEXT_PUBLIC_IPINFO_TOKEN="token from ipinfo"
NEXT_PUBLIC_ROCKET_CHAT_GREENROOM_RTMP="rtmp url to broadcast the stream"
NEXT_PUBLIC_SERVER_STREAM_LINK0="Asia server broadcast link"
NEXT_PUBLIC_SERVER_STREAM_LINK1="Any other region server broadcasr link"
``` 
For more detail on how to get ipinfo token and server links, please read [here](./docs/components/serverStreaming/README.md)

**Optional Ends

Once all the environment variables are set run the following script to start the NextJS frontend.
```
sh startNext.sh localhost

sh startNextGp.sh localhost (Only for Gitpod Users)
```
>Note: Please replace the "localhost" with your static IP if you are doing environment setup on your VM.

4. Once the development server is launched create a dummy event by following the link in the top nav to `Admin>Create`.

5. After the event is created, visit the Greenroom page since only one event is there, vist the url `/conferences/greenroom/1` and the subsequent event mainstage on `conferences/mainstage/1`

(Note: In the following PR, the dummy event create would be implemented, please stay tuned.)

Development Info:
1. The Strapi admin portal would be opnened by default while starting the development setup.
2. The NextJS url would be shown in the logs for reference
```
> rc4community@0.3.0 dev
> next dev


> backend@0.1.0 build
> strapi build

ready - started server on 0.0.0.0:3000, url: http://localhost:3000 <-- your NextJS locahost url

```
3. On visiting the NextJS app localhost url first time, first login using the dummy login button, then do a refresh to load the admin menu.
(Currently, for development purpose we are using defult secret values).

> For production deployments, please change the secret values in `open-event-server/.env.example` and ``open-event-server/.env.dev.app``

### Route Details

The preview components are displayed on the pages starting `/conferences`.

1. On the root `localhost:3000/conferences` page, there is a button **Create Event!** which redirects the users to the Event Create page.

>Fun try: Try refreshing the `/conferences` page. (Hint: Background image)

2. If a user is not signed in, they will be redirected to `/conferences/confAuth` page, which helps to get sign in or sign up.
3. If a user is already signed in, then they will be redirected to `/conferences/create/basic-detail` page. 
4. Currently, only the basic events data are used to publish the event which includes - Event name, Event start Date, Event end Date, Ticket name, Ticket Quantity, and Ticket Type.

> Please Note: Currently, all the ticket types would be free by default.

5. The `Next` button will save the Event as a Draft, and the `Publish` button will directly publish the event.

6. The other sections **Speakers** and **Other Details** will be soon implemented. Please look forward to trying out them.

### Screenshots
The screenshot of `/conferences` page.
<img src="https://user-images.githubusercontent.com/61188295/175766978-24a765d4-3d53-4eb9-8107-bee0569de380.png" alt="event home page">

### Additional Resources
[Open Event Server custom deployment docs](./open-event-server/README.md)

[Fauna Superprofile local docker custom setup docs](./superprofile/README.md)

[Fauna Superprofile SaaS custom setup docs](./superprofile/cloud/README.md)

[Details about different env files in open-event-server directory](./open-event-server/README.md#details-about-different-env-files)