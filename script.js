const scanBtn = document.getElementById("scanBtn");
const signalBox = document.getElementById("signal");
const priceBox = document.getElementById("price");
const timeBox = document.getElementById("time");

scanBtn.addEventListener("click", scan);

window.onload = scan;

async function scan(){

    try{

        signalBox.innerText = "SCANNING...";
        signalBox.className = "wait";

        const symbol = document
            .getElementById("symbol")
            .value
            .trim()
            .toUpperCase();

        // =============================
        // Binance Futures 15m Candles
        // =============================

        const candleResponse = await fetch(

            `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=15m&limit=200`

        );

        if(!candleResponse.ok){

            throw new Error("Invalid Symbol");

        }

        const candles = await candleResponse.json();

        // =============================
        // Live Price
        // =============================

        const priceResponse = await fetch(

            `https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}`

        );

        const priceData = await priceResponse.json();

        priceBox.innerText =
            Number(priceData.price).toFixed(4);

        // =============================
        // Signal Engine
        // =============================

        const signal =
            generateSignal(candles);

        signalBox.innerText = signal;

        signalBox.className = "";

        if(signal === "BUY"){

            signalBox.classList.add("buy");

        }
        else if(signal === "SELL"){

            signalBox.classList.add("sell");

        }
        else{

            signalBox.classList.add("wait");

        }

        const now = new Date();

        timeBox.innerText =
            "Updated : " +
            now.toLocaleTimeString();

    }
    catch(error){

        console.error(error);

        signalBox.innerText = "WAIT";

        signalBox.className = "wait";

        priceBox.innerText = "--";

        alert("Invalid Coin Symbol");

    }

}
