export default function LearnPage() {
  return (
    <div className="learn-page">
      <section className="learn-section">
        <h1>What is Value Investing?</h1>
        <p>
          Value investing is a strategy pioneered by Benjamin Graham in the 1930s and
          later popularized by his student Warren Buffett. The core idea is simple:
          buy stocks for less than they are worth. Instead of chasing hot growth stocks
          or trying to time the market, value investors look for companies whose share
          price does not fully reflect their underlying fundamentals.
        </p>
        <p>
          The key principle is <strong>margin of safety</strong> — buying at a price
          significantly below your estimate of intrinsic value. This cushion protects
          you from being wrong about your analysis or from unexpected downturns. Value
          investors also take a long-term view, ignoring short-term market noise and
          focusing on the actual health and earnings power of the business.
        </p>
        <p>
          This app ranks stocks from the S&P 500 using a quantitative scoring system
          based on five fundamental metrics. Each metric tells you something about a
          company's financial health, valuation, or profitability. The goal is to
          surface undervalued stocks worth researching further — not to give buy/sell
          advice. Always do your own research before investing.
        </p>
      </section>

      <section className="learn-section">
        <h2 className="learn-section-title">The Five Metrics</h2>

        <div className="metric-card">
          <div className="metric-header">
            <h3>1. Price-to-Earnings (P/E)</h3>
            <span className="metric-tag metric-tag-valuation">Valuation</span>
          </div>
          <p>
            The P/E ratio compares a company's stock price to its earnings per share.
            It tells you how much you are paying for each dollar of profit the company
            generates.
          </p>
          <div className="formula">P/E = Stock Price &divide; Earnings Per Share (EPS)</div>
          <div className="example">
            <strong>Example:</strong> A stock trades at $50 and earned $5 per share over
            the past year &rarr; P/E = 10. You pay $10 for every $1 of earnings.
          </div>
          <div className="metric-ranges">
            <div className="range-good">
              <span className="badge badge-good">Good</span>
              0 &ndash; 20 &mdash; The stock is reasonably priced or undervalued
              relative to its earnings. Lower is better.
            </div>
            <div className="range-bad">
              <span className="badge badge-bad">Bad</span>
              Above 20 or negative &mdash; A high P/E may signal a stock is overvalued.
              A negative P/E means the company is losing money.
            </div>
          </div>
          <p className="metric-why">
            <strong>Why it matters:</strong> A low P/E can indicate a bargain — the
            market is undervaluing the company's earnings power. Graham famously sought
            stocks with P/E below 15.
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>2. Price-to-Book (P/B)</h3>
            <span className="metric-tag metric-tag-valuation">Valuation</span>
          </div>
          <p>
            The P/B ratio compares a company's market value to its book value (assets
            minus liabilities). Book value represents what shareholders would own if the
            company were liquidated.
          </p>
          <div className="formula">P/B = Stock Price &divide; Book Value Per Share</div>
          <div className="example">
            <strong>Example:</strong> A stock trades at $50 per share and has a book
            value of $100 per share &rarr; P/B = 0.5. You are buying $1 of assets for
            $0.50.
          </div>
          <div className="metric-ranges">
            <div className="range-good">
              <span className="badge badge-good">Good</span>
              0 &ndash; 3 &mdash; A low P/B suggests the stock is priced below or
              close to the value of its tangible assets. Below 1 is especially
              compelling.
            </div>
            <div className="range-bad">
              <span className="badge badge-bad">Bad</span>
              Above 3 &mdash; A high P/B means you are paying a large premium over
              the company's asset value. Negative book value is a red flag.
            </div>
          </div>
          <p className="metric-why">
            <strong>Why it matters:</strong> P/B is especially useful for valuing
            financial, insurance, and asset-heavy companies. Graham often required
            P/B below 1.5 as part of his criteria.
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>3. Return on Equity (ROE)</h3>
            <span className="metric-tag metric-tag-profitability">Profitability</span>
          </div>
          <p>
            ROE measures how effectively a company generates profit from the money
            shareholders have invested. It is one of the best indicators of management
            quality and competitive advantage.
          </p>
          <div className="formula">ROE = Net Income &divide; Shareholders' Equity</div>
          <div className="example">
            <strong>Example:</strong> A company earns $10 million in net income and
            shareholders have invested $50 million &rarr; ROE = 20%. Every dollar of
            equity generates $0.20 in profit.
          </div>
          <div className="metric-ranges">
            <div className="range-good">
              <span className="badge badge-good">Good</span>
              Above 0% (positive) &mdash; Higher ROE means the company efficiently
              uses its capital. Consistent ROE above 15&ndash;20% suggests a durable
              competitive advantage.
            </div>
            <div className="range-bad">
              <span className="badge badge-bad">Bad</span>
              Negative or unsustainably high &mdash; Negative ROE means the company is
              destroying shareholder value. Extremely high ROE can sometimes be
              inflated by excessive debt.
            </div>
          </div>
          <p className="metric-why">
            <strong>Why it matters:</strong> Value investors look for companies that
            earn a high return on the capital they already have — it signals a
            well-run business that can grow without needing constant new investment.
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>4. Dividend Yield</h3>
            <span className="metric-tag metric-tag-income">Income</span>
          </div>
          <p>
            Dividend yield tells you how much cash a company returns to shareholders
            each year relative to its stock price. It is a key source of total return
            for value investors.
          </p>
          <div className="formula">Dividend Yield = Annual Dividends Per Share &divide; Stock Price</div>
          <div className="example">
            <strong>Example:</strong> A company pays $2 per share in annual dividends
            and the stock trades at $50 &rarr; Dividend Yield = 4%. You earn $4 every
            year for each $100 invested.
          </div>
          <div className="metric-ranges">
            <div className="range-good">
              <span className="badge badge-good">Good</span>
              Positive and sustainable &mdash; A moderate yield (1&ndash;5%) backed by
              strong earnings and a history of consistent or growing payouts.
            </div>
            <div className="range-bad">
              <span className="badge badge-bad">Bad</span>
              Extremely high yields (above 8&ndash;10%) or zero &mdash; Very high
              yields can signal a falling stock price or a dividend that may be cut.
              Zero yield means no income return.
            </div>
          </div>
          <p className="metric-why">
            <strong>Why it matters:</strong> Dividends provide income and reduce the
            risk of selling shares at the wrong time. Companies that pay and grow
            dividends tend to be financially disciplined and shareholder-friendly.
            Reinvesting dividends is a powerful compounding tool.
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>5. Debt-to-Equity (D/E)</h3>
            <span className="metric-tag metric-tag-risk">Risk</span>
          </div>
          <p>
            The D/E ratio measures how much a company is financing its operations
            through debt versus shareholder equity. It is a key indicator of financial
            risk and leverage.
          </p>
          <div className="formula">D/E = Total Liabilities &divide; Shareholders' Equity</div>
          <div className="example">
            <strong>Example:</strong> A company has $80 million in total liabilities
            and $100 million in shareholder equity &rarr; D/E = 0.8. The company has
            $0.80 of debt for every $1 of equity.
          </div>
          <div className="metric-ranges">
            <div className="range-good">
              <span className="badge badge-good">Good</span>
              0 &ndash; 2 &mdash; Low to moderate debt. The company can comfortably
              service its obligations. Lower is safer.
            </div>
            <div className="range-bad">
              <span className="badge badge-bad">Bad</span>
              Above 2 or negative &mdash; High leverage means more financial risk,
              especially during economic downturns. Negative equity is a serious
              warning sign.
            </div>
          </div>
          <p className="metric-why">
            <strong>Why it matters:</strong> Value investors prefer companies with
            manageable debt. High debt can turn a good business into a distressed one
            during tough times — it erodes the margin of safety.
          </p>
        </div>
      </section>

      <section className="learn-section">
        <h2 className="learn-section-title">How our Value Vision Score Works</h2>
        <p>
          The scoring algorithm on the home page combines all five metrics into a
          single rank. Each metric contributes points when it falls in the "good" range:
        </p>
        <ul className="score-list">
          <li><strong>P/E:</strong> If between 0 and 20, points are added &mdash; lower is better (max contribution when P/E is near zero).</li>
          <li><strong>P/B:</strong> If between 0 and 3, points are added &mdash; lower is better.</li>
          <li><strong>Dividend Yield:</strong> If positive, the yield percentage is added directly &mdash; higher is better.</li>
          <li><strong>ROE:</strong> If positive, the ROE percentage is added directly &mdash; higher is better.</li>
          <li><strong>Debt/Equity:</strong> If between 0 and 2, points are added &mdash; lower is better.</li>
        </ul>
        <p>
          The total score is the sum of all five contributions. Stocks are then ranked
          from highest to lowest score. Use the score as a starting point for your own
          research — no single number tells the whole story.
        </p>
      </section>
    </div>
  )
}
