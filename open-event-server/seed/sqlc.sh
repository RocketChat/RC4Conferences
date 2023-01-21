SPEAKER_DATA=$( cat var/log/seed/speakers.json )
EVENT_DATA=$( cat var/log/seed/event.json )
TICKET_DATA=$( cat var/log/seed/ticket.json )

OPEN_EVENT_DATA=$( cat var/log/seed/openCall.json )
OPEN_SPEAKER_DATA=$( cat var/log/seed/openCallSpeakers.json )
OPEN_TICKET=$( cat var/log/seed/openTicket.json )



printf "\nINSERT into events
SELECT * FROM
  json_populate_record(
    null::events,
    '$EVENT_DATA'
  );" >> var/log/seed/tmp/seed_event.sql

printf "\nINSERT into events
SELECT * FROM
  json_populate_record(
    null::events,
    '$OPEN_EVENT_DATA'
  );" >> var/log/seed/tmp/seed_open_event.sql

printf "\nINSERT into speaker
SELECT * FROM
  json_populate_recordset(
    null::speaker,
    '$SPEAKER_DATA'
  );" >> var/log/seed/tmp/seed_speaker.sql

printf "\nINSERT into speaker
SELECT * FROM
  json_populate_recordset(
    null::speaker,
    '$OPEN_SPEAKER_DATA'
  );" >> var/log/seed/tmp/seed_open_speaker.sql

printf "\nINSERT into tickets
SELECT * FROM
  json_populate_record(
    null::tickets,
    '$TICKET_DATA'
  );" >> var/log/seed/tmp/seed_ticket.sql

printf "\nINSERT into tickets
SELECT * FROM
  json_populate_record(
    null::tickets,
    '$OPEN_TICKET'
  );" >> var/log/seed/tmp/seed_open_ticket.sql


