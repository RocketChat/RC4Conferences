SPEAKER_DATA=$( cat var/log/seed/speakers.json )
EVENT_DATA=$( cat var/log/seed/event.json )
TICKET_DATA=$( cat var/log/seed/ticket.json )

OPEN_EVENT_DATA=$( cat var/log/seed/openCall.json )
OPEN_SPEAKER_DATA=$( cat var/log/seed/openCallSpeakers.json )
OPEN_TICKET=$( cat var/log/seed/openTicket.json )

COFFEE_MEET=$( cat var/log/seed/CoffeeMeet.json )
COFFEE_MEET_SPEAKER=$( cat var/log/seed/CoffeeMeetSpeakers.json )
COFFEE_MEET_TICKET=$( cat var/log/seed/CoffeeMeetTicket.json )

# Event populate

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

printf "\nINSERT into events
SELECT * FROM
  json_populate_record(
    null::events,
    '$COFFEE_MEET'
  );" >> var/log/seed/tmp/seed_coffee_meet.sql


# Speaker populate  

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

printf "\nINSERT into speaker 
SELECT * FROM
  json_populate_recordset(
    null::speaker,
    '$COFFEE_MEET_SPEAKER'
  );" >> var/log/seed/tmp/seed_coffee_meet_speaker.sql


# Ticket populate

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

printf "\nINSERT into tickets
SELECT * FROM
  json_populate_record(
    null::tickets,
    '$COFFEE_MEET_TICKET'
  );" >> var/log/seed/tmp/seed_coffee_meet_ticket.sql


