import json

# Define the increment value
increment_value = 9

# Read the JSON file
with open('session_sorted.json', 'r') as file:
    data = json.load(file)

# Function to recursively update event_id in the JSON data
def update_event_id(obj, increment):
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key == 'id':
                try:
                    # Try to convert the value to an integer
                    int_value = int(value)
                    # Increment the value
                    int_value += increment
                    # Convert it back to string if it was originally a string
                    obj[key] = str(int_value) if isinstance(value, str) else int_value
                    print(f"Updated event_id to {obj[key]}")  # Debugging line
                except ValueError:
                    # If conversion fails, skip this value
                    pass
            else:
                update_event_id(value, increment)
    elif isinstance(obj, list):
        for item in obj:
            update_event_id(item, increment)

# Update the event_id values
update_event_id(data, increment_value)

# Write the updated JSON back to the file
with open('session_sorted.json', 'w') as file:
    json.dump(data, file, indent=4)