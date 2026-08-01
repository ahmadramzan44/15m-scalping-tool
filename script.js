// =====================================
// MAIN SCRIPT
// =====================================

const symbolInput = document.getElementById("symbol");
const scanBtn = document.getElementById("scanBtn");
const priceBox = document.getElementById("price");
const signalBox = document.getElementById("signal");

let scanTimer = null;

async function updateMarket(){

    try{

        const symbol = currentSymbol;

        if(symbol === "") return;

        // Live Price
        const price = await getPrice(symbol);

        priceBox.innerText = price.toFixed(4);

        // Candles
       const candles15 = await getCandles(symbol);

const candles5 = await get5mCandles(symbol);

const candles1 = await get1mCandles(symbol);

// Signal
const signal = generateSignal(
    candles15,
    candles5,
    candles1
);
        signalBox.innerText = signal;

        signalBox.className = "";

        switch(signal){

            case "STRONG BUY":

                signalBox.classList.add("buy");

                break;

            case "BUY":

                signalBox.classList.add("buy");

                break;

            case "STRONG SELL":

                signalBox.classList.add("sell");

                break;

            case "SELL":

                signalBox.classList.add("sell");

                break;

            default:

                signalBox.classList.add("wait");

        }

    }
    catch(error){

        console.error(error);

    }

}

// =====================================
// START SCANNER
// =====================================

function startScanner(){

    clearInterval(scanTimer);

    updateMarket();

    scanTimer = setInterval(updateMarket,2000);

}

// =====================================
// SCAN BUTTON
// =====================================

scanBtn.addEventListener("click",()=>{

    let symbol = symbolInput.value
        .trim()
        .toUpperCase();

    if(symbol==="") return;

    if(!symbol.endsWith("USDT")){

        symbol += "USDT";

    }

    currentSymbol = symbol;

    startScanner();

});

// =====================================
// STOP WHILE TYPING
// =====================================

symbolInput.addEventListener("focus",()=>{

    clearInterval(scanTimer);

});

// =====================================
// ENTER KEY SUPPORT
// =====================================

symbolInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        scanBtn.click();

    }

});

// =====================================
// DEFAULT COIN
// =====================================

currentSymbol="BTCUSDT";

startScanner();
