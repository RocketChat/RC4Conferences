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

3. Run the below line to copy the value of `dbkey` and paste in the `app/.env`
```
echo -n "NEXT_PUBLIC_FAUNA_SECRET=" | cat - ./log/dbkey >> ../app/.env
```
4. Also, add the url for doing mutations.
```
echo NEXT_PUBLIC_FAUNA_DOMAIN="http://localhost:8084/graphql" >> ../app/.env
```
Congrats 🎉! The Superprofile setup is done.