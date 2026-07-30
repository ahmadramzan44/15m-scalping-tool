// ===============================
// 15 Minute Countdown
// ===============================

function updateTimer(){

    const now = new Date();

    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const remainMinutes = 14 - (minutes % 15);
    const remainSeconds = 60 - seconds;

    let m = remainMinutes;
    let s = remainSeconds;

    if(s === 60){

        s = 0;

    }else{

        m--;

    }

    if(m < 0){

        m = 14;

    }

    const mm = String(m).padStart(2,"0");
    const ss = String(s).padStart(2,"0");

    document.getElementById("time").innerText =
        "Next Candle : " + mm + ":" + ss;

}

setInterval(updateTimer,1000);

updateTimer();
