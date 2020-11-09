import pandas as pd


# read data
rawData = pd.read_csv("CPSC-583-Project-Data.csv")
headers = list(rawData.columns)

# new table
newFormat = pd.DataFrame(columns=('Date', 'Ticker', 'Price'))

offset = 0
for index, row in rawData.iterrows():
    # add 11 rows to new table
    idx = 0
    offset += 11
    while idx < len(headers)-1:
        newFormat.loc[offset + idx, 'Date'] = row[0]
        newFormat.loc[offset + idx, 'Ticker'] = headers[idx+1]
        newFormat.loc[offset + idx, 'Price'] = row[idx+1]
        idx += 1

print(newFormat.head(22))
newFormat.to_csv('C:/users/gordi/Desktop/Code/Projects/StockMarketVisual/FormattedData.csv', index=False)