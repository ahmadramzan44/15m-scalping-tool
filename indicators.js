// =======================================
// INDICATORS
// =======================================

// SMA
function SMA(data, period){

    if(data.length < period) return 0;

    let sum = 0;

    for(let i=data.length-period;i<data.length;i++){

        sum += data[i];

    }

    return sum/period;

}

// EMA
function EMA(data, period){

    if(data.length < period) return 0;

    const k = 2/(period+1);

    let ema = SMA(data.slice(0,period),period);

    for(let i=period;i<data.length;i++){

        ema = data[i]*k + ema*(1-k);

    }

    return ema;

}

// RSI
function RSI(closes, period=14){

    if(closes.length < period+1) return 50;

    let gain=0;
    let loss=0;

    for(let i=closes.length-period;i<closes.length;i++){

        const diff = closes[i]-closes[i-1];

        if(diff>0){

            gain+=diff;

        }else{

            loss+=Math.abs(diff);

        }

    }

    if(loss===0) return 100;

    const rs = gain/loss;

    return 100-(100/(1+rs));

}

// ATR
function ATR(candles,period=14){

    if(candles.length<period+1) return 0;

    const tr=[];

    for(let i=1;i<candles.length;i++){

        const h = candles[i].high;
        const l = candles[i].low;
        const pc = candles[i-1].close;

        tr.push(

            Math.max(

                h-l,

                Math.abs(h-pc),

                Math.abs(l-pc)

            )

        );

    }

    return SMA(tr,period);

}

// VWAP
function VWAP(candles){

    let pv=0;
    let vol=0;

    for(const c of candles){

        const tp=(c.high+c.low+c.close)/3;

        pv += tp*c.volume;

        vol += c.volume;

    }

    if(vol===0) return 0;

    return pv/vol;

}
