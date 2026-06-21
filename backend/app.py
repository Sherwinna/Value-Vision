import yfinance as yf
import sqlite3
import json
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import Flask, jsonify, request
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import jwt
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config["SECRET_KEY"] = "value-vision-secret-key-change-in-production"
app.config["JWT_EXPIRATION_HOURS"] = 72
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
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    conn.commit()
    conn.close()

def hash_password(password):
    return generate_password_hash(password)

def check_password(password, hash):
    return check_password_hash(hash, password)

def create_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=app.config["JWT_EXPIRATION_HOURS"]),
    }
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")

def verify_token(token):
    try:
        payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return payload["user_id"]
    except:
        return None

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401
        user_id = verify_token(auth.split(" ", 1)[1])
        if user_id is None:
            return jsonify({"error": "Invalid or expired token"}), 401
        return f(user_id=user_id, *args, **kwargs)
    return decorated

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

    # P/E ratio — lower is better, max 20 points
    if stock["PE_ratio"] and 0 < stock["PE_ratio"] < 20:
        score += (20 - stock["PE_ratio"])

    # P/B ratio — lower is better, max 3 points
    if stock["PB_ratio"] and 0 < stock["PB_ratio"] < 3:
        score += (3 - stock["PB_ratio"])

    # Dividend yield — yfinance returns as decimal, cap at 10% to avoid outliers
    if stock["dividend_yield"] and 0 < stock["dividend_yield"] < 0.10:
        score += stock["dividend_yield"] * 100

    # ROE — yfinance returns as decimal, cap at 50% to avoid outliers
    if stock["ROE"] and 0 < stock["ROE"] < 0.50:
        score += stock["ROE"] * 100

    # Debt to equity — lower is better, max 2 points
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

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body required"}), 400
    username = data.get("username", "").strip()
    password = data.get("password", "")
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    conn = sqlite3.connect("stocks.db")
    c = conn.cursor()
    try:
        pw_hash = hash_password(password)
        c.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)",
                  (username, pw_hash))
        conn.commit()
        user_id = c.lastrowid
        token = create_token(user_id)
        return jsonify({"token": token, "user": {"id": user_id, "username": username}}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already taken"}), 409
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body required"}), 400
    username = data.get("username", "").strip()
    password = data.get("password", "")
    conn = sqlite3.connect("stocks.db")
    c = conn.cursor()
    c.execute("SELECT id, username, password_hash FROM users WHERE username = ?",
              (username,))
    row = c.fetchone()
    conn.close()
    if not row or not check_password(password, row[2]):
        return jsonify({"error": "Invalid username or password"}), 401
    token = create_token(row[0])
    return jsonify({"token": token, "user": {"id": row[0], "username": row[1]}})

@app.route('/api/me')
@require_auth
def get_current_user(user_id):
    conn = sqlite3.connect("stocks.db")
    c = conn.cursor()
    c.execute("SELECT id, username, created_at FROM users WHERE id = ?", (user_id,))
    row = c.fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": {"id": row[0], "username": row[1], "created_at": row[2]}})

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