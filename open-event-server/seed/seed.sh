# psql -U open_event_user open_event -f var/log/seed/bash_script.txt
sh var/log/seed/sqlc.sh
psql -U open_event_user open_event -f var/log/seed/seed.sql