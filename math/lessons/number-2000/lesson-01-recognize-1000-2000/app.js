"use strict";

const stage = document.querySelector("#slideStage");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
const pageLabel = document.querySelector("#pageLabel");
const progressFill = document.querySelector("#progressFill");
let currentSlide = 0;
let selectedNumber = null;

function hundredTile(extra = "") {
  return `<button class="hundred-tile ${extra}" type="button" draggable="true" aria-label="1 個百，表示 100"><img src="assets/hundred-flat.png" alt=""><span>100</span></button>`;
}

function hundredGrid(count) {
  return `<div class="hundred-grid" aria-label="${count} 張 100 元">${Array.from({ length: count }, () => '<span aria-hidden="true">100</span>').join("")}</div>`;
}

function numberChoice(value) {
  return `<button class="number-choice" type="button" draggable="true" data-value="${value}">${value}</button>`;
}

const slides = [
  () => `<article class="slide title-slide center" data-slide-number="1">
    <div class="title-visual"><img src="assets/thousand-cube.png" alt="1 個千的積木圖示"><span>1000</span><span>＋</span><span>1000</span></div>
    <p class="slide-kicker">第 1 單元｜2000 以內的數</p>
    <h1>認識 1000 與 2000</h1>
    <p class="subtitle">看圖、動手組合，再找出下一個數</p>
  </article>`,

  () => `<article class="slide center" data-slide-number="2">
    <p class="slide-kicker">今天要學什麼</p>
    <h2>完成 4 個任務</h2>
    <ul class="goal-list">
      <li><span>👀</span>看圖，找出 1000</li>
      <li><span>🧱</span>說出：10 個百是 1000</li>
      <li><span>🔢</span>讀出 2000 以內的數</li>
      <li><span>➡️</span>按順序找下一個數</li>
    </ul>
  </article>`,

  () => `<article class="slide practice-slide" data-slide-number="3">
    <p class="slide-kicker">重點回顧｜從 996 往後數</p>
    <h2>999 的下一個數是什麼？</h2>
    <div class="sequence-row" aria-label="996 到 1000 的數詞序列">
      <div class="sequence-card"><strong>996</strong><span>九百九十六</span></div><i>→</i>
      <div class="sequence-card"><strong>997</strong><span>九百九十七</span></div><i>→</i>
      <div class="sequence-card"><strong>998</strong><span>九百九十八</span></div><i>→</i>
      <div class="sequence-card"><strong>999</strong><span>九百九十九</span></div><i>→</i>
      <button class="drop-number" type="button" data-answer="1000" aria-label="把正確數字放到這裡">？</button>
    </div>
    <div class="number-bank">${numberChoice(100)}${numberChoice(1000)}${numberChoice(1100)}</div>
    <p class="feedback" aria-live="polite">拖拉正確的數字卡到問號；也可以先點數字，再點問號。</p>
  </article>`,

  () => `<article class="slide original-page" data-slide-number="4">
    <img class="original-slide-image" src="assets/original-build-1000.png" alt="原簡報頁面：10 個百格板合起來是 1000，1000 可以用 1 個千立方體表示">
  </article>`,

  () => `<article class="slide build-slide" data-slide-number="5">
    <p class="slide-kicker">動手做｜把 10 個百合起來</p>
    <h2>10 個百是 1000</h2>
    <div class="build-layout">
      <section class="source-panel">
        <h3>百格板</h3>
        ${hundredTile("source-hundred")}
        <p>拖到右邊，或點一下加入。</p>
      </section>
      <section class="build-board" tabindex="0" aria-label="組合區，可放入 10 個百格板">
        <div class="board-grid"></div>
        <p class="board-hint">把百格板放到這裡</p>
      </section>
      <section class="count-panel">
        <p>目前有</p><strong class="hundred-count">0</strong><p>個百</p>
        <div class="equals-result">＝ <span>0</span></div>
      </section>
    </div>
    <div class="build-feedback" aria-live="polite">請加入 10 個百格板。</div>
  </article>`,

  () => `<article class="slide money-slide" data-slide-number="6">
    <p class="slide-kicker">生活應用｜100 元鈔票</p>
    <h2>幾張 100 元，合起來是多少元？</h2>
    <div class="money-grid">
      <section><h3>20 張 100 元</h3>${hundredGrid(20)}<button class="drop-number compact" type="button" data-answer="2000">把答案放這裡</button></section>
      <section><h3>18 張 100 元</h3>${hundredGrid(18)}<button class="drop-number compact" type="button" data-answer="1800">把答案放這裡</button></section>
    </div>
    <div class="number-bank compact-bank">${numberChoice(1800)}${numberChoice(2000)}${numberChoice(2800)}</div>
    <p class="feedback" aria-live="polite">先點選或拖拉答案，再放入正確的位置。</p>
  </article>`,

  () => `<article class="slide zoo-slide" data-slide-number="7">
    <p class="slide-kicker">動物園進場人數｜每次再加 100</p>
    <h2>目前有 1535 人，再進入 100 人</h2>
    <div class="zoo-layout">
      <div class="zoo-sign" role="img" aria-label="動物園看板顯示目前進場人數 1535 人">
        <img class="zoo-board" src="assets/zoo-board.png" alt="">
        <span class="zoo-number">1535</span>
      </div>
      <div class="step-sequence">
        <button class="step-card start" type="button" disabled><strong>1535</strong><span>目前人數</span></button>
        <span class="hundred-step"><img src="assets/hundred-flat.png" alt="1 個百格板，表示 100 人"><b>＋100 人</b><i>→</i></span><button class="step-card reveal-step" type="button" data-value="1635"><strong>？</strong><span>點我顯示</span></button>
        <span class="hundred-step"><img src="assets/hundred-flat.png" alt="1 個百格板，表示 100 人"><b>＋100 人</b><i>→</i></span><button class="step-card reveal-step" type="button" data-value="1735"><strong>？</strong><span>點我顯示</span></button>
        <span class="hundred-step"><img src="assets/hundred-flat.png" alt="1 個百格板，表示 100 人"><b>＋100 人</b><i>→</i></span><button class="step-card reveal-step" type="button" data-value="1835"><strong>？</strong><span>點我顯示</span></button>
      </div>
    </div>
    <p class="feedback zoo-feedback" aria-live="polite">依序點開每一張卡片，觀察百位數的變化。</p>
  </article>`,

  () => `<article class="slide quick-check" data-slide-number="8">
    <p class="slide-kicker">換你試試看</p>
    <h2>看清楚「幾個百」和「加 100」</h2>
    <div class="question-grid">
      <section><div class="ten-hundreds-visual" aria-label="10 個百格板">${Array.from({ length: 10 }, () => '<img src="assets/hundred-flat.png" alt="">').join("")}</div><h3>10 個百是多少？</h3><div class="choice-row"><button data-correct="true">1000</button><button>100</button><button>10</button></div></section>
      <section><div class="question-icon">➕</div><h3>1535 再加 100？</h3><div class="choice-row"><button>1545</button><button data-correct="true">1635</button><button>2535</button></div></section>
    </div>
    <p class="feedback quiz-feedback" aria-live="polite">每題選一個答案。</p>
  </article>`,

  () => `<article class="slide summary-slide center" data-slide-number="9">
    <p class="slide-kicker">今天學到什麼</p>
    <h2>3 個重點</h2>
    <div class="summary-cards">
      <div><span>🧱</span><strong>10 個百是 1000</strong></div>
      <div><span>🔶</span><strong>2 個千是 2000</strong></div>
      <div><span>💵</span><strong>20 張 100 元是 2000 元</strong></div>
    </div>
    <div class="final-equation">1535 ＋ 100 ＝ <strong>1635</strong></div>
  </article>`
];

function setupNumberActivities() {
  selectedNumber = null;
  const feedback = stage.querySelector(".feedback");
  stage.querySelectorAll(".number-choice").forEach(card => {
    card.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", card.dataset.value));
    card.addEventListener("click", () => {
      selectedNumber = card.dataset.value;
      stage.querySelectorAll(".number-choice").forEach(item => item.classList.toggle("selected", item === card));
      if (feedback) feedback.textContent = `已選擇 ${selectedNumber}，請點一下答案位置。`;
    });
  });
  stage.querySelectorAll(".drop-number").forEach(target => {
    const check = value => {
      if (!value) return;
      target.textContent = value;
      target.classList.remove("correct", "wrong");
      const correct = String(value) === target.dataset.answer;
      target.classList.add(correct ? "correct" : "wrong");
      if (feedback) feedback.textContent = correct ? `答對了！答案是 ${value}。` : "再看一次題目，換一張數字卡。";
    };
    target.addEventListener("dragover", event => event.preventDefault());
    target.addEventListener("drop", event => { event.preventDefault(); check(event.dataTransfer.getData("text/plain")); });
    target.addEventListener("click", () => check(selectedNumber));
  });
}

function setupHundredBuilder() {
  const source = stage.querySelector(".source-hundred");
  const board = stage.querySelector(".build-board");
  if (!source || !board) return;
  const grid = board.querySelector(".board-grid");
  const hint = board.querySelector(".board-hint");
  const count = stage.querySelector(".hundred-count");
  const total = stage.querySelector(".equals-result span");
  const feedback = stage.querySelector(".build-feedback");
  let amount = 0;
  const addHundred = () => {
    if (amount >= 10) return;
    amount += 1;
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "placed-hundred";
    tile.innerHTML = `<img src="assets/hundred-flat.png" alt=""><span>100</span>`;
    tile.setAttribute("aria-label", "移除 1 個百");
    tile.addEventListener("click", () => { tile.remove(); amount -= 1; update(); });
    grid.appendChild(tile);
    update();
  };
  const update = () => {
    count.textContent = amount;
    total.textContent = amount * 100;
    hint.hidden = amount > 0;
    if (amount === 10) {
      feedback.innerHTML = `<strong>完成！10 個百合起來是 1000。</strong><img src="assets/thousand-cube.png" alt="1 個千的積木圖示">`;
      board.classList.add("complete");
    } else {
      feedback.textContent = `還差 ${10 - amount} 個百。點一下已放入的百格板可以移除。`;
      board.classList.remove("complete");
    }
  };
  source.addEventListener("click", addHundred);
  source.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", "100"));
  board.addEventListener("dragover", event => event.preventDefault());
  board.addEventListener("drop", event => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === "100") addHundred(); });
}

function setupZooSteps() {
  const steps = [...stage.querySelectorAll(".reveal-step")];
  if (!steps.length) return;
  const feedback = stage.querySelector(".zoo-feedback");
  steps.forEach((step, index) => step.addEventListener("click", () => {
    const earlierDone = steps.slice(0, index).every(item => item.classList.contains("revealed"));
    if (!earlierDone) { feedback.textContent = "請從左到右，依序點開。"; return; }
    step.querySelector("strong").textContent = step.dataset.value;
    step.querySelector("span").textContent = "增加 100 人";
    step.classList.add("revealed");
    feedback.textContent = index === steps.length - 1 ? "完成！每次加 100，百位數增加 1。" : `${step.dataset.value} 再加 100，繼續往右。`;
  }));
}

function setupQuiz() {
  const groups = [...stage.querySelectorAll(".choice-row")];
  if (!groups.length) return;
  const feedback = stage.querySelector(".quiz-feedback");
  groups.forEach(group => group.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    group.querySelectorAll("button").forEach(item => item.classList.remove("correct", "wrong"));
    button.classList.add(button.dataset.correct === "true" ? "correct" : "wrong");
    const solved = groups.filter(item => item.querySelector("button.correct")).length;
    feedback.textContent = button.dataset.correct === "true" ? (solved === groups.length ? "兩題都答對了！" : "答對了，再完成另一題。") : "再想一想：先看單位是百，還是加 100。";
  })));
}

function renderSlide() {
  stage.innerHTML = slides[currentSlide]();
  pageLabel.textContent = `第 ${currentSlide + 1} 頁／共 ${slides.length} 頁`;
  progressFill.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  setupNumberActivities();
  setupHundredBuilder();
  setupZooSteps();
  setupQuiz();
}

function changeSlide(amount) {
  const nextIndex = Math.max(0, Math.min(currentSlide + amount, slides.length - 1));
  if (nextIndex !== currentSlide) { currentSlide = nextIndex; renderSlide(); }
}

previousButton.addEventListener("click", () => changeSlide(-1));
nextButton.addEventListener("click", () => changeSlide(1));
document.querySelector("#resetSlide").addEventListener("click", renderSlide);
document.addEventListener("keydown", event => {
  if (event.target.matches("button, input")) return;
  if (event.key === "ArrowLeft" || event.key === "PageUp") changeSlide(-1);
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") { event.preventDefault(); changeSlide(1); }
});
document.querySelector("#speakSlide").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const text = [...stage.querySelectorAll("h1, h2, h3, p, li, .sequence-card, .summary-cards")].map(node => node.textContent.trim()).filter(Boolean).join("。 ");
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-TW";
  utterance.rate = 0.82;
  speechSynthesis.speak(utterance);
});
document.querySelector("#fullscreen").addEventListener("click", async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
  else await document.exitFullscreen();
});
document.addEventListener("fullscreenchange", () => document.body.classList.toggle("fullscreen-mode", Boolean(document.fullscreenElement)));
renderSlide();
