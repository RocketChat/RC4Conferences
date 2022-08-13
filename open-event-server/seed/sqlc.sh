SPEAKER_DATA=$( cat var/log/seed/speakers.json )
EVENT_DATA=$( cat var/log/seed/event.json )

printf "\nINSERT into events
SELECT * FROM
  json_populate_record(
    null::events,
    '$EVENT_DATA'
  );" >> var/log/seed/seed.sql

printf "\nINSERT into speaker
SELECT * FROM
  json_populate_recordset(
    null::speaker,
    '$SPEAKER_DATA'
  );" >> var/log/seed/seed.sql

