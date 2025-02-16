# CoinMarketCap vs CoinGecko API Comparison

## Service Overview

| Feature                  | CoinMarketCap (CMC)                             | CoinGecko (CG)                                 |
| ------------------------ | ----------------------------------------------- | ---------------------------------------------- |
| API Availability         | 11 data endpoints in free plan                  | 30 market data endpoints available             |
| Token Data Access        | 10,000+ tokens supported                        | 10,000+ tokens supported                       |
| Monthly API Credits      | 10,000 API credits per month                    | 10,000 API credits per month                   |
| Rate Limit               | 30 requests per minute                          | 30 requests per minute                         |
| Data Freshness           | Updated every 1 minute                          | Data freshness from 60 seconds                 |
| Historical Data Access   | Daily, hourly, and 5-minute data (up to 1 year) | Daily, hourly, and 5-minute data (up to 1 day) |
| Exchange Historical Data | Supported (up to 1 year)                        | Supported (specifics unclear)                  |
| Currency Conversions     | Limited to 1 conversion per call                | Multiple currencies supported                  |
| Support                  | Basic email support                             | Attribution required for Demo tier             |
| Usage License            | Personal use                                    | Attribution required                           |

## Data Structure Comparison

| Data Point              | CoinMarketCap Path                        | CoinGecko Path                                            | Notes                                                   |
| ----------------------- | ----------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| Name                    | `data.name`                               | `name`                                                    | Both provide direct access                              |
| Symbol                  | `data.symbol`                             | `symbol`                                                  | Both provide direct access                              |
| Price USD               | `data.quote.USD.price`                    | `market_data.current_price.usd`                           | CoinGecko provides prices in multiple currencies        |
| Market Cap              | `data.quote.USD.market_cap`               | `market_data.market_cap.usd`                              | Similar structure                                       |
| Volume 24h              | `data.quote.USD.volume_24h`               | `market_data.total_volume.usd`                            | Similar data                                            |
| 1h Change %             | `data.quote.USD.percent_change_1h`        | `market_data.price_change_percentage_1h_in_currency.usd`  | Similar format                                          |
| 24h Change %            | `data.quote.USD.percent_change_24h`       | `market_data.price_change_percentage_24h_in_currency.usd` | Similar format                                          |
| 7d Change %             | `data.quote.USD.percent_change_7d`        | `market_data.price_change_percentage_7d_in_currency.usd`  | Similar format                                          |
| 30d Change %            | `data.quote.USD.percent_change_30d`       | `market_data.price_change_percentage_30d_in_currency.usd` | Similar format                                          |
| Circulating Supply      | `data.circulating_supply`                 | `market_data.circulating_supply`                          | Direct access in both                                   |
| Max Supply              | `data.max_supply`                         | `market_data.max_supply`                                  | Direct access in both                                   |
| Platform/Contract       | `data.platform`                           | `platforms.solana`                                        | CoinGecko provides platform-specific contract addresses |
| Social Data             | Not present in sample                     | `community_data`                                          | CoinGecko provides additional social metrics            |
| Developer Data          | Not present in sample                     | `developer_data`                                          | CoinGecko provides developer activity metrics           |
| Market Rank             | `data.cmc_rank`                           | `market_cap_rank`                                         | Similar concept                                         |
| Fully Diluted Valuation | `data.quote.USD.fully_diluted_market_cap` | `market_data.fully_diluted_valuation.usd`                 | Similar concept                                         |
| Logo/Image              | Not present in sample                     | `image.large/small/thumb`                                 | CoinGecko provides multiple image sizes                 |
| Description             | Not present in sample                     | `description.en`                                          | CoinGecko provides multilingual descriptions            |
| 7 Days Graph            | Not present in sample                     | `market_data.sparkline_7d.price`                          | CoinGecko provides 7 days graph                         |
| Sentiment Data          | Not present in sample                     | `sentiment_votes_up_percentage`                           | CoinGecko provides sentiment data                       |

## Key Differences

1. **Data Comprehensiveness**

    - CoinGecko provides more comprehensive metadata including social stats and developer activity
    - CoinGecko includes multilingual support for descriptions and names
    - CoinGecko includes image URLs directly in the API

2. **Structure**

    - CoinMarketCap has a simpler nested structure
    - CoinGecko provides more detailed trading data through the `tickers` array
    - CoinGecko includes platform-specific contract addresses and details

3. **Additional Features in CoinGecko**

    - Multiple currency support for all price-related data
    - Detailed social media metrics
    - Developer activity tracking
    - Multiple image size options
    - Multilingual content support
    - Detailed market data per exchange (tickers)

4. **Response Format**
    - CoinMarketCap uses a numbered key structure for data (`data.1`)
    - CoinGecko uses a flatter structure with direct access to main data points

## API Endpoints

- CoinMarketCap: `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest`
- CoinGecko: `https://api.coingecko.com/api/v3/coins`

## Authentication

- CoinMarketCap requires an API key
- CoinGecko's endpoint shown is from their free tier and demo API key

## Reference Links

- [CoinGecko API Documentation](https://docs.coingecko.com/v3.0.1/reference/coins-id)
- [CoinMarketCap API Documentation](https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyPriceperformancestatsLatest)

## Conclusion

- CoinGecko provides more comprehensive data and features, but requires attribution for the demo tier
- CoinMarketCap offers a simpler API with fewer features, but is free and requires an API key
- For a basic token data API, CoinMarketCap's free plan should suffice, but consider the limitations in data comprehensiveness and features
- For more detailed and feature-rich data, CoinGecko's demo tier can be used, but be prepared to attribute usage
