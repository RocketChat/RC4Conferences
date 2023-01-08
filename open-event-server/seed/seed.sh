INIT_FLAG=var/log/seed/init_db

if [ ! -z $INIT_FLAG ];then
    sh var/log/seed/sqlc.sh | exit 1
    touch $INIT_FLAG
    echo "--Cleaning Up the database--"
    psql -U open_event_user open_event -f var/log/seed/seed.sql
    echo "--Creating SQL files--"
    psql -U open_event_user open_event -f var/log/seed/seed_event.sql
    psql -U open_event_user open_event -f var/log/seed/seed_speaker.sql
    psql -U open_event_user open_event -f var/log/seed/seed_ticket.sql

    echo "--Removing dangling SQL files--"
    rm -rf var/log/seed/seed_event.sql var/log/seed/seed_speaker.sql var/log/seed/seed_ticket.sql

else
    echo "--Database initilalization is already done--"
fi



