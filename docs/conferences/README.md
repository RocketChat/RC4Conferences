# Detailed Installation 

## Table of Contents
- [ Installation](#installation)
    - [Pre-requisites](#pre-requisites)
    - [🐌 Detailed Local Development Setup](#local-development-setup)
        - [Server-Side](#server-side-setup)
        - [Client-Side](#client-side-setup)
    - [Gitpod Development Setup](#gitpod-development-setup)
        - [Server-Side](#server-side-setup-1)
        - [Client-side](#client-side-setup-1)
    - [Day of Event Setup (Optional)](#day-of-event-setup-optional)
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

The server-side of RC4Conferences comprises of Eventyay's [Open Event Server](https://github.com/fossasia/open-event-server) Docker Image, [FaunaDB development Docker Image](https://docs.fauna.com/fauna/current/build/tools/dev), and [Strapi CMS](https://strapi.io/). To start all of the services simulataneously, please run the following, 
 
```
sh startdevenv.sh localhost
```
_Note: Please replace the "localhost" (127.0.0.1) with your static IP if you are doing environment setup on your VM. For e.g. `173.456.1.19`_

The above script shall execute successfully and open up 5 ports 
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
The client-side of RC4Conferences is developed using NextJS, to start the development environment of NextJS using docker run the following command
```
sh startNext.sh localhost --docker
```
_Note: Please replace the "localhost" (127.0.0.1) with your static IP if you are doing environment setup on your VM. For e.g. `173.456.1.19`_

On a successful execution of script, the NextJS will start on port `3000` (default) or if it is occupied the next available port shall be used e.g., `3001`.

Congratulations! 🎉 You have successfully setup both the Client-Side and Server-Side. 

> fun-try: You can press period <kbd>.</kbd> key to open up VS code style code reader on any GitHub repository.

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

For setting up the Greenroom and Mainstage Page components, please read [this](./dayofevent/README.md).

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