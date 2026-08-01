// =======================================
// 15M SCALPING ENGINE V4
// Trend + Momentum + Confirmation
// =======================================

function generateSignal(candles15, candles5, candles1){

    if(

        candles15.length < 210 ||

        candles5.length < 120 ||

        candles1.length < 120

    ){

        return "WAIT";

    }

    // ======================
    // 15m DATA
    // ======================

    const close15 = candles15.map(c=>c.close);
    const volume15 = candles15.map(c=>c.volume);

    const last15 =
        candles15[candles15.length-1];

    const prev15 =
        candles15[candles15.length-2];

    // ======================
    // 5m DATA
    // ======================

    const close5 =
        candles5.map(c=>c.close);

    const last5 =
        candles5[candles5.length-1];

    const prev5 =
        candles5[candles5.length-2];

    // ======================
    // 1m DATA
    // ======================

    const close1 =
        candles1.map(c=>c.close);

    const last1 =
        candles1[candles1.length-1];

    const prev1 =
        candles1[candles1.length-2];

    // ======================
    // SCORES
    // ======================

    let buy = 0;
    let sell = 0;

    // ==========================
    // 15m TREND
    // ==========================

    const ema20_15 = EMA(close15,20);
    const ema50_15 = EMA(close15,50);

    if(ema20_15 > ema50_15){

        buy += 25;

    }else{

        sell += 25;

    }

    // ==========================
    // 5m CONFIRMATION
    // ==========================

    const ema20_5 = EMA(close5,20);
    const ema50_5 = EMA(close5,50);

    if(ema20_5 > ema50_5){

        buy += 25;

    }else{

        sell += 25;

    }

    // ==========================
    // 1m ENTRY MOMENTUM
    // ==========================

    const ema5_1 = EMA(close1,5);
    const ema13_1 = EMA(close1,13);

    if(ema5_1 > ema13_1){

        buy += 20;

    }else{

        sell += 20;

    }

    // ==========================
    // RSI (1m)
    // ==========================

    const rsi1 = RSI(close1,14);

    if(rsi1 >= 55 && rsi1 <= 68){

        buy += 10;

    }

    if(rsi1 <= 45 && rsi1 >= 32){

        sell += 10;

    }

    // ==========================
    // LAST TWO 1m CANDLES
    // ==========================

    if(

        last1.close > last1.open &&
        prev1.close > prev1.open

    ){

        buy += 10;

    }

    if(

        last1.close < last1.open &&
        prev1.close < prev1.open

    ){

        sell += 10;

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
    // VOLUME CONFIRMATION
    // ==========================

    const avgVolume15 = SMA(volume15,20);

    if(last15.volume > avgVolume15 * 1.30){

        if(buy > sell){

            buy += 10;

        }

        if(sell > buy){

            sell += 10;

        }

    }

    // ==========================
    // VWAP FILTER
    // ==========================

    const vwap15 = VWAP(candles15);

    if(last15.close > vwap15){

        buy += 10;

    }else{

        sell += 10;

    }

    // ==========================
    // ATR FILTER
    // ==========================

    const atr15 = ATR(candles15,14);

    if(atr15 < (last15.close * 0.0015)){

        return "WAIT";

    }

    // ==========================
    // FALSE BREAKOUT FILTER
    // ==========================

    const bullishBreakout =
        last1.close > prev1.high &&
        last1.low >= prev1.low;

    const bearishBreakout =
        last1.close < prev1.low &&
        last1.high <= prev1.high;

    if(!bullishBreakout && buy >= 70){

        buy -= 15;

    }

    if(!bearishBreakout && sell >= 70){

        sell -= 15;

    }

    // ==========================
    // TREND CONFIRMATION
    // ==========================

    const trendAlignedBuy =
        ema20_15 > ema50_15 &&
        ema20_5 > ema50_5 &&
        ema5_1 > ema13_1;

    const trendAlignedSell =
        ema20_15 < ema50_15 &&
        ema20_5 < ema50_5 &&
        ema5_1 < ema13_1;

    // ==========================
    // FINAL SIGNAL
    // ==========================

    if(

        trendAlignedBuy &&
        buy >= 95

    ){

        return "STRONG BUY";

    }

    if(

        trendAlignedSell &&
        sell >= 95

    ){

        return "STRONG SELL";

    }

    if(

        trendAlignedBuy &&
        buy >= 70

    ){

        return "BUY";

    }

    if(

        trendAlignedSell &&
        sell >= 70

    ){

        return "SELL";

    }

    return "WAIT";

}
