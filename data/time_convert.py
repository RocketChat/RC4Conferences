from datetime import datetime

# Define the base date
base_date = "2024-09-01"

# List of time intervals
time_intervals = [
    ("6:00", "6:05"),
    ("6:05", "6:20"),
    ("6:20", "6:35"),
    ("6:35", "6:50"),
    ("6:50", "7:05"),
    ("7:05", "7:20"),
    ("7:20", "7:35"),
    ("7:35", "7:50"),
    ("7:50", "8:05"),
    ("8:05", "8:20"),
    ("8:20", "8:35"),
    ("8:35", "8:50"),
    ("8:50", "9:05"),
    ("9:05", "9:20"),
    ("9:20", "9:35"),
    ("9:35", "9:50"),
    ("9:50", "10:05"),
    ("10:05", "10:20"),
    ("10:20", "10:35"),
    ("10:35", "10:50"),
    ("10:50", "11:05"),
    ("11:05", "11:20"),
    ("11:20", "11:25")
]

# Function to convert time to datetime format
def convert_to_datetime(base_date, time_str):
    datetime_str = f"{base_date} {time_str}"
    datetime_obj = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
    return datetime_obj.strftime("%Y-%m-%dT%H:%M:%SZ")

# Convert and print the time intervals
for start_time, end_time in time_intervals:
    start_datetime = convert_to_datetime(base_date, start_time)
    end_datetime = convert_to_datetime(base_date, end_time)
    print(f"StartTime: {start_datetime}, EndTime: {end_datetime}")