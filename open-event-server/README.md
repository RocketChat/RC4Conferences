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

