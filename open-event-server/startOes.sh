#!/bin/sh
ERR_LOG="please check err_log.txt file for more details";
ERR_FILE="log/err_log.txt"
INIT_FLAG="log/init_flag"
OES_CONTAINER_ID=$( docker ps -q -f name=opev-web )

if [ -e $INIT_FLAG ] && [ ! -z $OES_CONTAINER_ID ]; then
    echo "-- Open Event Server is already up and running --"
    exit 0
fi

if [ -s $ERR_FILE ]; then
    rm -r -f log/*
    echo "Error log files deleted"
fi

echo "--Creating required docker volumes--"
sh createvolumes.sh 2> $ERR_FILE || echo "ERROR WHILE CREATING VOLUMES\n$ERR_LOG"

echo "--Creating an .env file with .env.example as source--"
cp .env.example .env 2>> $ERR_FILE || echo "ERROR WHILE COPYING\n$ERR_LOG"

echo "--Downloading and starting the open-event docker images and containers--"

if [ "$2" = 'production' ]; then
    echo "--Starting the production build of Open Event Server--"
    docker-compose up -d
    echo "--Copying default environment variables to app/.env--"
    printf '\nNEXT_PUBLIC_EVENT_BACKEND_URL'="http://$1:8080" >> ../app/.env
    cat .env.prod.app >> ../app/.env
else
    echo "--Starting the development build of Open Event Server--"
    docker-compose -f docker-compose-dev.yml up -d
    echo "--Copying default environment variables to app/.env--"
    printf '\nNEXT_PUBLIC_EVENT_BACKEND_URL'="http://$1:8080" >> ../app/.env
    cat .env.dev.app >> ../app/.env
fi


if [ ! -s $ERR_FILE ]; then
    touch $INIT_FLAG
fi