const scanBtn = document.getElementById("scanBtn");
const signalBox = document.getElementById("signal");

scanBtn.addEventListener("click", scanCoin);

window.onload = scanCoin;

async function scanCoin() {

    try {

        signalBox.innerText = "SCANNING...";
        signalBox.className = "signal wait";

        const symbol = document
            .getElementById("symbol")
            .value
            .trim()
            .toUpperCase();

        if (!symbol) {

            alert("Enter Coin Symbol");

            return;

        }

        const url =
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=200`;

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error("Invalid Symbol");

        }

        const candles = await response.json();

        const result = generateSignal(candles);

        signalBox.innerText = result;

        signalBox.className = "signal";

        if (result === "BUY") {

            signalBox.classList.add("buy");

        }
        else if (result === "SELL") {

            signalBox.classList.add("sell");

        }
        else {

            signalBox.classList.add("wait");

        }

    }
    catch (error) {

        console.error(error);

        signalBox.innerText = "WAIT";
        signalBox.className = "signal wait";

    }

}
