import {gql} from "@apollo/client";

export const LOGIN_USER = gql`
    mutation Login($token: String!) {
        login(token: $token) {
            id
            email
            firstName
            lastName
            phoneNumber
            createdAt
            updatedAt
            coins {
                id
                quantity
                totalPrice
                userId
                coinId
            }
        }
    }


`

export const GET_COIN = gql`
    query Coin($coinId: String!) {
        coin(id: $coinId) {
            id
            name
            symbol
            image
            coins_market_data {
                id
                currentPrice
                priceChange24h
                priceChangePercentage24h
                priceChangePercentage1h
                priceChangePercentage7d
                priceChangePercentage30d
                priceChangePercentage1y
                high24
                low24
                marketCap
                rank
                totalActiveCoins
                totalCoins
                totalVolume
                sparkline
            }
        }
    }
`

export const GET_CHART = gql`
    query CoinChart($coinChartId: String!, $days: String!, $interval: String!) {
        coinChart(id: $coinChartId, days: $days, interval: $interval) {
            date
            price
            marketCap
            volume
            open
            high
            low
            close
        }
    }
`