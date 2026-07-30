// =======================================
// 15M SCALPING ENGINE
// =======================================

function generateSignal(candles){

    const closes = candles.map(c=>c.close);
    const volumes = candles.map(c=>c.volume);

    const last = candles[candles.length-1];
    const prev = candles[candles.length-2];

    // -----------------------------
    // Indicators
    // -----------------------------

    const ema9 = EMA(closes,9);
    const ema21 = EMA(closes,21);
    const ema200 = EMA(closes,200);

    const rsi = RSI(closes,14);

    const atr = ATR(candles,14);

    const vwap = VWAP(candles);

    // -----------------------------
    // Volume
    // -----------------------------

    const avgVolume = SMA(volumes,20);

    const volumeRatio =
        last.volume / avgVolume;

    // -----------------------------
    // MACD
    // -----------------------------

    const ema12 = EMA(closes,12);

    const ema26 = EMA(closes,26);

    const macd = ema12 - ema26;

    // -----------------------------
    // Trend
    // -----------------------------

    let trend = "SIDEWAYS";

    if(
        ema9 > ema21 &&
        ema21 > ema200
    ){

        trend = "BULLISH";

    }

    if(
        ema9 < ema21 &&
        ema21 < ema200
    ){

        trend = "BEARISH";

    }

        // -----------------------------
    // Current Candle Strength
    // -----------------------------

    const body = Math.abs(last.close - last.open);

    const range = last.high - last.low;

    const bodyStrength =
        range > 0 ? body / range : 0;

    // -----------------------------
    // Previous Candle Breakout
    // -----------------------------

    const bullishBreakout =
        last.close > prev.high;

    const bearishBreakout =
        last.close < prev.low;

    // -----------------------------
    // VWAP Position
    // -----------------------------

    const aboveVWAP =
        last.close > vwap;

    const belowVWAP =
        last.close < vwap;

    // -----------------------------
    // Momentum Score
    // -----------------------------

    let buyScore = 0;
    let sellScore = 0;

    // EMA Trend
    const emaSlope = ema9 - EMA(closes.slice(0,-1),9);

if(ema9 > ema21 && emaSlope > 0){

    buyScore += 20;

}

if(ema9 < ema21 && emaSlope < 0){

    sellScore += 20;

}

    // EMA200 Filter
    if(last.close > ema200) buyScore += 15;
    if(last.close < ema200) sellScore += 15;

    // RSI
    const prevRSI = RSI(closes.slice(0,-1),14);

if(rsi > prevRSI && rsi >= 55){

    buyScore += 15;

}

if(rsi < prevRSI && rsi <= 45){

    sellScore += 15;

}

    // MACD
    const prevMacd =
EMA(closes.slice(0,-1),12) -
EMA(closes.slice(0,-1),26);

if(macd > prevMacd){

    buyScore += 20;

}

if(macd < prevMacd){

    sellScore += 20;

}

        // -----------------------------
    // Volume
    // -----------------------------

    if(volumeRatio >= 1.20){

        buyScore += 10;
        sellScore += 10;

    }

    // -----------------------------
    // VWAP
    // -----------------------------

    if(aboveVWAP){

        buyScore += 10;

    }

    if(belowVWAP){

        sellScore += 10;

    }

    // -----------------------------
    // Candle Strength
    // -----------------------------

    if(bodyStrength >= 0.60){

        if(last.close > last.open){

            buyScore += 10;

        }

        if(last.close < last.open){

            sellScore += 10;

        }

    }

    // -----------------------------
    // Breakout
    // -----------------------------

    if(bullishBreakout){

        buyScore += 10;

    }

    if(bearishBreakout){

        sellScore += 10;

    }

    // -----------------------------
    // ATR Filter
    // -----------------------------

    const minATR = last.close * 0.0015;

    if(atr < minATR){

        return "WAIT";

    }

        // -----------------------------
    // Trend Confirmation
    // -----------------------------

    if(trend === "BULLISH"){

        buyScore += 10;

    }

    if(trend === "BEARISH"){

        sellScore += 10;

    }

    // -----------------------------
    // Avoid Overbought / Oversold
    // -----------------------------

    if(rsi >= 75){

        buyScore -= 15;

    }

    if(rsi <= 25){

        sellScore -= 15;

    }

    // -----------------------------
    // Final Decision
    // -----------------------------

   const diff = Math.abs(buyScore - sellScore);

if(diff < 20){

    return "WAIT";

}

if(buyScore >= 85){

    return "STRONG BUY";

}

if(buyScore >= 65){

    return "BUY";

}

if(sellScore >= 85){

    return "STRONG SELL";

}

if(sellScore >= 65){

    return "SELL";

}

return "WAIT";
}
