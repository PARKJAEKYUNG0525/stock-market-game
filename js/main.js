function buy(idx){
    let money = document.getElementById("money");
    let prices = document.getElementsByClassName("td-price");
    let wallets = document.getElementsByClassName("td-wallet");
    let inputs = document.getElementsByClassName("input");

    let price = parseInt(prices[idx].innerText);
    let qty = parseInt(inputs[idx].value);

    if(isNaN(qty) || qty <= 0){
        alert("수량을 숫자로 입력하세요");
        return;
    }

    let total = price * qty;
    let currentMoney = parseInt(money.innerText);

    if(currentMoney < total){
        alert("돈이 부족합니다");
        return;
    }

    currentMoney -= total;
    money.innerText = currentMoney;

    let currentStock = parseInt(wallets[idx].innerText.replace("보유 : ",""));
    wallets[idx].innerText = "보유 : " + (currentStock + qty);
}

function sell(idx){
    let money = document.getElementById("money");
    let prices = document.getElementsByClassName("price");
    let wallets = document.getElementsByClassName("wallet");
    let inputs = document.getElementsByClassName("input");

    let price = parseInt(prices[idx].innerText);
    let qty = parseInt(inputs[idx].value);

    if(isNaN(qty) || qty <= 0){
        alert("수량을 숫자로 입력하세요");
        return;
    }

    let currentStock = parseInt(wallets[idx].innerText.replace("보유 : ",""));

    if(currentStock < qty){
        alert("보유 수량 부족");
        return;
    }

    wallets[idx].innerText = "보유 : " + (currentStock - qty);

    let currentMoney = parseInt(money.innerText);
    money.innerText = currentMoney + (price * qty);
}

function nextDay(){ alert("다음날! (가격 변동 기능 추가 가능)"); }
function shop(){ alert("준비중입니다!"); }
function endGame(){ alert("게임 종료"); }