// =====================================
// Binance 15m Countdown
// =====================================

async function updateTimer(){

    try{

        const res = await fetch(
            "https://api.binance.com/api/v3/time"
        );

        const data = await res.json();

        const now = new Date(data.serverTime);

        const totalSeconds =
            Math.floor(now.getTime()/1000);

        const remain =
            900 - (totalSeconds % 900);

        const minutes =
            Math.floor(remain/60);

        const seconds =
            remain % 60;

        document.getElementById("time").innerText =
            "Next Candle : " +
            String(minutes).padStart(2,"0") +
            ":" +
            String(seconds).padStart(2,"0");

    }

    catch(e){

        console.log(e);

    }

}

updateTimer();

setInterval(updateTimer,1000);
