import { Article } from '../types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'trading-for-beginners',
    title: 'Trading for Beginners: Fundamental Principles & Mechanics',
    category: 'Beginner',
    readTime: '6 min read',
    publishedAt: '2025-01-10',
    author: 'Nexora Market Research Team',
    summary: 'A structured foundational guide to understanding how global financial markets work, currency pairs, bids, asks, and order execution.',
    content: `Financial trading is the process of speculating on the future price movements of assets including foreign currencies, precious metals, stock indices, energy commodities, and cryptocurrencies.

### 1. Understanding Currency Pairs and Quotations
In the forex market, currencies are quoted in pairs, such as EUR/USD. The first currency (EUR) is the base currency, and the second (USD) is the quote currency. If EUR/USD is quoted at 1.0850, it means 1 Euro is equivalent to 1.0850 US Dollars.

- **Bid Price:** The price at which you can sell to the market.
- **Ask Price:** The price at which you can buy from the market.
- **Spread:** The difference between the Bid and Ask prices, representing the fundamental transaction cost.

### 2. Going Long vs Going Short
Unlike traditional equity investing where you only profit when assets appreciate, modern CFD contracts allow market participants to capitalize on both rising and falling markets:
- **Going Long (Buy):** Opening a position expecting the market price to climb higher.
- **Going Short (Sell):** Opening a position expecting the market price to drop lower.

### 3. Lot Sizing and Contract Volume
Trading volume is measured in standardized lots:
- **Standard Lot (1.00):** Represents 100,000 units of the base currency.
- **Mini Lot (0.10):** Represents 10,000 units of the base currency.
- **Micro Lot (0.01):** Represents 1,000 units of the base currency.

*Demo Notice: All market practices should be tested on demo accounts before considering live market conditions.*`,
    tags: ['Forex', 'Beginner', 'Market Basics', 'Terminology'],
  },
  {
    id: 'art-2',
    slug: 'technical-analysis',
    title: 'Technical Analysis Mastery: Support, Resistance & Trend Confirmation',
    category: 'Analysis',
    readTime: '8 min read',
    publishedAt: '2025-01-18',
    author: 'David Bradley, Senior Strategist',
    summary: 'Explore price action setups, horizontal support/resistance zones, moving averages, and momentum oscillators for disciplined market entry.',
    content: `Technical analysis focuses on interpreting historical price action and trading volume to forecast probabilistic future directional bias.

### 1. Market Structure & Trend Identification
Every market oscillates through three structural phases:
1. **Uptrend:** Characterized by a sequence of Higher Highs (HH) and Higher Lows (HL).
2. **Downtrend:** Characterized by a sequence of Lower Highs (LH) and Lower Lows (LL).
3. **Consolidation / Range:** Price bouncing between horizontal boundary boundaries.

### 2. Support and Resistance Dynamics
Support represents a price floor where buying pressure historically overcomes selling pressure. Resistance acts as a ceiling where selling volume halts advances.
- **Role Reversal:** When a strong resistance level is broken decisively with high volume, it frequently transitions into support upon a retest.

### 3. Core Indicators for Confluence
- **Moving Averages (EMA 20 & EMA 50):** Track dynamic trend trajectory.
- **Relative Strength Index (RSI):** Evaluates whether an asset has reached overbought (>70) or oversold (<30) territory.
- **MACD:** Identifies shifts in trend momentum through signal line crossovers.

*Always look for confluence: combine candlestick triggers with key structural support/resistance zones.*`,
    tags: ['Technical Analysis', 'Chart Patterns', 'Support & Resistance', 'Indicators'],
  },
  {
    id: 'art-3',
    slug: 'risk-management',
    title: 'Risk Management: Capital Preservation & Position Sizing Frameworks',
    category: 'Risk',
    readTime: '7 min read',
    publishedAt: '2025-01-25',
    author: 'Elena Moreau, Risk Officer',
    summary: 'The single most decisive factor in long-term trading longevity is strict risk management. Learn how to calculate position size and protect equity.',
    content: `Professional traders distinguish themselves not through guaranteed winning trades, but through disciplined asymmetric risk management.

### 1. The Golden 1% Rule
Never risk more than 1% to 2% of your total account equity on any single trading position. If your trading account holds $10,000, your maximum dollar loss on a trade should not exceed $100 to $200.

### 2. Calculating Required Lot Size
Use the standard position sizing formula:
\`\`\`
Lot Size = Risk Capital ($) / (Stop Loss in Pips * Pip Value)
\`\`\`
Example:
- Account Equity: $10,000 (1% Risk = $100)
- Stop Loss: 20 Pips on EUR/USD (where 1 pip in 1.0 lot = $10)
- Calculation: $100 / (20 * $10) = 0.50 Lots.

### 3. Risk-to-Reward Ratio (RRR)
Aim for a minimum Risk-to-Reward ratio of 1:2. This means for every $100 you risk, your planned take-profit target aims for at least $200. With a 1:2 RRR, you can remain profitable even with a 40% win rate.

*Discipline is the foundation of capital preservation.*`,
    tags: ['Risk Management', 'Capital Preservation', 'Position Sizing', 'Stop Loss'],
  },
  {
    id: 'art-4',
    slug: 'trading-psychology',
    title: 'Trading Psychology: Conquering Fear, Greed & Revenge Trading',
    category: 'Psychology',
    readTime: '5 min read',
    publishedAt: '2025-02-02',
    author: 'Nexora Market Research Team',
    summary: 'Understand the neurological biases, FOMO, and emotional pitfalls that sabotage trading consistency, and how to build a disciplined execution routine.',
    content: `Trading is 20% technical strategy and 80% emotional execution. Without psychological resilience, even the best trading strategy will fail.

### 1. The Fear of Missing Out (FOMO)
FOMO occurs when traders chase rapid market moves after candles have already expanded. Chasing almost always results in entering at the top or bottom of a cycle right before a mean reversion.
- **Rule:** If you miss an entry at your defined setup zone, wait patiently for the next retest or setup. The market is always open tomorrow.

### 2. Revenge Trading
After taking an unexpected loss, the brain experiences frustration and a primal impulse to "win back" lost capital immediately. This leads to increasing lot sizes and violating risk parameters.
- **Protocol:** Implement a hard daily loss limit (e.g. 3% max loss per day). Once hit, close the charts and step away for the remainder of the session.

### 3. Process Over Outcome
Grade your performance based on whether you followed your trading plan with flawless execution, rather than solely on the monetary outcome of a single trade.`,
    tags: ['Psychology', 'Mindset', 'Discipline', 'FOMO'],
  },
  {
    id: 'art-5',
    slug: 'candlestick-patterns',
    title: 'Japanese Candlesticks: Reading High-Probability Price Action Triggers',
    category: 'Analysis',
    readTime: '6 min read',
    publishedAt: '2025-02-08',
    author: 'David Bradley, Senior Strategist',
    summary: 'Deconstruct hammers, engulfing candles, morning stars, pin bars, and dojis to time high-probability trading entries with precision.',
    content: `Japanese candlestick charts provide an intuitive visual representation of the continuous tug-of-war between buyers (bulls) and sellers (bears).

### 1. Anatomy of a Candlestick
- **Real Body:** The distance between the Open and Close prices.
- **Upper Shadow (Wick):** Highest price reached during the period.
- **Lower Shadow (Tail):** Lowest price reached during the period.

### 2. Essential Bullish Candlestick Signals
- **Bullish Engulfing:** A large green candle whose body completely covers the previous red candle at structural support.
- **Hammer / Pin Bar:** A small body near the high with a long lower wick at least twice the length of the body, indicating strong buyer rejection of lower prices.
- **Morning Star:** A three-candle reversal pattern consisting of a bearish candle, a small indecision doji, and a strong bullish confirmation candle.

### 3. Essential Bearish Candlestick Signals
- **Bearish Engulfing:** A strong red candle engulfing previous bullish gains at key resistance.
- **Shooting Star:** A long upper wick showing seller rejection of higher prices.`,
    tags: ['Candlesticks', 'Price Action', 'Reversals', 'Patterns'],
  },
  {
    id: 'art-6',
    slug: 'understanding-leverage',
    title: 'Understanding Leverage and Margin in CFD & Forex Trading',
    category: 'Beginner',
    readTime: '5 min read',
    publishedAt: '2025-02-14',
    author: 'Elena Moreau, Risk Officer',
    summary: 'Demystify financial leverage, free margin, margin calls, and stop-out levels to navigate leveraged derivative instruments safely.',
    content: `Leverage allows traders to control larger market positions with a relatively smaller amount of initial capital, known as margin.

### 1. How Leverage Works
If you use 1:100 leverage, for every $1 you allocate as margin, you can control $100 worth of market contract value.
- To open a standard 1.00 lot ($100,000) position on EUR/USD with 1:100 leverage, you require $1,000 in required margin.
- With 1:500 leverage, the required margin drops to $200.

### 2. The Double-Edged Nature of Leverage
While higher leverage increases purchasing power and potential returns on small accounts, it exponentially magnifies downside exposure if risk is unmanaged.
- A 1% market move against an over-leveraged account can trigger a margin call or account liquidation.

### 3. Margin Metrics Explained
- **Balance:** Realized cash in the account.
- **Equity:** Balance + Floating Profit/Loss of open positions.
- **Used Margin:** Capital locked to maintain active trades.
- **Free Margin:** Equity minus Used Margin available to open new orders.
- **Margin Level (%):** (Equity / Used Margin) * 100%.

*Always maintain comfortable margin level buffers above 200%.*`,
    tags: ['Leverage', 'Margin', 'CFDs', 'Education'],
  },
];
