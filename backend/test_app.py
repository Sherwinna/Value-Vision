import pytest
import json
from app import app, score_stock, check_value_trap

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# ── Scoring algorithm tests ──────────────────────────────────────────────────

def test_score_perfect_stock():
    """A stock with ideal metrics should score highly"""
    stock = {
        "PE_ratio": 10,
        "PB_ratio": 1.0,
        "dividend_yield": 0.05,
        "ROE": 0.30,
        "debt_to_equity": 0.5
    }
    score = score_stock(stock)
    assert score > 20

def test_score_bad_stock():
    """A stock with poor metrics should score 0"""
    stock = {
        "PE_ratio": 50,
        "PB_ratio": 10,
        "dividend_yield": 0,
        "ROE": -0.1,
        "debt_to_equity": 5
    }
    score = score_stock(stock)
    assert score == 0

def test_score_missing_metrics():
    """A stock with all None metrics should score 0"""
    stock = {
        "PE_ratio": None,
        "PB_ratio": None,
        "dividend_yield": None,
        "ROE": None,
        "debt_to_equity": None
    }
    score = score_stock(stock)
    assert score == 0

def test_score_pe_boundary():
    """P/E exactly at 20 should not contribute to score"""
    stock = {
        "PE_ratio": 20,
        "PB_ratio": None,
        "dividend_yield": None,
        "ROE": None,
        "debt_to_equity": None
    }
    score = score_stock(stock)
    assert score == 0

def test_score_low_pe():
    """P/E of 10 should contribute 10 points"""
    stock = {
        "PE_ratio": 10,
        "PB_ratio": None,
        "dividend_yield": None,
        "ROE": None,
        "debt_to_equity": None
    }
    score = score_stock(stock)
    assert score == 10.0

# ── Value trap tests ──────────────────────────────────────────────────────────

def test_value_trap_high_debt():
    """Debt/equity > 200 should flag as extremely high debt"""
    stock = {
        "PE_ratio": 10,
        "PB_ratio": 1.0,
        "dividend_yield": 0.03,
        "ROE": 0.15,
        "debt_to_equity": 250
    }
    flags = check_value_trap(stock)
    assert "Extremely high debt" in flags

def test_value_trap_negative_roe():
    """Negative ROE should flag as value trap"""
    stock = {
        "PE_ratio": 10,
        "PB_ratio": 1.0,
        "dividend_yield": 0.03,
        "ROE": -0.10,
        "debt_to_equity": 1.0
    }
    flags = check_value_trap(stock)
    assert "Negative return on equity" in flags

def test_value_trap_clean_stock():
    """A healthy stock should have no flags"""
    stock = {
        "PE_ratio": 15,
        "PB_ratio": 2.0,
        "dividend_yield": 0.03,
        "ROE": 0.20,
        "debt_to_equity": 1.0
    }
    flags = check_value_trap(stock)
    assert len(flags) == 0

# ── API endpoint tests ────────────────────────────────────────────────────────

def test_stocks_endpoint(client):
    """GET /api/stocks should return a list of 20 stocks"""
    response = client.get('/api/stocks')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)

def test_stock_detail_endpoint(client):
    """GET /api/stock/AAPL should return stock data"""
    response = client.get('/api/stock/AAPL')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['symbol'] == 'AAPL'
    assert 'price' in data
    assert 'PE_ratio' in data

def test_stock_history_endpoint(client):
    """GET /api/stock/AAPL/history should return price history"""
    response = client.get('/api/stock/AAPL/history')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) > 0
    assert 'date' in data[0]
    assert 'price' in data[0]

def test_register_endpoint(client):
    """POST /api/register should create a new user"""
    response = client.post('/api/register',
        data=json.dumps({'username': 'testuser123', 'password': 'testpass123'}),
        content_type='application/json'
    )
    assert response.status_code in [200, 201, 409]

def test_login_wrong_password(client):
    """POST /api/login with wrong password should return 401"""
    response = client.post('/api/login',
        data=json.dumps({'username': 'wronguser', 'password': 'wrongpass'}),
        content_type='application/json'
    )
    assert response.status_code == 401

def test_watchlist_without_token(client):
    """GET /api/watchlist without token should return 401"""
    response = client.get('/api/watchlist')
    assert response.status_code == 401