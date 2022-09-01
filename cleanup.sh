OES_CONTAINER_ID=$( docker ps -q -f name=opev-web )
FAUNA_CONTAINER_ID=$( docker ps -q -f name=faunadb )

echo "--Stopping the Open Event server--"

if [ ! -z $OES_CONTAINER_ID ]; then
    cd open-event-server
    docker-compose down -v
    cd ..
fi

echo "--Stopping Superprofile Backend--"

if [ ! -z $FAUNA_CONTAINER_ID ]; then
    cd superprofile
    docker-compose down
    cd ..
fi