// ==========================================
// 15M SCALPING SIGNAL ENGINE
// PART 4A
// ==========================================

// =============================
// EMA
// =============================
function calculateEMA(prices, period){

    const k = 2 / (period + 1);

    let ema = prices[0];

    for(let i = 1; i < prices.length; i++){

        ema = prices[i] * k + ema * (1 - k);

    }

    return ema;

}

// =============================
// SMA
// =============================
function calculateSMA(prices, period){

    const slice = prices.slice(-period);

    const sum = slice.reduce((a,b)=>a+b,0);

    return sum / period;

}

// =============================
// RSI
// =============================
function calculateRSI(prices, period = 14){

    let gains = 0;
    let losses = 0;

    for(let i = prices.length - period; i < prices.length; i++){

        const change = prices[i] - prices[i-1];

        if(change > 0){

            gains += change;

        }else{

            losses += Math.abs(change);

        }

    }

    if(losses === 0){

        return 100;

    }

    const rs = gains / losses;

    return 100 - (100 / (1 + rs));

}

// =============================
// ATR
// =============================
function calculateATR(candles, period = 14){

    let trs = [];

    for(let i = 1; i < candles.length; i++){

        const high = parseFloat(candles[i][2]);
        const low = parseFloat(candles[i][3]);
        const prevClose = parseFloat(candles[i-1][4]);

        const tr = Math.max(

            high-low,

            Math.abs(high-prevClose),

            Math.abs(low-prevClose)

        );

        trs.push(tr);

    }

    return calculateSMA(trs, period);

}

// ==========================================
// Main Function
// ==========================================
function generateSignal(candles){

    const closes = candles.map(c=>parseFloat(c[4]));

    const volumes = candles.map(c=>parseFloat(c[5]));

    const ema9 = calculateEMA(closes.slice(-40),9);

    const ema21 = calculateEMA(closes.slice(-60),21);

    const ema50 = calculateEMA(closes.slice(-100),50);

    const rsi = calculateRSI(closes);

    const atr = calculateATR(candles);

        // =============================
    // MACD
    // =============================

    const ema12 = calculateEMA(closes.slice(-60),12);

    const ema26 = calculateEMA(closes.slice(-60),26);

    const macd = ema12 - ema26;

    // =============================
    // Trend
    // =============================

    let trend = "SIDEWAYS";

    if(
        ema9 > ema21 &&
        ema21 > ema50
    ){

        trend = "BULLISH";

    }
    else if(
        ema9 < ema21 &&
        ema21 < ema50
    ){

        trend = "BEARISH";

    }

    // =============================
    // Volume
    // =============================

    const currentVolume =
        volumes[volumes.length - 1];

    const averageVolume =
        calculateSMA(volumes,20);

    const volumeRatio =
        currentVolume / averageVolume;

    // =============================
    // ADX (Temporary)
    // =============================

    // Real ADX Part 4C mein add hoga.
    // Filhal trend strength ke liye ATR use karenge.

    let adx = atr * 10;

    if(adx > 50){

        adx = 50;

    }

    // =============================
    // Latest Candle
    // =============================

    const lastClose =
        closes[closes.length-1];

    const recentHigh =
        Math.max(...closes.slice(-20));

    const recentLow =
        Math.min(...closes.slice(-20));

    const resistanceDistance =
        ((recentHigh-lastClose)/lastClose)*100;

    const supportDistance =
        ((lastClose-recentLow)/lastClose)*100;

        // =============================
    // Candlestick Pattern
    // =============================

    let bullishPattern = false;
    let bearishPattern = false;

    const prev = candles[candles.length - 2];
    const last = candles[candles.length - 1];

    const prevOpen = parseFloat(prev[1]);
    const prevClose = parseFloat(prev[4]);

    const open = parseFloat(last[1]);
    const close = parseFloat(last[4]);
    const high = parseFloat(last[2]);
    const low = parseFloat(last[3]);

    const body = Math.abs(close - open);
    const upperWick = high - Math.max(open, close);
    const lowerWick = Math.min(open, close) - low;

    // Bullish Engulfing
    if (
        prevClose < prevOpen &&
        close > open &&
        close >= prevOpen &&
        open <= prevClose
    ) {
        bullishPattern = true;
    }

    // Bearish Engulfing
    if (
        prevClose > prevOpen &&
        close < open &&
        open >= prevClose &&
        close <= prevOpen
    ) {
        bearishPattern = true;
    }

    // Hammer
    if (
        lowerWick > body * 2 &&
        upperWick < body
    ) {
        bullishPattern = true;
    }

    // Shooting Star
    if (
        upperWick > body * 2 &&
        lowerWick < body
    ) {
        bearishPattern = true;
    }

    // =============================
    // BUY CONDITIONS
    // =============================

    const buyPass =
        trend === "BULLISH" &&
        ema9 > ema21 &&
        macd > 0 &&
        rsi > 50 &&
        rsi < 70 &&
        volumeRatio > 1.20 &&
        adx >= 20 &&
        resistanceDistance > 0.30 &&
        bullishPattern;

    // =============================
    // SELL CONDITIONS
    // =============================

    const sellPass =
        trend === "BEARISH" &&
        ema9 < ema21 &&
        macd < 0 &&
        rsi < 50 &&
        rsi > 30 &&
        volumeRatio > 1.20 &&
        adx >= 20 &&
        supportDistance > 0.30 &&
        bearishPattern;

        // =============================
    // FINAL SIGNAL
    // =============================

    if (buyPass) {

        return "BUY";

    }

    if (sellPass) {

        return "SELL";

    }

    return "WAIT";

}
