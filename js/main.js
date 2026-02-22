const username = localStorage.getItem('username');
const greeting = document.querySelector('h4');
greeting.textContent = `안녕하세요, ${username}님`;

// 상품 구매 함수 (가격만큼 금액 차감)
function buyProduct(idx) {
    let money = document.getElementById("money");
    let prices = document.getElementsByClassName("td-price");
    let wallets = document.getElementsByClassName("td-wallet");

    //1,000 숫자로 만들기 어렵. 순수한 문자열 만들기 위한 메소드
    let price = parseInt(prices[idx].innerText.replace(/,/g, ''));
    let currentMoney = parseInt(money.innerText.replace(/,/g, ''));

    if (currentMoney < price) {
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

function buy(idx) {
    let money = document.getElementById("money");
    let prices = document.getElementsByClassName("td-price");
    let wallets = document.getElementsByClassName("td-wallet");
    let inputs = document.getElementsByClassName("input");

    let price = parseInt(prices[idx].innerText);
    let qty = parseInt(inputs[idx].value);

    if (isNaN(qty) || qty <= 0) {
        alert("수량을 숫자로 입력하세요");
        return;
    }

    let total = price * qty;
    let currentMoney = parseInt(money.innerText);

    if (currentMoney < total) {
        alert("돈이 부족합니다");
        return;
    }

    currentMoney -= total;
    money.innerText = currentMoney;

    let currentStock = parseInt(wallets[idx].innerText.replace("보유 : ", ""));
    wallets[idx].innerText = "보유 : " + (currentStock + qty);
}

function sell(idx) {
    let money = document.getElementById("money");
    let prices = document.getElementsByClassName("price");
    let wallets = document.getElementsByClassName("wallet");
    let inputs = document.getElementsByClassName("input");

    let price = parseInt(prices[idx].innerText);
    let qty = parseInt(inputs[idx].value);

    if (isNaN(qty) || qty <= 0) {
        alert("수량을 숫자로 입력하세요");
        return;
    }

    let currentStock = parseInt(wallets[idx].innerText.replace("보유 : ", ""));

    if (currentStock < qty) {
        alert("보유 수량 부족");
        return;
    }

    wallets[idx].innerText = "보유 : " + (currentStock - qty);

    let currentMoney = parseInt(money.innerText);
    money.innerText = currentMoney + (price * qty);
}

//모든 li의 spendSpan 선택하여 버튼 클릭 시 +1시간
function increaseAll() {
    const allSpendSpans = document.querySelectorAll(".eventList .spendTime");

    allSpendSpans.forEach(span => {
        const current = parseInt(span.textContent) || 0;
        // 텍스트를 바꾸는 순간, 아래 newEvent 클래스에 작성한 감시자가 이를 감지
        span.textContent = current + 1;
    });
}

let time = 0;
function nextTime() {
    time++;
    /* 가격 변동 */

    /* 랜덤 이벤트 발생 */
    let randomEvent = new newEvent;
    randomEvent.createLi();

    /* 모든 시간 +1시간 */
    increaseAll();
}


//생성자 함수 == 클래스(기능성 거의 동일)
//but, 가독성면으로 좀 더 좋기에 사용합니다!

//이벤트 만드는 클래스
class newEvent {
    createLi() {
        let eventUl = document.querySelector(".eventList");
        let eventLi = document.createElement("li");
        let eventSpan1 = document.createElement("span");
        let eventSpan2 = document.createElement("span")

        /* 이런 구조로 생성
        <li>
            <span class="eventName">
            [전령의 외침] 백설공주의 축복으로 각설탕 조각에 황금빛 향기가 진동하며 품절 대란이 일어났습니다!
            </span>
            <span class="eventType">
            각설탕 조각 계열, 총
                <span class="totalTime">7</span>
                시간(
                <span class="spendTime">2</span>
                시간째)
            </span>
        </li>
        */

        /* 첫번째 span : 이벤트 문장 */
        eventSpan1.classList.add("eventName");
        //이벤트문장 삽입
        let eventSentence = new makeEventSentence;
        let temp = eventSentence.makeSentence(); //[0] : 만든 문장, [1] : 문장 내 아이템
        eventSpan1.textContent = temp[0];

        /* 두번째 span : 이벤트 요약 */
        eventSpan2.classList.add("eventType");
        //이벤트 적용될 전체 시간
        const randomTime = Math.floor(Math.random() * 31) + 1;
        //"{아이템} 계열, 총 n시간(n시간 째)" 입력
        eventSpan2.innerHTML = `${temp[1]} 계열, 총 <span class="totalTime">${randomTime}</span>시간(<span class="spendTime">0</span>시간째)`;

        eventLi.appendChild(eventSpan1);
        eventLi.appendChild(eventSpan2);
        eventUl.appendChild(eventLi);

        //자식으로 붙인 후에 가져오기
        const totalSpan = eventSpan2.querySelector(".totalTime");
        const spendSpan = eventSpan2.querySelector(".spendTime");

        //전체 시간만큼 현재 시간이 올라가면 삭제하게끔 해주는 감시자
        const observer = new MutationObserver(() => {
            const total = parseInt(totalSpan.textContent);
            const spend = parseInt(spendSpan.textContent);

            if (spend >= total) {
                eventLi.remove(); //li 삭제
                observer.disconnect(); //감시자 종료
            }
        });

        //spendSpan의 텍스트가 바뀔 때만 작동하도록!
        observer.observe(spendSpan, {
            characterData: true, childList: true, subtree: true
        });
    }
}

//이벤트 문장 만드는 클래스
class makeEventSentence {
    //이벤트는 [tag] "(actor)의 축복으로 (item)에 황금빛 향기가 진동하며 품절 대란이 일어났습니다!" 구조
    //이벤트문장(전 이벤트명) = type 이라고 정의(상승/하락/변동)으로 나눴기 때문
    constructor() {
        this.tags = ["[전령의 외침] ", "[긴급 양피지] ", "[수정구슬 예언] "];
        this.actors = ["백설공주", "산타클로스", "헨젤", "앨리스", "찰리", "엘사", "매드 연금술사", "숲속 마녀", "유니콘", "파우스트", "닥터 스트레인지", "잠자는 드래곤", "아기돼지 삼형제", "불사조", "캘시퍼", "일곱 난쟁이", "말레피센트", "지니", "피노키오", "전령 비둘기", "마법의 소라고둥", "팅커벨", "아리에티", "토토로", "요정 대모", "포뇨", "밤비"];
        this.items = ["얼음 아이스크림", "각설탕 조각", "투명 젤리", "무지개 도넛", "몸이 커지는 약", "영생의 포션", "용기 충전 앰플", "사랑의 묘약", "마력 수정", "드래곤의 숨결", "황금 알", "영롱한 운석", "말하는 거울", "수정구슬", "예언의 양피지", "텔레파시 보석", "요정 가루", "잎사귀 우산", "빛나는 씨앗", "반딧불 랜턴", "이슬 방울"];
        //객체(Object) 형태, key값(UP, DOWN, RANDOM)을 가지며, 각각 리스트[]를 담고 있다
        this.types = {
            UP: [
                "{actor}의 축복으로 {item}에 황금빛 향기가 진동하며 품절 대란이 일어났습니다!",
                "{actor}(이)가 {item}(을)를 정성껏 닦자 요정이 나타나 소원을 들어주었다는 소식입니다!",
                "{actor}(이)가 유적에서 전설의 {item}(을)를 무더기로 찾아내 대박을 터뜨렸습니다.",
                "{actor}(이)가 {item}(을)를 공식 예물로 선정하자 전국의 상단이 물품 수급에 나섰습니다."
            ],
            DOWN: [
                "비보입니다! {actor}의 실수로 {item} 창고 전체가 돌덩이로 변하는 저주에 걸렸습니다.",
                "{actor}(이)가 {item}의 끔찍한 독성을 폭로하자 사람들이 물품을 강에 내다 버리기 시작합니다!",
                "{actor}(이)가 뿌린 복제 {item} 때문에 물건 값이 바닥을 치고 있습니다!",
                "{item}(을)를 가진 자는 {actor}의 저주를 받아 영원히 잠들 것이라는 신탁이 내려왔습니다!"
            ],
            RANDOM: [
                "{actor}(이)가 {item} 독점 혐의로 재판에 넘겨져 판결을 기다리고 있습니다.",
                "하늘의 틈새에서 쏟아지는 빛이 {item}의 힘을 바꿀지 {actor}(을)를 포함한 그 누구도 모르는 상황입니다."
            ]
        };
    }

    //이벤트 문장 조합하는 메서드
    makeSentence() {
        //타입 고르기
        let typeKeys = Object.keys(this.types); //[UP, DOWN, RANDOM]
        let picTypeKey = typeKeys[Math.floor(Math.random() * (typeKeys.length))]; //UP, DOWN, RANDOM 중 하나
        //문장 고르기
        let picTypeList = this.types[picTypeKey]; //문장 리스트[]
        let picType = picTypeList[Math.floor(Math.random() * (picTypeList.length))]; //문장 " "
        //태그 고르기
        let picTag = this.tags[Math.floor(Math.random() * (this.tags.length))];
        //인물 고르기
        let picActor = this.actors[Math.floor(Math.random() * (this.actors.length))];
        //아이템 고르기
        let picItem = this.items[Math.floor(Math.random() * (this.items.length))];
        //문장 조합!
        let mixSentence = picType
            .replaceAll("{actor}", picActor)
            .replaceAll("{item}", picItem);
        return [picTag + mixSentence, picItem]; //두번째 문장에서 동일한 아이템명이 필요하기에 함께 list로 return
    }
}





function shop() {
    alert("준비중입니다!");
}

function endGame() {
    alert("게임 종료");
}