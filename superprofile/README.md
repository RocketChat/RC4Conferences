### SuperProfile Setup

1. In the directory `/superprofile`, run
```
docker-compose up -d
```
>To check the progress of the container run, please run 
```
docker logs faunadb
```

2. Once the container is up and running, run the following script
```
docker exec -it faunadb /bin/sh  /var/log/faunadb/initialize.sh
```
On a successful run two files would be created an flag file `init_flag` to track the first time data initialization run, and an `dbkey` which holds the Database key.

3. Copy the value of `dbkey` and paste in the `app/.env` as
```
NEXT_PUBLIC_FAUNA_SECRET="dbkey goes here"
```
4. Also, add the following url for doing mutations.
```
NEXT_PUBLIC_FAUNA_DOMAIN="http://localhost:8084/graphql"
```
Congrats 🎉! The Superprofile setup is done.