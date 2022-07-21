# RC4Conferences
A set of scalable components for communities to build, manage, and run virtual conferences of any size.

<h2 align='center'>🚀 Developer quick start 🚀</h2>
<p align='center'> Development - Build - Production </p>

## 💻 Developers Quick Start

First, visit the `open-event-server` [directory](./open-event-server/README.md) and follow the instructions there.


Then set the `.env` variables for development purpose and link to the embedded backend.
```
NEXT_PUBLIC_EVENT_BACKEND_URL = "http://localhost:8080"
```
Add a few other required `.env` variables which includes the email address for Event Admin and the passphrase required for encrypting mail address and generating passwords
```
EVENT_USER_PASSPHRASE = "your super secret phrase"
NEXT_PUBLIC_EVENT_ADMIN_MAIL="acat0@rocket.chat"
```

<hr />

### SuperProfile Setup

<details>
<summary>Fauna Local Docker Image Development Setup</summary>

For setting up the local development copy of Fauna, first run the below command to start the Fauna Docker image as a single developer node, with ephemeral data.
```
docker run --rm --name faunadb -p 8443:8443 -p 8084:8084 fauna/faunadb
```
Once the fauna dev node is up and running you will get the following output,
```
Cluster name: fauna
Node has initialized the cluster.
API endpoint: 0.0.0.0:8443
API(plain) endpoint: 0.0.0.0:8445
FaunaDB is ready.
``` 
In an another terminal window or tab, get and install the [fauna-shell](https://docs.fauna.com/fauna/current/build/integrations/shell/) using the below command please make sure to install it globally.
```
npm i -g fauna-shell
```
After the fauna-shell is installed, copy and run the below two commands
```
fauna create-database RC4Conference

fauna create-key RC4Conference
```
Copy the key generated after the second step and paste it in the `.env` as
```
NEXT_PUBLIC_FAUNA_SECRET="YOUR_SECRET_KEY_GOES_HERE"
NEXT_PUBLIC_FAUNA_DOMAIN="http://localhost:8084/graphql"
```
<hr/>
Break time:
Hey, if you are still following and got every step done, then you are already halfway through, thanks for the hard work.
<hr />
Continued...

Upload the GraphQL schema located in the `/assets/rc4community-schema.graphql`
```
fauna upload-graphql-schema PATH_TO_SCHEMA_FILE --secret=NEXT_PUBLIC_FAUNA_SECRET --endpoint=local --graphqlHost=localhost --graphqlPort=8084
```
> Tip: Head to the assets directory `cd RC4Conferences/assets` and replace PATH_TO_SCHEMA_FILE with `./rc4community-schema.graphql`

The above process will take few seconds, after it is successfully done, launch the fauna shell using the command
```
fauna shell RC4Conference
```
Output:
```
Starting shell for database RC4Conference
Connected to http://localhost:8443
Type Ctrl+D or .exit to exit the shell
RC4Conference>
```
In the shell paste the following the following FQL (Fauna Query Language) command to create a user.
```
Create(
  Collection('User'),
  {
    data: {
        uid: "001",
        email: "acat0@rocket.chat",
        displayName: "Evan.Shu",
    },
  },
)
```
Once done, the output would be:
```
{
  ref: Ref(Collection("User"), "337340672329646592"),
  ts: 1657971985240000,
  data: { uid: '001', email: 'acat0@rocket.chat', displayName: 'Evan.Shu' }
}
```
Run the following command to create Event Profile of a User, the __Admin__ (_case-sensitive_) role would be required to access Conference related components so keep it the same, please feel free to change the `email` field.
Replace the `user` field with the `ref` obtained in the above command(Creating a new user)
```
Create(
    Collection("EventUser"),
    {
        data: {
            email: "acat0@rocket.chat",
            role: "Admin",
            user: Ref(Collection("User"), "337340672329646592")
        }
    }
)
```

Congrats 🎉! You have successfully set-up an local instance of RC4 Superprofile.

</details>

<details>
<summary>Fauna Cloud/SaaS Setup</summary>

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
NEXT_PUBLIC_FAUNA_DOMAIN="https://graphql.us.fauna.com/graphql"

```
5. Create the first basic user using the __GraphQL__ tab, following is the mutation schema of a GraphQL query to create a user
```
mutation {
  createUser(data: {
    displayName: "YOUR_NAME"
    email: "NEXT_PUBLIC_EVENT_ADMIN_MAIL"
    uid: "ANY_UNIQUE_NUMBER"
    events: {
      create: {
        role: "Admin"
        email: "NEXT_PUBLIC_EVENT_ADMIN_MAIL"
      }
    }
  }) {
    _id
    displayName
  }
}
```

6. Congrats! and thank you! for reading this. With this you are all set, to access Admin menus.

</details>
<hr />

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
