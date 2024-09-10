import json
from datetime import datetime, timedelta

# Read the JSON file
with open('session.json', 'r') as file:
    sessions = json.load(file)

# Initialize the new start date to 10 AM UTC 1st September 2024
new_start_date = datetime(2024, 9, 1, 10, 0, 0)

# Iterate through each session and update the "Start" and "End" dates
for session in sessions:
    duration = session['Duration']
    session['Start'] = new_start_date.isoformat() + 'Z'
    end_date = new_start_date + timedelta(minutes=duration)
    session['End'] = end_date.isoformat() + 'Z'
    new_start_date = end_date  # Update new_start_date for the next session

# Save the updated JSON data back to the file
with open('session.json', 'w') as file:
    json.dump(sessions, file, indent=4)

print("Session times updated successfully.")