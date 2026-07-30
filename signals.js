// =======================================
// 15M SCALPING SIGNAL ENGINE
// PART 1
// =======================================

// ---------- SMA ----------
function sma(values, period){

    if(values.length < period) return 0;

    let sum = 0;

    for(let i = values.length-period; i < values.length; i++){

        sum += values[i];

    }

    return sum / period;

}

// ---------- EMA ----------
function ema(values, period){

    if(values.length < period) return 0;

    const k = 2 / (period + 1);

    let value = sma(values.slice(0, period), period);

    for(let i = period; i < values.length; i++){

        value = values[i] * k + value * (1-k);

    }

    return value;

}

// ---------- RSI ----------
function rsi(values, period = 14){

    if(values.length < period + 1) return 50;

    let gain = 0;
    let loss = 0;

    for(let i = values.length-period; i < values.length; i++){

        const diff = values[i] - values[i-1];

        if(diff > 0){

            gain += diff;

        }else{

            loss += Math.abs(diff);

        }

    }

    if(loss === 0) return 100;

    const rs = gain / loss;

    return 100 - (100 / (1 + rs));

}

// ---------- ATR ----------
function atr(candles, period = 14){

    if(candles.length < period + 1) return 0;

    const tr = [];

    for(let i=1;i<candles.length;i++){

        const high = Number(candles[i][2]);
        const low = Number(candles[i][3]);
        const prevClose = Number(candles[i-1][4]);

        tr.push(

            Math.max(

                high-low,

                Math.abs(high-prevClose),

                Math.abs(low-prevClose)

            )

        );

    }

    return sma(tr,period);

}

// =======================================
// MAIN FUNCTION
// =======================================

function generateSignal(candles){

    const closes = candles.map(c=>Number(c[4]));

    const volumes = candles.map(c=>Number(c[5]));

    const highs = candles.map(c=>Number(c[2]));

    const lows = candles.map(c=>Number(c[3]));

    const lastPrice = closes.at(-1);

    const ema9 = ema(closes,9);

    const ema21 = ema(closes,21);

    const ema50 = ema(closes,50);

    const rsiValue = rsi(closes);

    const atrValue = atr(candles);

        // =======================================
    // MACD
    // =======================================

    const ema12 = ema(closes,12);
    const ema26 = ema(closes,26);

    const macd = ema12 - ema26;

    // =======================================
    // VOLUME
    // =======================================

    const avgVolume = sma(volumes,20);

    const volumeRatio = avgVolume > 0
        ? volumes.at(-1) / avgVolume
        : 1;

    // =======================================
    // TREND
    // =======================================

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

    // =======================================
    // ADX (Approximation)
    // =======================================

    let adx = atrValue * 8;

    if(adx > 50){

        adx = 50;

    }

    // =======================================
    // SUPPORT / RESISTANCE
    // =======================================

    const recentHigh = Math.max(...highs.slice(-20));
    const recentLow  = Math.min(...lows.slice(-20));

    const resistanceDistance =
        ((recentHigh-lastPrice)/lastPrice)*100;

    const supportDistance =
        ((lastPrice-recentLow)/lastPrice)*100;

        // =======================================
    // CANDLE PATTERNS
    // =======================================

    const prev = candles[candles.length - 2];
    const last = candles[candles.length - 1];

    const prevOpen = Number(prev[1]);
    const prevClose = Number(prev[4]);

    const open = Number(last[1]);
    const close = Number(last[4]);
    const high = Number(last[2]);
    const low = Number(last[3]);

    const body = Math.abs(close - open);
    const upperWick = high - Math.max(open, close);
    const lowerWick = Math.min(open, close) - low;

    let bullishPattern = false;
    let bearishPattern = false;

    // =============================
    // Bullish Engulfing
    // =============================

    if (
        prevClose < prevOpen &&
        close > open &&
        close >= prevOpen &&
        open <= prevClose
    ) {

        bullishPattern = true;

    }

    // =============================
    // Bearish Engulfing
    // =============================

    if (
        prevClose > prevOpen &&
        close < open &&
        open >= prevClose &&
        close <= prevOpen
    ) {

        bearishPattern = true;

    }

    // =============================
    // Hammer
    // =============================

    if (
        lowerWick > body * 2 &&
        upperWick < body
    ) {

        bullishPattern = true;

    }

    // =============================
    // Shooting Star
    // =============================

    if (
        upperWick > body * 2 &&
        lowerWick < body
    ) {

        bearishPattern = true;

    }

    // =======================================
    // BUY CONDITIONS
    // =======================================

    const buySignal =

        trend === "BULLISH" &&
        ema9 > ema21 &&
        macd > 0 &&
        rsiValue >= 52 &&
        rsiValue <= 68 &&
        adx >= 20 &&
        volumeRatio >= 1.20 &&
        resistanceDistance >= 0.25 &&
        bullishPattern;

    // =======================================
    // SELL CONDITIONS
    // =======================================

    const sellSignal =

        trend === "BEARISH" &&
        ema9 < ema21 &&
        macd < 0 &&
        rsiValue >= 32 &&
        rsiValue <= 48 &&
        adx >= 20 &&
        volumeRatio >= 1.20 &&
        supportDistance >= 0.25 &&
        bearishPattern;

        // =======================================
    // FINAL 15M SCALPING FILTERS
    // =======================================

    const candleRange = high - low;

    // Weak candle
    const strongCandle =
        candleRange >= atrValue * 0.60;

    // EMA distance
    const emaGap =
        Math.abs(ema9 - ema21);

    const emaTrendStrong =
        emaGap >= atrValue * 0.05;

    // Avoid flat market
    const marketActive =
        atrValue > lastPrice * 0.0015;

    // Final BUY
    const finalBuy =

        buySignal &&
        strongCandle &&
        emaTrendStrong &&
        marketActive;

    // Final SELL
    const finalSell =

        sellSignal &&
        strongCandle &&
        emaTrendStrong &&
        marketActive;

        // =======================================
    // FINAL DECISION
    // =======================================

    if (finalBuy) {

        return "BUY";

    }

    if (finalSell) {

        return "SELL";

    }

    return "WAIT";

}
