# TRADE OS — Futures Intelligence Terminal

Institutional-style, responsive front-end design prototype for a futures market analysis workspace.

## Current scope

- Futures watchlist: MNQ, NQ, MES, ES, MYM, M2K, MGC and MCL
- Institutional three-column workspace
- Price-structure chart preview and timeframe controls
- Reference levels and session context
- Liquidity concentration visual and DOM ladder mockup
- Footprint, CVD, Time & Sales and order-flow panels
- Rule-based bullish / bearish / neutral bias presentation
- Macro intelligence placeholder for a future FRED integration
- Responsive desktop and mobile layout

## Important data notice

**All market values, order-book quantities, footprint rows, tape prints, and bias outputs are illustrative demo data.** This repository does not currently connect to CME or any other exchange, does not provide live liquidity data, and does not place orders.

## Run locally

Open `index.html` in a browser. No build step or API key is required for this design prototype.

## Next step

Review and approve the visual design before connecting market-data providers or adding backend services.


## FRED macro data integration

The macro panel now requests observations from the server-side `/api/fred` function. The FRED API key is read only from the server environment variable `FRED_API_KEY`; it is never embedded in browser JavaScript.

### Deployment requirement

GitHub Pages is static hosting and cannot run the `api/fred.js` serverless function. Deploy this repository to Vercel, then add `FRED_API_KEY` under **Project → Settings → Environment Variables** (Production and Preview as needed), and redeploy. Use a newly rotated FRED key; do not reuse a key that has been exposed in chat or committed to a public repository.

The endpoint returns latest observations for DGS10, DGS2, FEDFUNDS, CPIAUCSL (year-over-year percent change), UNRATE, and PCEPI (year-over-year percent change). FRED observations are macroeconomic data and are not real-time futures quotes, economic-calendar forecasts, DOM, or order-book liquidity.
