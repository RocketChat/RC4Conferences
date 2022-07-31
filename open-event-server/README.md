# open event server 

Components in RC4Conferences require an embedded instance of open-event-server to handle server-side behaviors.  
You will need the latest `docker` and docker-compose` installed.   

Run the below to create a `.env` file.
```
cp .env.example .env
```
Once above is completed replace the `SECRET_KEY` with an super secret key.

Then, run once on the system:

```
sh createvolumes.sh
```

This will create the persistent volumes for `redis` and `postgres`.


You can then use standard docker-compose to start your server:

```
docker-compose up -d
```

Or to take down the servers:

```
docker-compose down
```

### Details about different .env files

1. __.env.dev.app__ -> Contains the required environment variables that needs to be populated in the client side NextJS application.

2. __.env.example__ -> Contains the required secretKey environment variable that needs to start the Open Event Server, one could modify this secret, well it won't affect for development purposes.

3. __.env.old__ -> Contains a list of all environment variables which a user could define, for advanced users, who needs to modify the credentials of PostgresDB.

