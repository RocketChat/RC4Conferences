INIT_FLAG=/var/log/seed/init_db

if [ ! -z $INIT_FLAG ];then
    sh var/log/seed/sqlc.sh | exit 1
    touch $INIT_FLAG
else
    echo "--Database initilalization is already done--"
fi

psql -U open_event_user open_event -f var/log/seed/seed.sql