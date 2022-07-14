# open event server 

Components in RC4Conferences require an embedded instance of open-event-server to handle server-side behaviors.  
You will need the latest `docker` and docker-compose` installed.   

Then first, run once on the system:

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

