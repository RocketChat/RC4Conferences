import json
from datetime import datetime, timedelta

# Read the JSON file
with open('session.json', 'r') as file:
    sessions = json.load(file)

# Initialize the new start time to 10:00 UTC on 12th September 2024
new_start_time = datetime.strptime("2024-09-12T10:00:00Z", "%Y-%m-%dT%H:%M:%SZ")

# Iterate through each session and update the "Start" and "End" times
for session in sessions:
    session['Start'] = new_start_time.isoformat() + 'Z'
    new_end_time = new_start_time + timedelta(minutes=15)
    session['End'] = new_end_time.isoformat() + 'Z'
    new_start_time = new_end_time  # The next session starts when this one ends

# Save the updated JSON data back to the file
with open('session.json', 'w') as file:
    json.dump(sessions, file, indent=4)

print("Session times updated successfully.")