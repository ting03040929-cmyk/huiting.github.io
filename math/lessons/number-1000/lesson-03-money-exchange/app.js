const stage = document.querySelector("#slideStage");
const pageLabel = document.querySelector("#pageLabel");
const progressFill = document.querySelector("#progressFill");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
let currentSlide = 0;

function note(value, count = 1, compact = false) {
  return `<img class="banknote note-${value}${compact ? " compact" : ""}" src="assets/twd-${value}.png" alt="${value}元紙鈔">`.repeat(count);
}

function coin(value, count = 1, compact = false) {
  return `<img class="coin coin-${value}${compact ? " compact" : ""}" src="assets/twd-${value}.png" alt="${value}元硬幣">`.repeat(count);
}

function checkPanel(id) {
  return `<div class="actions-row"><button class="check-button" type="button" data-check="${id}">檢查答案</button><button class="reveal-button" type="button" data-reveal="${id}">顯示答案</button></div><p class="feedback" id="feedback-${id}" aria-live="polite"></p>`;
}

const slides = [
  () => `<article class="slide center" data-slide-number="1"><div class="money-title">1000</div><p class="slide-kicker">第一學期數學</p><h1>認識錢幣與換錢</h1><p class="subtitle">國中特教班適用版｜網頁互動簡報</p></article>`,

  () => `<article class="slide center" data-slide-number="2"><p class="slide-kicker">今天要學</p><h2>認識 100、500、1000 元</h2><ul class="goal-list"><li><span>1</span>看懂不同面額的紙鈔和硬幣</li><li><span>2</span>把錢換成一樣多的另一種錢</li><li><span>3</span>算出錢幣的總金額</li></ul></article>`,

  () => `<article class="slide compact-title" data-slide-number="3"><p class="slide-kicker">活動 3｜看錢幣，說出總金額</p><h2>三種拿法，都是 1000 元</h2><div class="money-cards"><section class="money-card"><h3>彥辰</h3><div class="money-set">${note(1000)}</div><button class="money-answer" type="button" data-show-total="1000">看總額</button></section><section class="money-card"><h3>子晴</h3><div class="money-set">${note(100,10,true)}</div><button class="money-answer" type="button" data-show-total="1000">看總額</button></section><section class="money-card"><h3>柏宇</h3><div class="money-set">${note(500,2)}</div><button class="money-answer" type="button" data-show-total="1000">看總額</button></section></div><p class="feedback" id="totalFeedback">點「看總額」，再一起說出答案。</p></article>`,

  () => `<article class="slide compact-title" data-slide-number="4"><p class="slide-kicker">活動 3｜看圖，完成換錢</p><h2>換成一樣多的紙鈔</h2><div class="exchange-list"><div class="exchange-row"><div class="exchange-side">1 張 ${note(1000)}</div><span class="exchange-arrow">＝</span><div class="exchange-side"><input class="small-input" inputmode="numeric" maxlength="2" data-answer="10" aria-label="1000元可換幾張100元"> 張 ${note(100)}</div></div><div class="exchange-row"><div class="exchange-side">1 張 ${note(500)}</div><span class="exchange-arrow">＝</span><div class="exchange-side"><input class="small-input" inputmode="numeric" maxlength="1" data-answer="5" aria-label="500元可換幾張100元"> 張 ${note(100)}</div></div><div class="exchange-row"><div class="exchange-side">1 張 ${note(1000)}</div><span class="exchange-arrow">＝</span><div class="exchange-side"><input class="small-input" inputmode="numeric" maxlength="1" data-answer="2" aria-label="1000元可換幾張500元"> 張 ${note(500)}</div></div></div>${checkPanel("s4")}</article>`,

  () => `<article class="slide compact-title" data-slide-number="5"><p class="slide-kicker">活動 3｜看錢幣，選出總金額</p><h2>先看大面額，再加硬幣</h2><div class="question-grid"><section class="money-question"><div class="money-set">${note(500,1,true)}${note(100,1,true)}${coin(50)}${coin(10,3)}${coin(1,2)}</div><div class="choice-bank"><button class="money-choice" data-choice-answer="682">682 元</button><button class="money-choice" data-choice-answer="628">628 元</button><button class="money-choice" data-choice-answer="862">862 元</button></div><p class="feedback" data-choice-feedback>請選一個答案。</p></section><section class="money-question"><div class="money-set">${note(500,1,true)}${note(100,3,true)}${coin(10,3)}${coin(5)}${coin(1,4)}</div><div class="choice-bank"><button class="money-choice" data-choice-answer="839">839 元</button><button class="money-choice" data-choice-answer="893">893 元</button><button class="money-choice" data-choice-answer="938">938 元</button></div><p class="feedback" data-choice-feedback>請選一個答案。</p></section></div></article>`,

  () => `<article class="slide compact-title" data-slide-number="6"><p class="slide-kicker">活動 3｜10 個十元換 1 張百元</p><h2>30 個 10 元可以換幾張 100 元？</h2><div class="exchange-stage"><div class="exchange-box"><div class="coin-cloud" id="piggyCoins">${coin(10,30,true)}</div><strong>30 個 10 元硬幣</strong></div><span class="equals">＝</span><div class="exchange-box" id="piggyResult"><p class="prompt">每 10 個圈成一組。</p><button class="regroup-button" type="button" data-exchange="piggy">開始換錢</button></div></div><p class="feedback" id="exchangeFeedback">10 個 10 元＝1 張 100 元。</p></article>`,

  () => `<article class="slide compact-title" data-slide-number="7"><p class="slide-kicker">活動 3｜紙鈔換硬幣</p><h2>扭蛋機只能投 10 元硬幣</h2><div class="practice-money"><div class="exchange-row"><div class="exchange-side">3 張 ${note(100,1,true)}</div><span class="exchange-arrow">＝</span><div class="exchange-side"><input class="small-input" inputmode="numeric" maxlength="2" data-answer="30" aria-label="3張100元可換幾個10元"> 個 ${coin(10)}</div></div><div class="exchange-row"><div class="exchange-side">1 張 ${note(1000,1,true)}</div><span class="exchange-arrow">＝</span><div class="exchange-side">9 張 ${note(100,1,true)} ＋ <input class="small-input" inputmode="numeric" maxlength="2" data-answer="10" aria-label="還要幾個10元"> 個 ${coin(10)}</div></div></div>${checkPanel("s7")}</article>`,

  () => `<article class="slide center" data-slide-number="8"><div class="divider-icon">💰</div><p class="divider-title">換你做做看</p><h2>先算總額，再完成換錢</h2><p class="subtitle">下一頁有 2 題綜合練習。</p></article>`,

  () => `<article class="slide compact-title" data-slide-number="9"><p class="slide-kicker">做做看｜綜合練習</p><h2>把錢換成一樣多的另一種錢</h2><div class="practice-money"><div class="exchange-row"><div class="exchange-side">40 個 ${coin(10,1,true)}</div><span class="exchange-arrow">＝</span><div class="exchange-side"><input class="small-input" inputmode="numeric" maxlength="1" data-answer="4" aria-label="40個10元可換幾張100元"> 張 ${note(100,1,true)}，共 <input class="small-input" inputmode="numeric" maxlength="3" data-answer="400" aria-label="總金額"> 元</div></div><div class="exchange-row"><div class="exchange-side">1 張 ${note(500,1,true)}</div><span class="exchange-arrow">＝</span><div class="exchange-side"><input class="small-input" inputmode="numeric" maxlength="1" data-answer="4" aria-label="500元換幾張100元"> 張 ${note(100,1,true)} ＋ 10 個 ${coin(10,1,true)}</div></div></div>${checkPanel("s9")}</article>`
];

function articleInputs(button) {
  return [...button.closest("article").querySelectorAll("input[data-answer]")];
}

function setupChecking() {
  document.querySelectorAll("[data-check]").forEach(button => {
    button.addEventListener("click", () => {
      const inputs = articleInputs(button);
      const correct = inputs.length > 0 && inputs.every(input => input.value.trim() === input.dataset.answer);
      const feedback = document.querySelector(`#feedback-${button.dataset.check}`);
      feedback.classList.toggle("wrong", !correct);
      feedback.textContent = correct ? "答對了！換錢前後的總金額一樣。" : "再看一次面額和數量，算完再試試看。";
    });
  });
  document.querySelectorAll("[data-reveal]").forEach(button => {
    button.addEventListener("click", () => {
      articleInputs(button).forEach(input => { input.value = input.dataset.answer; });
      const feedback = document.querySelector(`#feedback-${button.dataset.reveal}`);
      feedback.classList.remove("wrong");
      feedback.textContent = "答案已顯示，請一起說一次換錢的方法。";
    });
  });
}

function setupTotals() {
  document.querySelectorAll("[data-show-total]").forEach(button => {
    button.addEventListener("click", () => {
      button.textContent = `${button.dataset.showTotal} 元`;
      document.querySelector("#totalFeedback").textContent = "三種拿法的總金額都是 1000 元。";
    });
  });
}

function setupChoices() {
  document.querySelectorAll(".money-question").forEach((question, index) => {
    const answer = index === 0 ? "682" : "839";
    question.querySelectorAll("[data-choice-answer]").forEach(button => {
      button.addEventListener("click", () => {
        question.querySelectorAll("[data-choice-answer]").forEach(item => item.classList.remove("correct", "wrong"));
        const correct = button.dataset.choiceAnswer === answer;
        button.classList.add(correct ? "correct" : "wrong");
        const feedback = question.querySelector("[data-choice-feedback]");
        feedback.classList.toggle("wrong", !correct);
        feedback.textContent = correct ? `答對了！總金額是 ${answer} 元。` : "先算紙鈔，再加硬幣。";
      });
    });
  });
}

function setupExchange() {
  document.querySelectorAll("[data-exchange='piggy']").forEach(button => {
    button.addEventListener("click", () => {
      const result = document.querySelector("#piggyResult");
      result.innerHTML = `<div class="money-set">${note(100,3)}</div><strong>3 張 100 元＝300 元</strong>`;
      document.querySelector("#exchangeFeedback").textContent = "30 個 10 元分成 3 組，每組可以換 1 張 100 元。";
    });
  });
}

function renderSlide() {
  stage.innerHTML = slides[currentSlide]();
  pageLabel.textContent = `第 ${currentSlide + 1} 頁／共 ${slides.length} 頁`;
  progressFill.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  setupChecking();
  setupTotals();
  setupChoices();
  setupExchange();
}

function changeSlide(amount) {
  const nextIndex = Math.max(0, Math.min(currentSlide + amount, slides.length - 1));
  if (nextIndex === currentSlide) return;
  currentSlide = nextIndex;
  renderSlide();
}

previousButton.addEventListener("click", () => changeSlide(-1));
nextButton.addEventListener("click", () => changeSlide(1));
document.querySelector("#resetSlide").addEventListener("click", renderSlide);
document.addEventListener("keydown", event => {
  if (event.target.matches("input, button")) return;
  if (event.key === "ArrowLeft" || event.key === "PageUp") changeSlide(-1);
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") changeSlide(1);
});
document.querySelector("#speakSlide").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const readable = [...stage.querySelectorAll("h1, h2, h3, .prompt, .subtitle, .exchange-side")].map(node => node.textContent.trim()).filter(Boolean).join("。 ");
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
