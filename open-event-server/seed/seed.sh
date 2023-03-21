INIT_FLAG=var/log/seed/init_db

if [ ! -e $INIT_FLAG ];then
    sh var/log/seed/sqlc.sh | exit 1
    
    echo "--Cleaning Up the database--"
    PGPASSWORD=opev_pass psql -h opev-postgres -p 5432 -U open_event_user open_event -f var/log/seed/seed.sql
    echo "--Creating SQL files--"
    psql -U open_event_user open_event -f var/log/seed/tmp/seed_event.sql
    psql -U open_event_user open_event -f var/log/seed/tmp/seed_speaker.sql
    psql -U open_event_user open_event -f var/log/seed/tmp/seed_ticket.sql

    psql -U open_event_user open_event -f var/log/seed/tmp/seed_open_event.sql
    psql -U open_event_user open_event -f var/log/seed/tmp/seed_open_speaker.sql
    psql -U open_event_user open_event -f var/log/seed/tmp/seed_open_ticket.sql

    psql -U open_event_user open_event -f var/log/seed/tmp/seed_coffee_meet.sql
    psql -U open_event_user open_event -f var/log/seed/tmp/seed_coffee_meet_speaker.sql
    psql -U open_event_user open_event -f var/log/seed/tmp/seed_coffee_meet_ticket.sql

    echo "--Removing dangling SQL files--"
    rm -f var/log/seed/tmp/*.sql
    touch $INIT_FLAG

else
    echo "--Database initilalization is already done--"
fi



