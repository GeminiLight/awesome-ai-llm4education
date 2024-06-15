import pandas as pd

# Load data into a DataFrame
df = pd.read_csv('papers.csv')

# Reorder the columns
df = df[['category', 'publisher', 'year', 'type', 'is_llm_related', 'title', 'link', 'authors', 'code']]

# Ensure the 'publisher' column values are enclosed in double quotes if they are not already
df['publisher'] = df['publisher'].apply(lambda x: f'{x}' if not x.startswith('"') else x)

# Sort the DataFrame based on category, publisher, year, and type
df = df.sort_values(by=['category', 'publisher', 'year', 'type'])

# Save the processed DataFrame to a new CSV file
df.to_csv('processed_data.csv', index=False)

# Display the processed DataFrame
df
