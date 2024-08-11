import json
from datetime import datetime, timedelta

# Read the JSON file
with open('session_sorted.json', 'r') as file:
    sessions = json.load(file)

# Initialize the start date
start_date = datetime(2024, 9, 1, 6, 0, 0)

# Iterate through each session and update the "Start" and "End" dates
for session in sessions:
    duration = session['Duration']
    session['Start'] = start_date.isoformat() + 'Z'
    end_date = start_date + timedelta(minutes=duration)
    session['End'] = end_date.isoformat() + 'Z'
    start_date = end_date  # Update start_date for the next session

# Save the updated JSON data back to the file
with open('session_sorted.json', 'w') as file:
    json.dump(sessions, file, indent=4)