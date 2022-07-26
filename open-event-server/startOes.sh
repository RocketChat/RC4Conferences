#!/bin/sh
ERR_LOG="please check err_log.txt file for more details";
ERR_FILE="log/err_log.txt"

if [ -s $ERR_FILE ]; then
    rm -r -f log/*
    echo "Error log files deleted"
fi

echo "--Creating required docker volumes--"
sh createvolumes.sh 2> $ERR_FILE || echo "ERROR WHILE CREATING VOLUMES\n$ERR_LOG"

echo "--Creating an .env file with .env.example as source--"
cp .env.example .env 2>> $ERR_FILE || echo "ERROR WHILE COPYING\n$ERR_LOG"

echo "--Downloading and starting the open-event docker images and containers--"
docker compose up -d

echo "--Copying default environment variables to app/.env--"
cat .env.dev.app >> ../app/.env