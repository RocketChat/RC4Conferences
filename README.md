# RC4Conferences
A set of scalable components for communities to build, manage, and run virtual conferences of any size.

<h2 align='center'>🚀 Developer lightning quick start 🚀</h2>
<p align='center'> Development - Build - Production </p>

To start the development environment simply run the following, the script would handle all process and would output error if there is any, or else you'll be good to start developing.
```
sh startdevenv.sh
```
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