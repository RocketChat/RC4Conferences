#!/bin/sh
ERR_FILE=open-event-server/log/err_log.txt
INIT_DB=open-event-server/seed/init_db
OES_CONTAINER_ID=$( docker ps -q -f name=opev-web )
FAUNA_CONTAINER_ID=$( docker ps -q -f name=faunadb )

echo "--Starting the Open Event server--"
cd open-event-server
sh startOes.sh

echo "--Starting Superprofile Backend--"
cd ../superprofile
sh initFaunaOnce.sh
cd ..

if [ -s $ERR_FILE ];then
    echo "\033[31m***Some error occurred while starting the Open Event Server please check open-event-server/$ERR_FILE , resolve them, and then re-run the init command***\e[0m"
fi
if [ -z $OES_CONTAINER_ID ]; then
    echo "\033[31m***Open-event-server Docker container was unable to install and start, please rerun the script***\e[0m"    
else
    cd open-event-server
    docker exec -it opev-postgres /bin/sh /var/log/seed/seed.sh
    cd ..
    if [ ! -z $INIT_DB ];then
        echo echo "\033[31m***Open-event-server DB was not seeded with demo event, please check pg logs***\e[0m"
        exit 1
    fi
fi
if [ -z $FAUNA_CONTAINER_ID ]; then
    echo $FAUNA_CONTAINER_ID
    echo "\033[31m***FaunaDB container was unable to install and start, please rerun the script***\e[0m"
fi
