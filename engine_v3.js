// =======================================
// 15M + 1M SCALPING ENGINE V3
// =======================================

function generateSignal(candles15, candles1){

    if(
        candles15.length < 210 ||
        candles1.length < 100
    ){

        return "WAIT";

    }

    // ==========================
    // 15m DATA
    // ==========================

    const closes15 = candles15.map(c=>c.close);
    const volumes15 = candles15.map(c=>c.volume);

    const last15 =
        candles15[candles15.length-1];

    const prev15 =
        candles15[candles15.length-2];

    // ==========================
    // 1m DATA
    // ==========================

    const closes1 = candles1.map(c=>c.close);

    const last1 =
        candles1[candles1.length-1];

    const prev1 =
        candles1[candles1.length-2];

    // ==========================
    // 15m TREND
    // ==========================

    const ema20 =
        EMA(closes15,20);

    const ema50 =
        EMA(closes15,50);

    const trendUp =
        ema20 > ema50;

    const trendDown =
        ema20 < ema50;

    // ==========================
    // 1m MOMENTUM
    // ==========================

    const fast =
        EMA(closes1,5);

    const slow =
        EMA(closes1,13);

    const momentumUp =
        fast > slow;

    const momentumDown =
        fast < slow;

    // ==========================
    // RSI
    // ==========================

    const rsi =
        RSI(closes1,14);

    // ==========================
    // BUY / SELL SCORE
    // ==========================

    let buy = 0;
    let sell = 0;

    // ==========================
    // TREND SCORE
    // ==========================

    if(trendUp){

        buy += 30;

    }

    if(trendDown){

        sell += 30;

    }

    // ==========================
    // MOMENTUM SCORE
    // ==========================

    if(momentumUp){

        buy += 25;

    }

    if(momentumDown){

        sell += 25;

    }

    // ==========================
    // RSI FILTER
    // ==========================

    if(rsi >= 55 && rsi <= 70){

        buy += 20;

    }

    if(rsi <= 45 && rsi >= 30){

        sell += 20;

    }

    // ==========================
    // 1m CANDLE MOMENTUM
    // ==========================

    if(

        last1.close > last1.open &&
        prev1.close > prev1.open

    ){

        buy += 15;

    }

    if(

        last1.close < last1.open &&
        prev1.close < prev1.open

    ){

        sell += 15;

    }

    // ==========================
    // BREAKOUT
    // ==========================

    if(last1.close > prev1.high){

        buy += 10;

    }

    if(last1.close < prev1.low){

        sell += 10;

    }

    // ==========================
    // VOLUME
    // ==========================

    const avgVolume15 =
        SMA(volumes15,20);

    if(last15.volume > avgVolume15){

        if(trendUp){

            buy += 10;

        }

        if(trendDown){

            sell += 10;

        }

    }

    // ==========================
    // VWAP FILTER
    // ==========================

    const vwap = VWAP(candles15);

    if(last15.close > vwap){

        buy += 10;

    }else{

        sell += 10;

    }

    // ==========================
    // ATR FILTER
    // ==========================

    const atr = ATR(candles15,14);

    if(atr < (last15.close * 0.0015)){

        return "WAIT";

    }

    // ==========================
    // SIGNAL
    // ==========================

    const diff = Math.abs(buy - sell);

    if(diff < 15){

        return "WAIT";

    }

    if(buy >= 90){

        return "STRONG BUY";

    }

    if(sell >= 90){

        return "STRONG SELL";

    }

    if(buy >= 65){

        return "BUY";

    }

    if(sell >= 65){

        return "SELL";

    }

    return "WAIT";

}

