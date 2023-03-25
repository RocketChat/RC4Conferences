#!/bin/sh

STRAPI_PORT=1337
counter=0
watchdog=5
watchtimer=0

trap_ctrlc ()
{
    # perform cleanup here
    echo "--performing clean up--"
    chmod +x cleanup.sh
    ls
    sh cleanup.sh
 
    # exit shell script with error code 2
    # if omitted, shell script will continue execution
    exit 2
}
 
# initialise trap to call trap_ctrlc function
# when signal 2 (SIGINT) is received
trap "trap_ctrlc" 2

check_and_set_strapi_port() {

    if lsof -Pi :$STRAPI_PORT -sTCP:LISTEN -t >/dev/null && [ "$counter" -lt $watchdog ]; then
        echo "Strapi port $STRAPI_PORT already occupied, changing to the next consecutive port"
        STRAPI_PORT=$((STRAPI_PORT+1))
        counter=$((counter+1))
        check_and_set_strapi_port
    elif [ "$counter" -ge $watchdog ]; then
        echo "\033[31m Unable to allocate an empty port for Strapi, the last tried port was $STRAPI_PORT\e[0m"
        echo "Please either change the $STRAPI_PORT to an other random number or to an unused port number"
        exit 1
    else
        echo "🚀 An empty port found for Strapi🚀"
    fi
}

version() { echo "$@" | awk -F. '{ printf("%d%03d%03d%03d\n", $1,$2,$3,$4); }'; }

echo "--Verifying the pre-requisites in the environment--"

if ! which node > /dev/null; then
    echo "\033[31m***NodeJS is not installed, please install and try again\e[31m"
    exit 1
fi

if ! which npm > /dev/null; then
    echo "\033[31m***npm is not installed, please install and try again\e[31m"
    exit 1
fi

echo "--Checking Node version--"
NODE_VER=$( node -v | cut -c 2-9 )
if [ $(version $NODE_VER) -ge $(version "16.0.0") ]; then
    echo "***Node version is up to date"
else 
    echo "\033[31m***NodeJS version >= 16 is required for the application to work\e[31m"
    exit 1
fi

sh startBackend.sh $1 $2

while [ $? -ne 0 ] && [ $watchtimer -lt 5 ]
do
    watchtimer=$((watchtimer+1))
    sh startBackend.sh $1 $2
done

if [ $? -eq 1 ];then
    echo "\033[31m***Unable to successfully launch the superprofile or open-event-server container, please view the logs for more info and resolve&rerun the script***\e[0m"
    exit 1
fi

check_and_set_strapi_port
counter=0

printf '\nNEXT_PUBLIC_STRAPI_API_URL'="http://$1:$STRAPI_PORT" >> app/.env
printf '\nNEXT_PUBLIC_EVENT_SPK_MAIL'="dhgysfmedomihkzkwv@kvhrr.com" >> app/.env
printf '\nNEXT_PUBLIC_EVENT_ANON_MAIL'="anon@pikapii.com" >> app/.env

sh strapi.sh $STRAPI_PORT

cd ..


