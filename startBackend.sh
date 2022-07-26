#!/bin/sh
ERR_FILE=open-event-server/log/err_log.txt
echo "--Starting the Open Event server--"
cd open-event-server
sh startOes.sh

echo "--Starting Superprofile Backend--"
cd ../superprofile
sh initFaunaOnce.sh
cd ..

if [ -s $ERR_FILE ];then
    echo "***Some error occurred while starting the Open Event Server please check open-event-server/$ERR_FILE , resolve them, and then re-run the init command***"
fi