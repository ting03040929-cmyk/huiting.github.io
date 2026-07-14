const stage = document.querySelector("#slideStage");
const pageLabel = document.querySelector("#pageLabel");
const progressFill = document.querySelector("#progressFill");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
let currentSlide = 0;

const money = {
  note(value, count = 1) {
    return `<img class="banknote note-${value}" src="assets/twd-${value}.png" alt="${value} 元紙鈔">`.repeat(count);
  },
  coin(value, count = 1) {
    return `<img class="coin coin-${value}" src="assets/twd-${value}.png" alt="${value} 元硬幣">`.repeat(count);
  }
};

function moneySet(values) {
  return [
    money.note(500, values[500] || 0),
    money.note(100, values[100] || 0),
    money.coin(50, values[50] || 0),
    money.coin(10, values[10] || 0),
    money.coin(5, values[5] || 0),
    money.coin(1, values[1] || 0)
  ].join("");
}

function choiceQuestion(id, values, choices, answer) {
  return `<section class="money-question" data-choice-group="${id}" data-answer="${answer}">
    <div class="money-picture">${moneySet(values)}</div>
    <div class="choice-bank">${choices.map(value => `<button class="money-choice" type="button" data-choice="${value}">${value} 元</button>`).join("")}</div>
    <p class="feedback" aria-live="polite">請選一個答案。</p>
  </section>`;
}

function payBuilder(id, target, image, imageAlt, answer) {
  const values = [500, 100, 50, 10, 5, 1];
  return `<div class="pay-layout">
    <section class="product-card"><img src="${image}" alt="${imageAlt}"><div class="price-tag">${target} 元</div></section>
    <section class="pay-builder" data-builder="${id}" data-target="${target}" data-answer='${JSON.stringify(answer)}'>
      <h3>點「＋」選出要付的錢</h3>
      <div class="denomination-grid">${values.map(value => `<div class="denomination"><strong>${value} 元</strong><div class="counter"><button type="button" data-step="-1" data-value="${value}" aria-label="減少一個 ${value} 元">−</button><output data-count="${value}">0</output><button type="button" data-step="1" data-value="${value}" aria-label="增加一個 ${value} 元">＋</button></div></div>`).join("")}</div>
      <div class="total-line">現在共付 <span class="live-total">0 元</span></div>
      <div class="actions-row"><button class="check-button" type="button" data-check-builder>檢查答案</button><button class="reveal-button" type="button" data-reveal-builder>顯示答案</button></div>
      <p class="feedback" aria-live="polite"></p>
    </section>
  </div>`;
}

function exactQuestion(id, target, image, imageAlt, options, correctIndex, breakdown) {
  return `<div class="exact-layout">
    <section class="scene-card"><img src="${image}" alt="${imageAlt}"><div class="price-tag">${target} 元</div></section>
    <section class="exact-panel" data-exact="${id}" data-correct="${correctIndex}">
      <h3>哪一種付法剛剛好？</h3>
      <div class="exact-options">${options.map((text, index) => `<button class="exact-option" type="button" data-option="${index}">${text}</button>`).join("")}</div>
      <div class="answer-breakdown" hidden>${breakdown}</div>
      <p class="feedback" aria-live="polite">請選一種付法。</p>
    </section>
  </div>`;
}

const slides = [
  () => `<article class="slide center" data-slide-number="1"><div class="money-title">剛好</div><p class="slide-kicker">1000 以內的數</p><h1>數錢與剛好付錢</h1><p class="subtitle">國中特教班適用版</p></article>`,

  () => `<article class="slide center" data-slide-number="2"><p class="slide-kicker">今天要學</p><h2>看價格，選出要付的錢</h2><ul class="goal-list"><li><span>1</span>看錢幣，數出總金額</li><li><span>2</span>依照價格，選出要付的錢</li><li><span>3</span>確認付的錢剛剛好</li></ul></article>`,

  () => `<article class="slide" data-slide-number="3"><p class="slide-kicker">活動 3｜看錢幣</p><h2>看錢幣，選出總金額</h2><div class="question-grid">${choiceQuestion("s3a", {500:1,100:1,50:1,10:3,1:2}, [682,628,862], 682)}${choiceQuestion("s3b", {500:1,100:3,10:3,5:1,1:4}, [839,893,938], 839)}</div></article>`,

  () => `<article class="slide" data-slide-number="4"><p class="slide-kicker">活動 4｜先付錢，再填數量</p><h2>這件衣服是 630 元，要怎麼付？</h2>${payBuilder("s4", 630, "assets/shirt.png", "藍色衣服", {500:1,100:1,50:0,10:3,5:0,1:0})}</article>`,

  () => `<article class="slide" data-slide-number="5"><p class="slide-kicker">活動 4｜先付錢，再填數量</p><h2>這雙鞋子是 799 元，要怎麼付？</h2>${payBuilder("s5", 799, "assets/shoes.png", "綠色鞋子", {500:1,100:2,50:1,10:4,5:1,1:4})}</article>`,

  () => `<article class="slide" data-slide-number="6"><p class="slide-kicker">活動 5｜剛好的付法</p><h2>門票 428 元，圈出剛好的付法</h2>${exactQuestion("s6", 428, "assets/ticket-booth.png", "售票亭", ["4 張 100 元、2 個 10 元、8 個 1 元", "4 張 100 元、8 個 10 元、2 個 1 元", "3 張 100 元、2 個 10 元、8 個 1 元"], 0, `${money.note(100,4)}${money.coin(10,2)}${money.coin(1,8)}<span>＝ 428 元</span>`)}</article>`,

  () => `<article class="slide" data-slide-number="7"><p class="slide-kicker">活動 5｜剛好的付法</p><h2>爆米花 298 元，圈出剛好的付法</h2>${exactQuestion("s7", 298, "assets/popcorn.png", "爆米花攤", ["2 張 100 元、8 個 10 元、9 個 1 元", "2 張 100 元、9 個 10 元、8 個 1 元", "3 張 100 元、9 個 10 元、8 個 1 元"], 1, `${money.note(100,2)}${money.coin(10,9)}${money.coin(1,8)}<span>＝ 298 元</span>`)}</article>`,

  () => `<article class="slide center" data-slide-number="8"><div class="divider-icon">✋</div><p class="divider-title">換你做做看</p><h2>先慢慢數，再選答案</h2><p class="subtitle">你可以按「重新作答」再練習一次。</p></article>`,

  () => `<article class="slide" data-slide-number="9"><p class="slide-kicker">練習｜數一數</p><h2>看錢幣，各是多少元？</h2><div class="question-grid">${choiceQuestion("s9a", {500:1,100:2,10:8,1:4}, [748,784,874], 784)}${choiceQuestion("s9b", {100:6,10:2,1:5}, [652,625,265], 625)}</div></article>`,

  () => `<article class="slide" data-slide-number="10"><p class="slide-kicker">練習｜剛好付錢</p><h2>一本字典 435 元，要怎麼付錢才會剛好？</h2>${exactQuestion("s10", 435, "assets/dictionary.png", "一本字典", ["4 張 100 元、5 個 10 元、3 個 1 元", "3 張 100 元、4 個 10 元、5 個 1 元", "4 張 100 元、3 個 10 元、5 個 1 元"], 2, `${money.note(100,4)}${money.coin(10,3)}${money.coin(1,5)}<span>＝ 435 元</span>`)}</article>`
];

function setupChoices() {
  stage.querySelectorAll("[data-choice-group]").forEach(group => {
    const answer = Number(group.dataset.answer);
    group.querySelectorAll("[data-choice]").forEach(button => {
      button.addEventListener("click", () => {
        group.querySelectorAll("[data-choice]").forEach(item => item.classList.remove("correct", "wrong"));
        const correct = Number(button.dataset.choice) === answer;
        button.classList.add(correct ? "correct" : "wrong");
        const feedback = group.querySelector(".feedback");
        feedback.classList.toggle("wrong", !correct);
        feedback.textContent = correct ? `答對了！總共是 ${answer} 元。` : "再數一次：先數紙鈔，再數硬幣。";
      });
    });
  });
}

function builderCounts(builder) {
  return Object.fromEntries([...builder.querySelectorAll("[data-count]")].map(output => [output.dataset.count, Number(output.value || output.textContent)]));
}

function updateBuilder(builder) {
  const counts = builderCounts(builder);
  const total = Object.entries(counts).reduce((sum, [value, count]) => sum + Number(value) * count, 0);
  builder.querySelector(".live-total").textContent = `${total} 元`;
  return {counts, total};
}

function setBuilderAnswer(builder) {
  const answer = JSON.parse(builder.dataset.answer);
  builder.querySelectorAll("[data-count]").forEach(output => { output.textContent = answer[output.dataset.count] || 0; });
  updateBuilder(builder);
}

function setupBuilders() {
  stage.querySelectorAll("[data-builder]").forEach(builder => {
    builder.querySelectorAll("[data-step]").forEach(button => {
      button.addEventListener("click", () => {
        const output = builder.querySelector(`[data-count="${button.dataset.value}"]`);
        output.textContent = Math.max(0, Math.min(12, Number(output.textContent) + Number(button.dataset.step)));
        updateBuilder(builder);
      });
    });
    builder.querySelector("[data-check-builder]").addEventListener("click", () => {
      const {counts, total} = updateBuilder(builder);
      const answer = JSON.parse(builder.dataset.answer);
      const exactCounts = Object.keys(answer).every(value => counts[value] === answer[value]);
      const correct = total === Number(builder.dataset.target) && exactCounts;
      const feedback = builder.querySelector(".feedback");
      feedback.classList.toggle("wrong", !correct);
      feedback.textContent = correct ? "答對了！付的錢剛剛好。" : total === Number(builder.dataset.target) ? "總金額正確，再看看題目指定的錢幣數量。" : `現在是 ${total} 元，還不是 ${builder.dataset.target} 元。`;
    });
    builder.querySelector("[data-reveal-builder]").addEventListener("click", () => {
      setBuilderAnswer(builder);
      const feedback = builder.querySelector(".feedback");
      feedback.classList.remove("wrong");
      feedback.textContent = "答案已顯示，請跟著念一次每種錢幣的數量。";
    });
  });
}

function setupExactQuestions() {
  stage.querySelectorAll("[data-exact]").forEach(panel => {
    panel.querySelectorAll("[data-option]").forEach(button => {
      button.addEventListener("click", () => {
        panel.querySelectorAll("[data-option]").forEach(item => item.classList.remove("correct", "wrong"));
        const correct = button.dataset.option === panel.dataset.correct;
        button.classList.add(correct ? "correct" : "wrong");
        panel.querySelector(".answer-breakdown").hidden = !correct;
        const feedback = panel.querySelector(".feedback");
        feedback.classList.toggle("wrong", !correct);
        feedback.textContent = correct ? "答對了！這樣付剛剛好。" : "再看一次百位、十位和個位。";
      });
    });
  });
}

function renderSlide() {
  stage.innerHTML = slides[currentSlide]();
  pageLabel.textContent = `第 ${currentSlide + 1} 頁，共 ${slides.length} 頁`;
  progressFill.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  setupChoices();
  setupBuilders();
  setupExactQuestions();
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
  const readable = [...stage.querySelectorAll("h1, h2, h3, .slide-kicker, .subtitle, .price-tag, .exact-option, .denomination strong")].map(node => node.textContent.trim()).filter(Boolean).join("。 ");
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
