# RC4Conferences
A set of scalable components for communities to build, manage, and run virtual conferences of any size.

<h2 align='center'>🚀 Developer quick start 🚀</h2>
<p align='center'> Development - Build - Production </p>

## 💻 Developers Quick Start

First, visit the `open-event-server` directory and follow the instructions there.


Then set the `.env` variables for development purpose and link to the embedded backend.
```
NEXT_PUBLIC_EVENT_BACKEND_URL = "http://localhost:8080"
```

### Start Strapi CMS
```
cd cms
npm i
INITIALIZE_DATA=true npm run develop
```

The application is written on nextjs and deployable on all nextjs compatible CDN + microservices and scaled deployment platforms. For build and design, start it in a shell:

```
cd app
npm i
npm run dev
```
> Superprofile Admin Role

To access the Admin section which includes the Event Create Menu, there would be a need to setup the Superprofile, currently we use FaunaDB for handling this.
Follow this [link](https://graphql.workshops.fauna.com/building/build-with-nextjs/client-setup/#creating-a-front-end-role) instructions to get the Fauna key, then paste it in the `.env` as:
```
NEXT_PUBLIC_FAUNA_SECRET="your private key"
```
To get more familiar with Fauna here is a quick short [workshop link](https://graphql.workshops.fauna.com/getting-started/)

Or here is a quick guide to get started with Fauna:
1. Head to [dashboard.fauna.com](https://dashboard.fauna.com/), if you are logged in, click __CREATE DATABASE__, choose the US server.
<img width="356" alt="image" src="https://user-images.githubusercontent.com/61188295/178947597-158a4c05-3c92-4ba6-87df-c3a808f79134.png">
2. In the left section click the __GraphQL__ and then __IMPORT SCHEMA__; schema to be uploaded is located in `../assets/rc4community-schema.graphql`.
3. Go to the __Functions__ tab, there will be two functions, in the UpserUser, replace it with the following function code.
<details>
<summary>UpsertUser function</summary>

```
Query(
  Lambda(
    ["uid", "email", "displayName", "phoneNumber", "photoURL"],
    Let(
      {
        user: Match(Index("getByEmail"), Var("email")),
        upsert: If(
          Exists(Var("user")),
          Update(Select(["ref"], Get(Var("user"))), {
            data: {
              displayName: Var("displayName"),
              phoneNumber: Var("phoneNumber"),
              photoURL: Var("photoURL")
            }
          }),
          Create(Collection("User"), {
            data: {
              uid: Var("uid"),
              email: Var("email"),
              displayName: Var("displayName"),
              phoneNumber: Var("phoneNumber"),
              photoURL: Var("photoURL")
            }
          })
        )
      },
      Var("upsert")
    )
  )
)
```
</details>

4. Under the __Security__ tab click on __NEW KEY__ no need to modify anything, go with defaults, then hit the __SAVE__, copy the _KEY'S SECRET_ and paste it in the `.env` as:
```
NEXT_PUBLIC_FAUNA_SECRET="your key's secret"
```
5. Create the first basic user using the __GraphQL__ tab, following is the mutation schema of a GraphQL query to create a user
```
mutation {
  createUser(data: {
    displayName: "YOUR_NAME"
    email: "YOUR_EMAIL"
    uid: "ANY_UNIQUE_NUMBER"
    events: {
      create: {
        role: "Admin"
        email: "YOUR_EMAIL"
      }
    }
  }) {
    _id
    displayName
  }
}
```
6. Copy the email address and in the browser console run
```
document.cookie="user_mail=YOUR_EMAIL"
```
(Note: YOUR_EMAIL should be same as the user created in step 5)

7. Congrats! and thank you! for reading this. With this you are all set, to access Admin menus.

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
