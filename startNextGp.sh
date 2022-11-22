NEXTJS_PORT=3000

check_and_set_next_port() {
    if lsof -Pi :$NEXTJS_PORT -sTCP:LISTEN -t >/dev/null && [ "$counter" -lt $watchdog ]; then
        echo "NextJS port $NEXTJS_PORT already occupied, changing to the next consecutive port"
        NEXTJS_PORT=$((NEXTJS_PORT+1))
        counter=$((counter+1))
        check_and_set_next_port
    elif [ "$counter" -ge $watchdog ]; then
        echo "\033[31mUnable to allocate an empty port for NextJS, the last tried port was $NEXTJS_PORT\e[0m"
        echo "Please either change the $NEXTJS_PORT to an other random number/unused port number"
        echo "After changes re-run the script"
        exit 1
    else
        echo "🚀 An empty port found for NextJS 🚀"
    fi
}
check_and_set_next_port
export NEXT_PUBLIC_API_URL=$(gp url 3000)
export NEXT_PUBLIC_FAUNA_DOMAIN=$(gp url 8084)/graphql
gp ports visibility 8084:public
export NEXT_PUBLIC_EVENT_BACKEND_URL=$(gp url 8080)
gp ports visibility 8080:public



export NEXT_PUBLIC_PORT=$NEXTJS_PORT
printf '\nNEXT_PUBLIC_API_URL'="http://$1:$NEXTJS_PORT" >> app/.env

cd app
npm i
npm run dev