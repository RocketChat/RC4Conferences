waittime=30
docker compose up -d
echo "Waiting $waittime seconds for container to get shipped..."
sleep $waittime
FAUNA_CONTAINER_ID=$( docker ps -q -f name=faunadb )
DBF="log/init_key_flag"
if [ -z "$FAUNA_CONTAINER_ID" ]
then
    echo "FaunaDB container ain't shipped correctly, please restart"
else
    docker exec -it faunadb /bin/sh  /var/log/faunadb/initialize.sh
    if [ -f log/dbkey ] && [ ! -f log/init_key_flag ]; then
        echo "Copying over secrets to ../app/.env"
        printf '\nNEXT_PUBLIC_FAUNA_SECRET=' | cat - ./log/dbkey >> ../app/.env &&
        printf '\nNEXT_PUBLIC_FAUNA_DOMAIN'="http://localhost:8084/graphql" >> ../app/.env
        touch $DBF &&
        echo "-- All set, superprofile launch 🚀"
    else
        echo "No need to copy over twice 😉" 
    fi
fi