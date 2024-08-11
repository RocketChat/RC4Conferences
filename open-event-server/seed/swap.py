import json

# Read the JSON file
with open('speakers.json', 'r') as file:
    speakers = json.load(file)

# Iterate through each speaker and update the fields
for speaker in speakers:
    if 'short_biography' in speaker:
        speaker['long_biography'] = speaker.pop('short_biography')
    if 'position' in speaker:
        speaker['short_biography'] = speaker.pop('position')
    if 'organisation' in speaker:
        speaker['position'] = speaker.pop('organisation')

# Save the updated JSON data back to the file
with open('speakers.json', 'w') as file:
    json.dump(speakers, file, indent=4)