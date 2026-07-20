const stage = document.querySelector("#slideStage");
const pageLabel = document.querySelector("#pageLabel");
const progressDots = document.querySelector("#progressDots");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");

let currentSlide = 0;
const visited = new Set([0]);

function placeBoard(digits, id, clickable = false) {
  const labels = ["千位", "百位", "十位", "個位"];
  const cells = digits.map((digit, index) => clickable
    ? `<td><button type="button" data-place-index="${index}" data-board-id="${id}">${digit}</button></td>`
    : `<td>${digit}</td>`).join("");
  return `<table class="place-board" aria-label="定位板">
    <caption>定位板</caption>
    <thead><tr>${labels.map(label => `<th scope="col">${label}</th>`).join("")}</tr></thead>
    <tbody><tr>${cells}</tr></tbody>
  </table>`;
}

const slides = [
  () => `<article class="slide cover center" data-slide-number="1">
    <div class="cover-mark" aria-hidden="true">位</div>
    <p class="unit-label">第 1 單元｜2000 以內的數</p>
    <h1>位值與數的讀寫</h1>
    <p class="subtitle">先定位，再說數字表示多少</p>
  </article>`,

  () => `<article class="slide" data-slide-number="2">
    <p class="slide-kicker">今天要學什麼</p>
    <h2>找出千位、百位、十位、個位</h2>
    <ul class="goal-list">
      <li><span>1</span>把數字放進定位板。</li>
      <li><span>2</span>說出每個數字表示多少。</li>
      <li><span>3</span>按照位值順序讀數和寫數。</li>
    </ul>
  </article>`,

  () => `<article class="slide" data-slide-number="3">
    <p class="slide-kicker">重點回顧｜先看錢幣的面額</p>
    <h2>不同換法，都能合成 1000 元</h2>
    <p class="key-message">點選左邊的面額，看看要幾張或幾個。</p>
    <div class="split">
      <div class="money-list">
        <div class="money-row"><button type="button" data-money="500元 × 2張＝1000元">500元</button><strong>× 2張</strong><output>＝1000元</output></div>
        <div class="money-row"><button type="button" data-money="100元 × 10張＝1000元">100元</button><strong>× 10張</strong><output>＝1000元</output></div>
        <div class="money-row"><button type="button" data-money="50元 × 20個＝1000元">50元</button><strong>× 20個</strong><output>＝1000元</output></div>
        <div class="money-row"><button type="button" data-money="10元 × 100個＝1000元">10元</button><strong>× 100個</strong><output>＝1000元</output></div>
        <div class="money-row"><button type="button" data-money="1元 × 1000個＝1000元">1元</button><strong>× 1000個</strong><output>＝1000元</output></div>
      </div>
      <div>
        ${placeBoard([1,0,0,0], "money")}
        <p class="board-note" id="moneyFeedback">1000 讀作：一千</p>
      </div>
    </div>
  </article>`,

  () => `<article class="slide" data-slide-number="4">
    <p class="slide-kicker">做做看｜1 個千、1 個百、6 個十和 2 個一</p>
    <h2>把數字放進正確的位置</h2>
    ${placeBoard([1,1,6,2], "1162", true)}
    <div class="value-cards">
      <div class="value-card">1個千＝1000</div>
      <div class="value-card">1個百＝100</div>
      <div class="value-card">6個十＝60</div>
      <div class="value-card">2個一＝2</div>
    </div>
    <p class="equation">1000 ＋ 100 ＋ 60 ＋ 2 ＝ 1162</p>
    <p class="board-note" id="boardFeedback-1162">點定位板中的數字，看看它表示多少。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="5">
    <p class="slide-kicker">柏宇存了 1524 元</p>
    <h2>用定位板記記看</h2>
    <div class="split">
      <div>
        ${placeBoard([1,5,2,4], "1524", true)}
        <p class="board-note" id="boardFeedback-1524">依序點 1、5、2、4。</p>
      </div>
      <div class="value-cards" style="grid-template-columns:1fr 1fr">
        <div class="value-card">1 → 1000</div>
        <div class="value-card">5 → 500</div>
        <div class="value-card">2 → 20</div>
        <div class="value-card">4 → 4</div>
      </div>
    </div>
    <p class="equation">1524 讀作：一千五百二十四</p>
  </article>`,

  () => `<article class="slide" data-slide-number="6">
    <p class="slide-kicker">1275 中的 1 和 2，各在什麼位？</p>
    <h2>先找位置，才知道表示多少</h2>
    ${placeBoard([1,2,7,5], "1275", true)}
    <div class="value-cards" style="grid-template-columns:1fr 1fr;max-width:70%;margin-left:auto;margin-right:auto">
      <div class="value-card">1 在千位，表示 1000</div>
      <div class="value-card">2 在百位，表示 200</div>
    </div>
    <p class="board-note" id="boardFeedback-1275">請先點 1，再點 2。</p>
    <p class="conclusion">先看數字在哪一位，才知道它表示多少。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="7">
    <p class="slide-kicker">做做看｜用定位板找答案</p>
    <div class="question-card">
      <div class="question-head"><h3>① 1245：每個數字各表示多少？</h3><button class="reveal-button" type="button" data-reveal="answer1245">顯示答案</button></div>
      <div class="question-layout">${placeBoard([1,2,4,5], "q1245")}<div id="answer1245" class="answer-box waiting">先自己說說看</div></div>
    </div>
    <div class="question-card">
      <div class="question-head"><h3>② 1363：兩個 3 表示的一樣多嗎？</h3><button class="reveal-button" type="button" data-reveal="answer1363">顯示答案</button></div>
      <div class="question-layout">${placeBoard([1,3,6,3], "q1363")}<div id="answer1363" class="answer-box waiting">先找兩個 3 的位置</div></div>
    </div>
    <p class="conclusion">同一個數字，位置不同，表示的量也不同。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="8">
    <p class="slide-kicker">今天學到什麼｜重點與應用</p>
    <h2>先定位，再讀數</h2>
    ${placeBoard([1,5,2,4], "summary")}
    <ol class="steps">
      <li>① 先看千位：1 在千位，表示 1000。</li>
      <li>② 依序看百位、十位、個位。</li>
      <li>③ 1524 讀作：一千五百二十四。</li>
    </ol>
  </article>`
];

const placeMeanings = {
  0: digit => `${digit} 在千位，表示 ${digit * 1000}`,
  1: digit => `${digit} 在百位，表示 ${digit * 100}`,
  2: digit => `${digit} 在十位，表示 ${digit * 10}`,
  3: digit => `${digit} 在個位，表示 ${digit}`
};

function setupMoneyRows() {
  document.querySelectorAll("[data-money]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".money-row").forEach(row => row.classList.remove("active"));
      button.closest(".money-row").classList.add("active");
      document.querySelector("#moneyFeedback").textContent = `${button.dataset.money}。不管怎麼換，定位板都是 1、0、0、0。`;
    });
  });
}

function setupBoards() {
  document.querySelectorAll("[data-place-index]").forEach(button => {
    button.addEventListener("click", () => {
      const table = button.closest("table");
      table.querySelectorAll("td").forEach(cell => cell.classList.remove("focused"));
      button.closest("td").classList.add("focused");
      const digit = Number(button.textContent.trim());
      const text = placeMeanings[Number(button.dataset.placeIndex)](digit);
      const feedback = document.querySelector(`#boardFeedback-${button.dataset.boardId}`);
      if (feedback) feedback.textContent = text;
    });
  });
}

function setupReveal() {
  document.querySelectorAll("[data-reveal]").forEach(button => {
    button.addEventListener("click", () => {
      const answer = document.querySelector(`#${button.dataset.reveal}`);
      const isFirst = button.dataset.reveal === "answer1245";
      answer.innerHTML = isFirst
        ? "1 → 1000　2 → 200<br>4 → 40　5 → 5"
        : "百位的 3 → 300<br>個位的 3 → 3";
      answer.classList.remove("waiting");
      button.textContent = "答案已顯示";
      button.disabled = true;
    });
  });
}

function renderProgress() {
  progressDots.innerHTML = slides.map((_, index) => `<button class="progress-dot${visited.has(index) ? " visited" : ""}${index === currentSlide ? " current" : ""}" type="button" data-go="${index}" aria-label="前往第 ${index + 1} 頁"></button>`).join("");
  progressDots.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => goToSlide(Number(button.dataset.go))));
}

function renderSlide() {
  stage.innerHTML = slides[currentSlide]();
  visited.add(currentSlide);
  pageLabel.textContent = `第 ${currentSlide + 1} 頁，共 ${slides.length} 頁｜已看 ${visited.size} 頁`;
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  renderProgress();
  setupMoneyRows();
  setupBoards();
  setupReveal();
}

function goToSlide(index) {
  const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
  if (nextIndex === currentSlide) return;
  currentSlide = nextIndex;
  renderSlide();
}

function changeSlide(amount) {
  goToSlide(currentSlide + amount);
}

previousButton.addEventListener("click", () => changeSlide(-1));
nextButton.addEventListener("click", () => changeSlide(1));
document.querySelector("#resetSlide").addEventListener("click", renderSlide);

document.addEventListener("keydown", event => {
  if (event.target.matches("button")) return;
  if (event.key === "ArrowLeft" || event.key === "PageUp") changeSlide(-1);
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") changeSlide(1);
});

document.querySelector("#speakSlide").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const readable = [...stage.querySelectorAll("h1, h2, h3, p, li, th, td, output")]
    .map(node => node.textContent.trim()).filter(Boolean).join("。 ");
  const utterance = new SpeechSynthesisUtterance(readable);
  utterance.lang = "zh-TW";
  utterance.rate = 0.82;
  speechSynthesis.speak(utterance);
});

document.querySelector("#fullscreen").addEventListener("click", async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
  else await document.exitFullscreen();
});

document.addEventListener("fullscreenchange", () => {
  document.body.classList.toggle("fullscreen-mode", Boolean(document.fullscreenElement));
});

renderSlide();
