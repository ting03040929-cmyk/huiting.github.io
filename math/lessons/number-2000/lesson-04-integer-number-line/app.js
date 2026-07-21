const stage = document.querySelector("#slideStage");
const pageLabel = document.querySelector("#pageLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const progressDots = document.querySelector("#progressDots");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");

const storageKey = "webdeck-integer-number-line-v1";
let currentSlide = 0;
let visited = new Set([0]);
let completed = new Set();

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved?.visited) visited = new Set(saved.visited);
  if (saved?.completed) completed = new Set(saved.completed);
} catch (_) {}

function numberLine(values, options = {}) {
  const shown = options.shown ?? values.map(() => true);
  const highlight = new Set(options.highlight ?? []);
  const focus = new Set(options.focus ?? []);
  const answerInputs = options.inputs ?? false;
  return `<div class="number-line" style="--tick-count:${values.length}" aria-label="數線">
    <div class="line-arrow" aria-hidden="true"></div>
    ${values.map((value, index) => `<div class="tick-wrap${highlight.has(value) ? " highlighted" : ""}${focus.has(value) ? " focus-tick" : ""}" style="--tick-position:${values.length === 1 ? 50 : 3 + index / (values.length - 1) * 94}%">
      <span class="tick" aria-hidden="true"></span>
      ${answerInputs && !shown[index]
        ? `<input class="tick-input" inputmode="numeric" maxlength="2" data-line-input data-answer="${value}" aria-label="第 ${index + 1} 個刻度應填的數字">`
        : `<span class="tick-label${shown[index] ? "" : " concealed"}" data-hidden-value="${value}">${shown[index] ? value : "？"}</span>`}
    </div>`).join("")}
  </div>`;
}

function flow(steps) {
  return `<div class="step-flow" aria-label="解題步驟">${steps.map((step, index) => `<div class="flow-step"><span>${index + 1}</span><strong>${step}</strong></div>${index < steps.length - 1 ? '<b aria-hidden="true">→</b>' : ""}`).join("")}</div>`;
}

function frogScene(start, end, direction) {
  const position = value => 3 + value / 15 * 94;
  const from = position(start);
  const to = position(end);
  const min = Math.min(from, to);
  const width = Math.abs(to - from);
  const jumpCount = Math.abs(end - start);
  return `<div class="frog-scene" data-frog-scene data-start="${start}" data-end="${end}" style="--frog-position:${from}%;--jump-left:${min}%;--jump-width:${width}%">
    <div class="jump-guide" aria-hidden="true"><span>${direction === "right" ? "+" : "−"}${jumpCount} 格</span></div>
    <div class="frog" aria-label="青蛙從 ${start} 逐格移動到 ${end}">🐸</div>
    ${numberLine(Array.from({length:16}, (_, index) => index), {highlight:[start,end]})}
  </div>`;
}

const slides = [
  () => `<article class="slide cover center" data-slide-number="1">
    <div class="cover-mark" aria-hidden="true">線</div>
    <p class="unit-label">第 1 單元｜2000 以內的數</p>
    <h1>整數數線</h1>
    <p class="subtitle">看起點、看每一格，再找到數字的位置</p>
  </article>`,

  () => `<article class="slide" data-slide-number="2">
    <p class="slide-kicker">今天要學什麼</p>
    <h2>完成 4 個任務</h2>
    <ul class="goal-list">
      <li><span>1</span>找到數線的起點。</li>
      <li><span>2</span>看清楚每一格增加多少。</li>
      <li><span>3</span>找出指定數的位置。</li>
      <li><span>4</span>知道右邊的數比較大。</li>
    </ul>
  </article>`,

  () => `<article class="slide" data-slide-number="3">
    <p class="slide-kicker">生活中的刻度｜游泳池</p>
    <h2 class="question-title">游泳池旁的刻度表示什麼？</h2>
    <div class="pool-layout">
      <div class="pool-picture" aria-label="游泳池深度刻度 20、30、40、50 公分">
        <div class="pool-water"></div><div class="pool-ladder"></div>
        ${[20,30,40,50].map((value,index) => `<span class="pool-mark" style="bottom:${12 + index * 18}%">${value} cm</span>`).join("")}
      </div>
      <div class="answer-panel">
        <button class="action-button" type="button" data-reveal="pool-answer">顯示說明</button>
        <p id="pool-answer" class="big-answer" hidden>刻度表示水的深淺。</p>
      </div>
    </div>
  </article>`,

  () => `<article class="slide" data-slide-number="4">
    <p class="slide-kicker">認識數線｜從尺開始</p>
    <h2>直線、等距刻度、數字和箭頭</h2>
    <div class="ruler" aria-label="0 到 12 公分的尺">${Array.from({length:13},(_,i)=>`<span>${i}</span>`).join("")}</div>
    ${numberLine(Array.from({length:13},(_,i)=>i))}
    <div class="definition-box"><strong>數線</strong><p>在直線上畫一樣長的刻度，標上數字，右邊加上箭頭。</p></div>
  </article>`,

  () => `<article class="slide" data-slide-number="5">
    <p class="slide-kicker">第一層：辨認｜填入缺少的數字</p>
    <h2 class="question-title">空格裡應該填哪一個數？</h2>
    ${numberLine(Array.from({length:16},(_,i)=>i), {shown:Array.from({length:16},(_,i)=>![6,7,8,10,15].includes(i)), inputs:true})}
    ${flow(["找到 0", "每格加 1", "依序填數字"])}
    <div class="step-panel"><button class="action-button" type="button" data-check-line>檢查答案</button></div>
    <p id="line-input-feedback" class="feedback" role="status">請填入 6、7、8、10、15 的位置。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="6">
    <p class="slide-kicker">第二層：理解｜判斷左邊或右邊</p>
    <h2 class="question-title">數線上的數在哪一邊？</h2>
    ${numberLine(Array.from({length:16},(_,i)=>i), {highlight:[9,14], focus:[11]})}
    <div class="position-questions">
      <div class="position-card"><p><strong>14</strong> 比 11 大，在 11 的哪一邊？</p><div><button data-side-choice="right" data-answer="right">右邊</button><button data-side-choice="left" data-answer="right">左邊</button></div></div>
      <div class="position-card"><p><strong>9</strong> 比 11 小，在 11 的哪一邊？</p><div><button data-side-choice="left" data-answer="left">左邊</button><button data-side-choice="right" data-answer="left">右邊</button></div></div>
    </div>
    <p id="side-feedback" class="feedback" role="status">先找到 11，再看 9 和 14 的位置。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="7">
    <p class="slide-kicker">重要規則｜左右和大小</p>
    <h2>越往右，數越大</h2>
    <div class="direction-rule">
      <div class="left-rule"><span>←</span><strong>越左邊</strong><b>數越小</b></div>
      <div class="right-rule"><strong>越右邊</strong><b>數越大</b><span>→</span></div>
    </div>
    ${numberLine(Array.from({length:16},(_,i)=>i), {highlight:[3,12]})}
    <p class="memory-tip">先找兩個數的位置，再看誰在右邊。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="8">
    <p class="slide-kicker">數線不一定每格加 1</p>
    <h2 class="question-title">這條數線每一格增加多少？</h2>
    ${numberLine([0,2,4,6,8,10,12,14,16,18,20], {shown:[true,true,true,true,true,true,true,false,false,true,true]})}
    ${flow(["先看 10", "下一格是 12", "12 − 10 ＝ 2"])}
    <div class="step-panel"><button class="action-button" type="button" data-reveal-line data-task="line-two">顯示缺少的數字</button></div>
    <p class="feedback">每一格加 <strong>2</strong>。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="9">
    <p class="slide-kicker">換一條數線｜每格加 5</p>
    <h2 class="question-title">空格裡應該填哪一個數？</h2>
    ${numberLine([0,5,10,15,20,25,30,35,40,45,50], {shown:[true,true,true,true,true,false,true,false,true,false,true]})}
    ${flow(["先看 20", "下一格是 25", "每格加 5"])}
    <div class="step-panel"><button class="action-button" type="button" data-reveal-line data-task="line-five">顯示答案</button></div>
    <p class="feedback">20、25、30……每次增加 5。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="10">
    <p class="slide-kicker">再換一條數線｜每格加 10</p>
    <h2 class="question-title">空格裡應該填哪一個數？</h2>
    ${numberLine([0,10,20,30,40,50,60,70,80,90,100], {shown:[true,true,true,true,true,false,true,true,false,true,true]})}
    ${flow(["先看 40", "下一格是 50", "每格加 10"])}
    <div class="step-panel"><button class="action-button" type="button" data-reveal-line data-task="line-ten">顯示答案</button></div>
    <p class="feedback">40、50、60……每次增加 10。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="11">
    <p class="slide-kicker">整理重點｜先找每格增加多少</p>
    <h2>一格不一定表示 1</h2>
    <div class="scale-summary">
      <div><span>每格</span><strong>＋2</strong><p>10、12、14……</p></div>
      <div><span>每格</span><strong>＋5</strong><p>20、25、30……</p></div>
      <div><span>每格</span><strong>＋10</strong><p>40、50、60……</p></div>
    </div>
    ${flow(["看兩個相鄰數", "用後面減前面", "得到每格增加量"])}
  </article>`,

  () => `<article class="slide" data-slide-number="12">
    <p class="slide-kicker">第三層：應用｜青蛙向右跳</p>
    <h2 class="question-title">青蛙從 8 向右跳 6 格，停在哪裡？</h2>
    ${frogScene(8,14,"right")}
    ${flow(["起點是 8", "向右跳 6 格", "停在 14"])}
    <div class="step-panel"><button class="action-button" type="button" data-move-frog data-task="frog-right">讓青蛙跳一跳</button></div>
    <p id="frog-feedback" class="feedback" role="status">向右跳，數字會增加。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="13">
    <p class="slide-kicker">完整示範｜把跳格寫成算式</p>
    <h2>向右跳，用加法</h2>
    <div class="equation-story">
      <div><span>起點</span><strong>8</strong></div><b>＋</b><div><span>向右 6 格</span><strong>6</strong></div><b>＝</b><div class="result"><span>停的位置</span><strong>14</strong></div>
    </div>
    ${numberLine(Array.from({length:15},(_,i)=>i), {highlight:[8,14]})}
    <p class="memory-tip">8 ＋ 6 ＝ 14，答：停在 14。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="14">
    <p class="slide-kicker">生活應用｜青蛙再向左跳</p>
    <h2 class="question-title">青蛙從 14 向左跳 5 格，停在哪裡？</h2>
    ${frogScene(14,9,"left")}
    ${flow(["起點是 14", "向左跳 5 格", "停在 9"])}
    <div class="step-panel"><button class="action-button" type="button" data-move-frog data-task="frog-left">讓青蛙跳一跳</button></div>
    <p id="frog-feedback" class="feedback" role="status">向左跳，數字會減少。</p>
    <div class="equation-answer">14 − 5 ＝ <strong>9</strong></div>
  </article>`,

  () => `<article class="slide" data-slide-number="15">
    <p class="slide-kicker">今天學到什麼</p>
    <h2>整數數線的固定步驟</h2>
    <ol class="summary-steps">
      <li><span>1</span><strong>先看起點。</strong></li>
      <li><span>2</span><strong>再看每一格增加多少。</strong></li>
      <li><span>3</span><strong>向右是加，向左是減。</strong></li>
      <li><span>4</span><strong>越右邊的數越大。</strong></li>
    </ol>
    <p class="memory-tip">數線可以表示樓層、距離、水深和數量變化。</p>
  </article>`
];

function saveProgress() {
  try { localStorage.setItem(storageKey, JSON.stringify({visited:[...visited], completed:[...completed]})); } catch (_) {}
}

function markCompleted(task) {
  if (!task) return;
  completed.add(task);
  saveProgress();
  renderStatus();
}

function setupInteractions() {
  document.querySelectorAll("[data-reveal]").forEach(button => button.addEventListener("click", () => {
    document.querySelector(`#${button.dataset.reveal}`).hidden = false;
    button.disabled = true;
    button.textContent = "說明已顯示";
    markCompleted(button.dataset.reveal);
  }));

  document.querySelector("[data-check-line]")?.addEventListener("click", event => {
    const inputs = [...document.querySelectorAll("[data-line-input]")];
    const feedback = document.querySelector("#line-input-feedback");
    const correct = inputs.every(input => input.value.trim() === input.dataset.answer);
    inputs.forEach(input => input.classList.toggle("wrong", input.value.trim() !== input.dataset.answer));
    if (correct) {
      feedback.textContent = "答對了！每一格依序增加 1。";
      feedback.className = "feedback correct";
      inputs.forEach(input => input.disabled = true);
      event.currentTarget.disabled = true;
      markCompleted("line-inputs");
    } else {
      feedback.textContent = "再從 0 開始，一格一格加 1。";
      feedback.className = "feedback try-again";
    }
  });

  document.querySelectorAll("[data-side-choice]").forEach(button => button.addEventListener("click", () => {
    const card = button.closest(".position-card");
    card.querySelectorAll("button").forEach(item => item.classList.remove("correct", "wrong"));
    if (button.dataset.sideChoice === button.dataset.answer) {
      button.classList.add("correct");
      card.dataset.done = "true";
      card.querySelectorAll("button").forEach(item => item.disabled = true);
      document.querySelector("#side-feedback").textContent = "答對了。右邊的數比較大，左邊的數比較小。";
      if ([...document.querySelectorAll(".position-card")].every(item => item.dataset.done === "true")) markCompleted("side-choices");
    } else {
      button.classList.add("wrong");
      document.querySelector("#side-feedback").textContent = "先找到 11，再看另一個數在左邊或右邊。";
    }
  }));

  document.querySelectorAll("[data-reveal-line]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".tick-label.concealed").forEach(label => {
      label.textContent = label.dataset.hiddenValue;
      label.classList.remove("concealed");
      label.classList.add("revealed");
    });
    button.disabled = true;
    button.textContent = "答案已顯示";
    markCompleted(button.dataset.task);
  }));

  document.querySelector("[data-move-frog]")?.addEventListener("click", event => {
    const button = event.currentTarget;
    const scene = document.querySelector("[data-frog-scene]");
    const frog = scene?.querySelector(".frog");
    const feedback = document.querySelector("#frog-feedback");
    if (!scene || !frog || !feedback) return;

    const start = Number(scene.dataset.start);
    const end = Number(scene.dataset.end);
    const direction = Math.sign(end - start);
    const total = Math.abs(end - start);
    const position = value => 3 + value / 15 * 94;
    let current = start;
    let timer;

    button.disabled = true;
    feedback.className = "feedback";

    const hopOneSpace = () => {
      current += direction;
      const step = Math.abs(current - start);
      frog.classList.remove("hopping");
      void frog.offsetWidth;
      frog.style.left = `${position(current)}%`;
      frog.classList.add("hopping");
      feedback.textContent = `第 ${step} 格：青蛙跳到 ${current}。`;
      button.textContent = `正在跳第 ${step}／${total} 格`;

      if (current === end) {
        clearInterval(timer);
        feedback.textContent = `${start} ${direction > 0 ? "向右" : "向左"}跳 ${total} 格，停在 ${end}。`;
        feedback.className = "feedback correct";
        button.textContent = `逐格跳完 ${total} 格`;
        markCompleted(button.dataset.task);
      }
    };

    hopOneSpace();
    timer = setInterval(hopOneSpace, 650);
  });
}

function renderStatus() {
  pageLabel.textContent = `第 ${currentSlide + 1} 頁，共 ${slides.length} 頁｜已看 ${visited.size} 頁`;
  scoreLabel.textContent = `已完成 ${completed.size} 個任務`;
}

function renderProgress() {
  progressDots.innerHTML = slides.map((_, index) => `<button class="progress-dot${visited.has(index) ? " visited" : ""}${index === currentSlide ? " current" : ""}" type="button" data-go="${index}" aria-label="前往第 ${index + 1} 頁"></button>`).join("");
  progressDots.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => goToSlide(Number(button.dataset.go))));
}

function renderSlide() {
  stage.innerHTML = slides[currentSlide]();
  visited.add(currentSlide);
  saveProgress();
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  renderStatus();
  renderProgress();
  setupInteractions();
}

function goToSlide(index) {
  const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
  if (nextIndex === currentSlide) return;
  currentSlide = nextIndex;
  renderSlide();
}

previousButton.addEventListener("click", () => goToSlide(currentSlide - 1));
nextButton.addEventListener("click", () => goToSlide(currentSlide + 1));
document.querySelector("#resetSlide").addEventListener("click", renderSlide);

document.addEventListener("keydown", event => {
  if (event.target.matches("input, button")) return;
  if (event.key === "ArrowLeft" || event.key === "PageUp") goToSlide(currentSlide - 1);
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") goToSlide(currentSlide + 1);
});

document.querySelector("#speakSlide").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const readable = [...stage.querySelectorAll("h1, h2, h3, p, li, button, .tick-label")].map(node => node.textContent.trim()).filter(Boolean).join("。 ");
  const utterance = new SpeechSynthesisUtterance(readable);
  utterance.lang = "zh-TW";
  utterance.rate = .82;
  speechSynthesis.speak(utterance);
});

document.querySelector("#fullscreen").addEventListener("click", async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
  else await document.exitFullscreen();
});

document.addEventListener("fullscreenchange", () => document.body.classList.toggle("fullscreen-mode", Boolean(document.fullscreenElement)));

renderSlide();
