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