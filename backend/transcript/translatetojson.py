import csv
import json

# Function to read TSV file and convert to JSON
def tsv_to_json(file_path, output_path):
    # Open and read the TSV file
    with open(file_path, mode='r', encoding='utf-8') as tsv_file:
        # Use csv.DictReader to read the file
        reader = csv.DictReader(tsv_file, delimiter='\t')
        
        # Convert each row into a dictionary and collect them into a list
        json_data = [row for row in reader]
    
    # Write the JSON data into the output file
    with open(output_path, mode='w', encoding='utf-8') as json_file:
        json.dump(json_data, json_file, indent=4)

# File path for the input TSV file and the output JSON file
tsv_file_path = './transcribe.tsv'
json_output_path = './output.json'

# Convert TSV to JSON and write to file
tsv_to_json(tsv_file_path, json_output_path)
print(f"JSON output has been written to {json_output_path}")
