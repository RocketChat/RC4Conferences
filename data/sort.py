import json

# Read the JSON file
with open('session.json', 'r') as file:
    data = json.load(file)

# Check if the data is a list
if isinstance(data, list):
    # Sort the JSON array by the "id" field, converting ids to integers for comparison
    sorted_data = sorted(data, key=lambda x: int(x.get('id', 0)))

    # Write the sorted JSON back to the file
    with open('session_sorted.json', 'w') as file:
        json.dump(sorted_data, file, indent=4)

    print("JSON array sorted by 'id' and saved to 'session_sorted.json'.")
else:
    print("The JSON data is not an array.")