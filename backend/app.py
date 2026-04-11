import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = "TIX5YYUI8WVVYKG9"  # paste your key here

@app.route('/api/test')
def test():
    symbol = "AAPL"
    url = f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={API_KEY}"
    
    response = requests.get(url)
    data = response.json()
    
    return jsonify({
        "name": data.get("Name"),
        "symbol": data.get("Symbol"),
        "PE_ratio": data.get("PERatio"),
        "PB_ratio": data.get("PriceToBookRatio"),
        "dividend_yield": data.get("DividendYield"),
        "debt_to_equity": data.get("DebtToEquityRatio"),
        "ROE": data.get("ReturnOnEquityTTM"),
    })

if __name__ == '__main__':
    app.run(debug=True)