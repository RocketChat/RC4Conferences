SPEAKER_DATA=$( cat var/log/seed/speakers.json )
EVENT_DATA=$( cat var/log/seed/event.json )
TICKET_DATA=$( cat var/log/seed/ticket.json )

printf "\nINSERT into events
SELECT * FROM
  json_populate_record(
    null::events,
    '$EVENT_DATA'
  );" >> var/log/seed/seed_event.sql

printf "\nINSERT into speaker
SELECT * FROM
  json_populate_recordset(
    null::speaker,
    '$SPEAKER_DATA'
  );" >> var/log/seed/seed_speaker.sql

printf "\nINSERT into tickets
SELECT * FROM
  json_populate_record(
    null::tickets,
    '$TICKET_DATA'
  );" >> var/log/seed/seed_ticket.sql

