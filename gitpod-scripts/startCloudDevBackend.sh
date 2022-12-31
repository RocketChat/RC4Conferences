#!/bin/sh
watchtimer=0

sh startContainers.sh $1 $2

while [ $? -ne 0 ] && [ $watchtimer -lt 5 ]
do
    watchtimer=$((watchtimer+1))
    sh startCloudContainers.sh $1 $2
done

if [ $? -eq 1 ];then
    echo "\033[31m***Unable to successfully launch the superprofile or open-event-server container, please view the logs for more info and resolve&rerun the script***\e[0m"
    exit 1
fi
