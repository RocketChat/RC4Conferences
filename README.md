# RC4Conferences

Rocket Chat for Virtual Conferences a.k.a __RC4Confernces__ (in short) is a set of scalable components for communities to build, manage, and run virtual conferences of any size. RC4Conferences extends [RC4Community](https://github.com/RocketChat/RC4Community) which is a set of tools to build and grow massive online communities with Rocket.Chat.

> TL;DR try-out the project within minutes, check all the [Pre-requisites](#pre-requisites), and setup following [⚡Instant Setup ~1.5 minutes](#instant-setup-15-minutes).

Got questions? Or want to discuss any idea for the project, feel free to drop by and say "Hi": [Rocket.Chat](https://open.rocket.chat/direct/evan.shu), [Gmail](mailto:sdevanshu90@gmail.com)

## Table of Contents

- [ Installation](#installation)
    - [Pre-requisites](#pre-requisites)
    - [⚡Instant Setup ~1.5 minutes](#instant-setup-15-minutes-⚡)
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

# Instant Setup ~1.5 minutes
To try out the project within minutes, run the following two bash commands, and you will be good to go:

<ins>Local Setup</ins>
```bash
sh startdevenv.sh localhost
sh startNext.sh localhost
```
<ins>Gitpod Setup</ins>
```bash
sh startdevenv.sh localhost
sh startNextGp.sh localhost
```
_Note: Please replace the "localhost" (127.0.0.1) with your static IP if you are doing environment setup on your VM. For e.g. `173.456.1.19`_

Now you can try out the following:
- [Preview an Event](#preview-an-event)
- [Create an Event](#create-an-event)
- [Explore Admin Dashboard](#admin-dashboard---manage-events)

Tried all of the above? And want to explore the project further, then please refer to this [section](./docs/conferences/dayofevent/README.md) for trying out the following:

- [Role Based access](#role-based-access)
- [Greenroom and Mainstage page](#greenroom-and-mainstage-page)

Want more? Interested in learning in-depth installation/setup, then go ahead and read the [detailed setup](./docs/conferences/README.md). 

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


### Additional Resources
[Open Event Server custom deployment docs](./open-event-server/README.md)

[Fauna Superprofile local docker custom setup docs](./superprofile/README.md)

[Fauna Superprofile SaaS custom setup docs](./superprofile/cloud/README.md)

[Details about different env files in open-event-server directory](./open-event-server/README.md#details-about-different-env-files)
