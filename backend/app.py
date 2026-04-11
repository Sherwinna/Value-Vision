import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = "your_api_key_here"

# Small list of stocks to score for now
STOCKS = ["AAPL", "MSFT", "JNJ", "KO", "PG"]

def get_stock_data(symbol):
    url = f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={API_KEY}"
    response = requests.get(url)
    data = response.json()
    
    def safe_float(val):
        try:
            return float(val)
        except:
            return None

    return {
        "symbol": symbol,
        "name": data.get("Name"),
        "PE_ratio": safe_float(data.get("PERatio")),
        "PB_ratio": safe_float(data.get("PriceToBookRatio")),
        "dividend_yield": safe_float(data.get("DividendYield")),
        "ROE": safe_float(data.get("ReturnOnEquityTTM")),
        "debt_to_equity": safe_float(data.get("DebtToEquityRatio")),
    }

def score_stock(stock):
    score = 0

    # Lower P/E is better (good if under 20)
    if stock["PE_ratio"] and stock["PE_ratio"] < 20:
        score += (20 - stock["PE_ratio"])

    # Lower P/B is better (good if under 3)
    if stock["PB_ratio"] and stock["PB_ratio"] < 3:
        score += (3 - stock["PB_ratio"])

    # Higher dividend yield is better
    if stock["dividend_yield"]:
        score += stock["dividend_yield"] * 100

    # Higher ROE is better
    if stock["ROE"]:
        score += stock["ROE"] * 100

    # Lower debt to equity is better
    if stock["debt_to_equity"] and stock["debt_to_equity"] < 2:
        score += (2 - stock["debt_to_equity"])

    return round(score, 2)

@app.route('/api/stocks')
def get_ranked_stocks():
    results = []
    for symbol in STOCKS:
        stock = get_stock_data(symbol)
        stock["score"] = score_stock(stock)
        results.append(stock)

    # Sort by score descending
    ranked = sorted(results, key=lambda x: x["score"], reverse=True)
    return jsonify(ranked)

if __name__ == '__main__':
    app.run(debug=True)