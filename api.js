// ==============================
// Binance Futures API
// ==============================

const API = "https://fapi.binance.com";

let currentSymbol = "BTCUSDT";

// ------------------------------
// Get Current Price
// ------------------------------
async function getPrice(symbol){

    const res = await fetch(
        `${API}/fapi/v1/ticker/price?symbol=${symbol}`
    );

    const data = await res.json();

    return parseFloat(data.price);

}

// ------------------------------
// Get 15m Candles
// ------------------------------
async function getCandles(symbol, limit = 300){

    const res = await fetch(

        `${API}/fapi/v1/klines?symbol=${symbol}&interval=15m&limit=${limit}`

    );

    const data = await res.json();

    return data.map(c => ({

        time: c[0],

        open: parseFloat(c[1]),

        high: parseFloat(c[2]),

        low: parseFloat(c[3]),

        close: parseFloat(c[4]),

        volume: parseFloat(c[5])

    }));

}

// ------------------------------
// Get Latest Candle
// ------------------------------
async function getLastCandle(symbol){

    const candles = await getCandles(symbol,2);

    return candles[candles.length-1];

}

// ------------------------------
// Get Previous Candle
// ------------------------------
async function getPreviousCandle(symbol){

    const candles = await getCandles(symbol,2);

    return candles[candles.length-2];

}

// ------------------------------
// Get 1m Candles
// ------------------------------
async function get1mCandles(symbol, limit = 300){

    const res = await fetch(

        `${API}/fapi/v1/klines?symbol=${symbol}&interval=1m&limit=${limit}`

    );

    const data = await res.json();

    return data.map(c => ({

        time: c[0],

        open: parseFloat(c[1]),

        high: parseFloat(c[2]),

        low: parseFloat(c[3]),

        close: parseFloat(c[4]),

        volume: parseFloat(c[5])

    }));

}
