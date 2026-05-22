import yfinance as yf
import sqlite3
import json
from flask import Flask, jsonify
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app)

# Full S&P 500 list
STOCKS = [
    "AAPL","MSFT","JNJ","KO","PG","JPM","WMT","XOM","CVX","PFE",
    "MRK","ABT","TMO","UNH","HD","LOW","CAT","DE","MMM","IBM",
    "INTC","CSCO","VZ","T","MO","PM","CL","GIS","K","HRL",
    "AMGN","GILD","BMY","LLY","ABBV","MDT","SYK","BDX","ZBH","EW",
    "NEE","DUK","SO","AEP","EXC","SRE","PPL","FE","ES","ETR",
    "BAC","WFC","GS","MS","C","USB","TFC","PNC","COF","AXP",
    "AMT","PLD","CCI","EQIX","PSA","SPG","O","DLR","AVB","EQR",
    "MCD","SBUX","YUM","DRI","CMG","QSR","DPZ","DENN","JACK","WEN",
    "F","GM","TM","HMC","NSANY","RACE","FCAU","VWAGY","BWA","LEA",
    "NFLX","DIS","CMCSA","CHTR","PARA","WBD","FOX","NYT","IPG","OMC"
]

def init_db():
    conn = sqlite3.connect("stocks.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS stocks
                 (symbol TEXT PRIMARY KEY, data TEXT)''')
    conn.commit()
    conn.close()

def get_stock_data(symbol):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info

        def safe_float(val):
            try:
                return round(float(val), 2)
            except:
                return None

        return {
            "symbol": symbol,
            "name": info.get("longName"),
            "price": safe_float(info.get("currentPrice")),
            "PE_ratio": safe_float(info.get("trailingPE")),
            "PB_ratio": safe_float(info.get("priceToBook")),
            "dividend_yield": safe_float(info.get("dividendYield")),
            "ROE": safe_float(info.get("returnOnEquity")),
            "debt_to_equity": safe_float(info.get("debtToEquity")),
        }
    except:
        return None

def score_stock(stock):
    score = 0
    if stock["PE_ratio"] and 0 < stock["PE_ratio"] < 20:
        score += (20 - stock["PE_ratio"])
    if stock["PB_ratio"] and 0 < stock["PB_ratio"] < 3:
        score += (3 - stock["PB_ratio"])
    if stock["dividend_yield"] and stock["dividend_yield"] > 0:
        score += stock["dividend_yield"] * 100
    if stock["ROE"] and stock["ROE"] > 0:
        score += stock["ROE"] * 100
    if stock["debt_to_equity"] and 0 < stock["debt_to_equity"] < 2:
        score += (2 - stock["debt_to_equity"])
    return round(score, 2)

def fetch_and_cache_all():
    print("Fetching stock data in background...")
    conn = sqlite3.connect("stocks.db")
    c = conn.cursor()
    for symbol in STOCKS:
        stock = get_stock_data(symbol)
        if stock and stock["name"]:
            stock["score"] = score_stock(stock)
            c.execute("INSERT OR REPLACE INTO stocks VALUES (?, ?)",
                      (symbol, json.dumps(stock)))
            conn.commit()
            print(f"Cached {symbol}")
    conn.close()
    print("Done fetching all stocks!")

@app.route('/api/stocks')
def get_ranked_stocks():
    conn = sqlite3.connect("stocks.db")
    c = conn.cursor()
    c.execute("SELECT data FROM stocks")
    rows = c.fetchall()
    conn.close()

    if not rows:
        return jsonify({"message": "Data is still loading, check back in a few minutes"}), 202

    results = [json.loads(row[0]) for row in rows]
    ranked = sorted(results, key=lambda x: x["score"], reverse=True)
    return jsonify(ranked[:20])

init_db()
scheduler = BackgroundScheduler()
scheduler.add_job(fetch_and_cache_all, 'interval', hours=24)
scheduler.start()

# Fetch immediately on startup
import threading
threading.Thread(target=fetch_and_cache_all).start()

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)