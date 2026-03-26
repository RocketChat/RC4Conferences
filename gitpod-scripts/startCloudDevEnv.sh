#!/bin/sh

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

gp sync-done Dependencies_Check

sh startCloudNext.sh