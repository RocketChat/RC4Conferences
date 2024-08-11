import json

# List of usernames
usernames = [
    "yuriko.kikuchi",
    "singh.ashutosh",
    "anjaneya.gupta",
    "sandeep.pillai",
    "abhi.patel",
    "akshun.kuthiala",
    "aman.negi",
    "anjaneya.gupta",
    "hardik.bhatia",
    "hunter.xia",
    "jeffrey.yu",
    "maria.khelli",
    "prisha.gupta",
    "sandeep.pillai",
    "umang.utkarsh",
    "vipin.chaudhary",
    "zishan.ahmad",
    "sayan.banerjee"
]

# Read the JSON file
with open('speakers.json', 'r') as file:
    speakers = json.load(file)

# Function to update photo_url if name matches username
def update_photo_url(speakers, usernames):
    for speaker in speakers:
        if speaker.get('id', 0) >= 5:
            name = speaker.get('name', '').lower()
            first_name = name.split()[0]  # Get the first name
            for username in usernames:
                if first_name in username:
                    speaker['photo_url'] = f"https://open.rocket.chat/avatar/{username}"
                    break

# Update the photo_url values
update_photo_url(speakers, usernames)

# Save the updated JSON data back to the file
with open('speakers.json', 'w') as file:
    json.dump(speakers, file, indent=4)