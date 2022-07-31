#!/bin/sh
ERR_FILE=open-event-server/log/err_log.txt
echo "--Starting the Open Event server--"
cd open-event-server
sh startOes.sh

echo "--Starting Superprofile Backend--"
cd ../superprofile
sh initFaunaOnce.sh
cd ..

OES_CONTAINER_ID=$( docker ps -q -f name=opev-web )
FAUNA_CONTAINER_ID=$( docker ps -q -f name=faunadb )

if [ -s $ERR_FILE ];then
    echo "***Some error occurred while starting the Open Event Server please check open-event-server/$ERR_FILE , resolve them, and then re-run the init command***"
fi
if [ -z $OES_CONTAINER_ID ]; then
    echo "***Open-event-server Docker container was unable to install and start***"
fi
if [ -z "$FAUNA_CONTAINER_ID" ]; then
    echo "***FaunaDB container was unable to install and start***"
fi
