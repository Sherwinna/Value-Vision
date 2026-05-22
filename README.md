# Value Vision

A web application that helps beginner investors identify potentially undervalued stocks using value investing metrics.

## Team
- Sherwin Chang
- Shen Yuncong

## Proposed Level of Achievement
Apollo 11

## Features
- Stock ranking system based on composite value score
- Stock information viewer with key financial metrics
- Personal stock watchlist
- 90-day stock price charts

## Tech Stack
- **Backend:** Python, Flask
- **Frontend:** React, Tailwind CSS, Chart.js
- **Database:** SQLite
- **Data source:** yfinance (Yahoo Finance)
- **Deployment:** Vercel (frontend), Render (backend)

## Setup Instructions

### Backend
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `pip install flask flask-cors yfinance apscheduler`
3. Run the server: `python app.py`

### Frontend
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Open `http://localhost:5173` in your browser

## How it works
Value Vision fetches stock data from Yahoo Finance and scores each stock based on five value investing metrics — P/E ratio, P/B ratio, return on equity, dividend yield, and debt-to-equity ratio. Stocks are ranked by their composite score and the top 20 are displayed.