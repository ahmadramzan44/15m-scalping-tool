// =======================================
// 15M SCALPING ENGINE V2
// =======================================

function generateSignal(candles){

    if(candles.length < 210){

        return "WAIT";

    }

    const closes = candles.map(c=>c.close);
    const volumes = candles.map(c=>c.volume);

    const last = candles[candles.length-1];
    const prev = candles[candles.length-2];
    const prev2 = candles[candles.length-3];

    // ==========================
    // INDICATORS
    // ==========================

    const ema9 = EMA(closes,9);
    const ema21 = EMA(closes,21);
    const ema200 = EMA(closes,200);

    const rsi = RSI(closes,14);

    const atr = ATR(candles,14);

    const vwap = VWAP(candles);

    const avgVolume = SMA(volumes,20);

    const volumeRatio =
        last.volume / avgVolume;

    const ema12 = EMA(closes,12);

    const ema26 = EMA(closes,26);

    const macd = ema12 - ema26;

    const prevRSI =
        RSI(closes.slice(0,-1),14);

    const prevMacd =
        EMA(closes.slice(0,-1),12)
        -
        EMA(closes.slice(0,-1),26);

    const emaSlope =
        ema9 -
        EMA(closes.slice(0,-1),9);

    // ==========================
    // SCORE
    // ==========================

    let buyScore = 0;
    let sellScore = 0;

    // ==========================
    // EMA TREND
    // ==========================

    if(ema9 > ema21){

        buyScore += 20;

        if(emaSlope > 0){

            buyScore += 10;

        }

    }else{

        sellScore += 20;

        if(emaSlope < 0){

            sellScore += 10;

        }

    }

    // ==========================
    // EMA200 FILTER
    // ==========================

    if(last.close > ema200){

        buyScore += 15;

    }else{

        sellScore += 15;

    }

    // ==========================
    // RSI MOMENTUM
    // ==========================

    if(rsi > prevRSI){

        buyScore += 15;

    }

    if(rsi < prevRSI){

        sellScore += 15;

    }

    if(rsi > 75){

        buyScore -= 10;

    }

    if(rsi < 25){

        sellScore -= 10;

    }

    // ==========================
    // MACD MOMENTUM
    // ==========================

    if(macd > prevMacd){

        buyScore += 15;

    }

    if(macd < prevMacd){

        sellScore += 15;

    }

    // ==========================
    // LAST 3 CANDLES
    // ==========================

    const green1 = last.close > last.open;
    const green2 = prev.close > prev.open;
    const green3 = prev2.close > prev2.open;

    const red1 = last.close < last.open;
    const red2 = prev.close < prev.open;
    const red3 = prev2.close < prev2.open;

    if(green1 && green2){

        buyScore += 15;

    }

    if(green1 && green2 && green3){

        buyScore += 10;

    }

    if(red1 && red2){

        sellScore += 15;

    }

    if(red1 && red2 && red3){

        sellScore += 10;

    }

    // ==========================
    // VOLUME
    // ==========================

    if(volumeRatio >= 1.20){

        if(green1){

            buyScore += 10;

        }

        if(red1){

            sellScore += 10;

        }

    }

    // ==========================
    // VWAP
    // ==========================

    if(last.close > vwap){

        buyScore += 10;

    }else{

        sellScore += 10;

    }

    // ==========================
    // BREAKOUT
    // ==========================

    if(last.close > prev.high){

        buyScore += 15;

    }

    if(last.close < prev.low){

        sellScore += 15;

    }

    // ==========================
    // ATR FILTER
    // ==========================

    const minATR = last.close * 0.0015;

    if(atr < minATR){

        return "WAIT";

    }

    // ==========================
    // FINAL DECISION
    // ==========================

    if(buyScore >= 95){

        return "STRONG BUY";

    }

    if(sellScore >= 95){

        return "STRONG SELL";

    }

    if(buyScore >= 70 && buyScore > sellScore){

        return "BUY";

    }

    if(sellScore >= 70 && sellScore > buyScore){

        return "SELL";

    }

    return "WAIT";

}
