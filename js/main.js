const username = localStorage.getItem('username');
const greeting = document.querySelector('h4');
greeting.textContent = `안녕하세요, ${username}님`;

// 상품 구매 함수 (가격만큼 금액 차감)
function buyProduct(idx){
    let money = document.getElementById("money");
    let prices = document.getElementsByClassName("td-price");
    let wallets = document.getElementsByClassName("td-wallet");

    //1,000 숫자로 만들기 어렵. 순수한 문자열 만들기 위한 메소드
    let price = parseInt(prices[idx].innerText.replace(/,/g, '')); 
    let currentMoney = parseInt(money.innerText.replace(/,/g, ''));

    if(currentMoney < price){
        alert("돈이 부족합니다");
        return;
    }

    // 보유금액에서 가격만큼 차감
    currentMoney -= price;
    money.innerText = currentMoney.toLocaleString(); 
    //toLocaleString() : 계산된 숫자를 다시 화면에 뿌려줄 때, 
    //사용자가 보기 편하도록 1,000 단위로 쉼표를 다시 찍어주는 아주 센스 있는 메서드

    // 보유 수량 증가
    let currentStock = parseInt(wallets[idx].innerText) || 0;
    wallets[idx].innerText = currentStock + 1;
}

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