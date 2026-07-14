const stage = document.querySelector("#slideStage");
const pageLabel = document.querySelector("#pageLabel");
const progressFill = document.querySelector("#progressFill");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
let currentSlide = 0;

function symbolChoices(answer, group) {
  return `<div class="choice-row" data-symbol-group="${group}" data-answer="${answer}">
    ${["＞","＜","＝"].map(symbol => `<button class="symbol-button" type="button" data-symbol="${symbol}">${symbol}</button>`).join("")}
  </div>`;
}

function reviewItem(id, left, right, answer) {
  return `<section class="review-item" data-review="${id}" data-answer="${answer}">
    <div class="review-pair"><span>${left}</span><span class="symbol-slot answer-box" aria-label="待填比較符號">&nbsp;</span><span>${right}</span></div>
    <div class="choice-row">${["＞","＜","＝"].map(symbol => `<button class="symbol-button" type="button" data-review-symbol="${symbol}">${symbol}</button>`).join("")}</div>
    <p class="feedback" aria-live="polite">請選一個符號。</p>
  </section>`;
}

const slides = [
  () => `<article class="slide center" data-slide-number="1"><div class="compare-title">＞＜</div><p class="slide-kicker">1000 以內的數</p><h1>數字比大小</h1><p class="subtitle">國中特教班適用版</p></article>`,

  () => `<article class="slide center" data-slide-number="2"><p class="slide-kicker">今天要學</p><h2>先比百位，再比十位、個位</h2><ul class="goal-list"><li><span>1</span>先看兩個數的百位</li><li><span>2</span>百位一樣，再比較十位</li><li><span>3</span>用 ＞、＜ 或 ＝ 記錄結果</li></ul></article>`,

  () => `<article class="slide" data-slide-number="3"><p class="slide-kicker">活動 4｜生活中的比較</p><h2>午餐 495 元、晚餐 603 元，哪一餐比較多？</h2><div class="story-layout"><section class="story-note"><img src="assets/yilan-record.png" alt="宜蘭之旅消費紀錄：午餐495元、晚餐603元"></section><section class="comparison-panel" data-choice-question data-answer="晚餐"><div class="number-pair"><span class="big-number">495</span><span class="symbol-slot">＜</span><span class="big-number">603</span></div><div class="place-hint"><strong>先比百位</strong>6 個百比 4 個百多</div><div class="choice-row"><button class="choice-button" type="button" data-choice="午餐">午餐比較多</button><button class="choice-button" type="button" data-choice="晚餐">晚餐比較多</button></div><p class="feedback" aria-live="polite">請選一個答案。</p></section></div></article>`,

  () => `<article class="slide" data-slide-number="4"><p class="slide-kicker">活動 4｜百位相同，再比十位</p><h2>571 和 526，哪一個數比較大？</h2><table class="place-table" aria-label="571和526位值比較"><thead><tr><th>數字</th><th>百位</th><th>十位</th><th>個位</th></tr></thead><tbody><tr><td>571</td><td>5</td><td class="compare-cell">7</td><td>1</td></tr><tr><td>526</td><td>5</td><td class="compare-cell">2</td><td>6</td></tr></tbody></table><div class="comparison-result"><span>571</span><span class="symbol-slot answer-box" id="s4Symbol" aria-label="待填比較符號">&nbsp;</span><span>526</span></div>${symbolChoices("＞","s4")}<p class="feedback" id="s4Feedback" aria-live="polite">百位都是 5，再比較十位。</p></article>`,

  () => `<article class="slide" data-slide-number="5"><p class="slide-kicker">活動 4｜數字卡排三位數</p><h2>用 3 張卡，排出比較小的三位數</h2><div class="card-activity"><section class="card-visual"><img src="assets/number-cards.png" alt="學生使用數字卡排三位數"></section><section class="arrange-panel"><div class="digit-group" data-card-question data-answer="245"><div class="digit-cards"><span class="digit-card">4</span><span class="digit-card">5</span><span class="digit-card">2</span></div><div class="answer-options"><button data-card-answer="452">452</button><button data-card-answer="245">245</button><button data-card-answer="524">524</button></div></div><div class="digit-group" data-card-question data-answer="307"><div class="digit-cards"><span class="digit-card">3</span><span class="digit-card">7</span><span class="digit-card">0</span></div><div class="answer-options"><button data-card-answer="037">037</button><button data-card-answer="370">370</button><button data-card-answer="307">307</button></div></div><div class="rule-box">0 不可以放在三位數的百位。先放最小的非 0 數字，再放 0。</div><p class="feedback" aria-live="polite">兩組都完成後，比較：245 ＜ 307。</p></section></div></article>`,

  () => `<article class="slide" data-slide-number="6"><p class="slide-kicker">活動 4｜最大數與最小數</p><h2>用 0、3、1、5、7 排出指定的三位數</h2><div class="largest-smallest"><div class="five-cards"><span class="digit-card">0</span><span class="digit-card">3</span><span class="digit-card">1</span><span class="digit-card">5</span><span class="digit-card">7</span></div><div class="challenge-grid"><section class="challenge-card" data-challenge data-answer="753"><strong>最大的三位數</strong><div class="challenge-options"><button data-challenge-answer="735">735</button><button data-challenge-answer="753">753</button><button data-challenge-answer="573">573</button></div></section><section class="challenge-card" data-challenge data-answer="103"><strong>最小的三位數</strong><div class="challenge-options"><button data-challenge-answer="013">013</button><button data-challenge-answer="130">130</button><button data-challenge-answer="103">103</button></div></section></div><p class="feedback" id="challengeFeedback" aria-live="polite">最大數從大的數字開始排；最小數的百位不能是 0。</p></div></article>`,

  () => `<article class="slide center" data-slide-number="7"><div class="divider-icon">✋</div><p class="divider-title">換你做做看</p><h2>在空格裡填入 ＞、＜ 或 ＝</h2><p class="subtitle">記得：先比百位，再比十位、個位。</p></article>`,

  () => `<article class="slide" data-slide-number="8"><p class="slide-kicker">總複習｜比大小</p><h2>請選出正確的符號</h2><div class="review-grid">${reviewItem("q1",338,412,"＜")}${reviewItem("q2",610,601,"＞")}${reviewItem("q3",470,740,"＜")}${reviewItem("q4",594,596,"＜")}</div></article>`
];

function setupChoiceQuestion() {
  stage.querySelectorAll("[data-choice-question]").forEach(panel => {
    panel.querySelectorAll("[data-choice]").forEach(button => {
      button.addEventListener("click", () => {
        panel.querySelectorAll("[data-choice]").forEach(item => item.classList.remove("correct","wrong"));
        const correct = button.dataset.choice === panel.dataset.answer;
        button.classList.add(correct ? "correct" : "wrong");
        const feedback = panel.querySelector(".feedback");
        feedback.classList.toggle("wrong",!correct);
        feedback.textContent = correct ? "答對了！603 比 495 大，所以晚餐比較多。" : "先比百位：603 有 6 個百，495 有 4 個百。";
      });
    });
  });
}

function setupSymbolGroups() {
  stage.querySelectorAll("[data-symbol-group]").forEach(group => {
    group.querySelectorAll("[data-symbol]").forEach(button => {
      button.addEventListener("click", () => {
        group.querySelectorAll("[data-symbol]").forEach(item => item.classList.remove("correct","wrong"));
        const correct = button.dataset.symbol === group.dataset.answer;
        button.classList.add(correct ? "correct" : "wrong");
        document.querySelector("#s4Symbol").textContent = button.dataset.symbol;
        const feedback = document.querySelector("#s4Feedback");
        feedback.classList.toggle("wrong",!correct);
        feedback.textContent = correct ? "答對了！十位的 7 大於 2，所以 571 ＞ 526。" : "百位一樣，請比較十位的 7 和 2。";
      });
    });
  });
}

function setupCardQuestions() {
  stage.querySelectorAll("[data-card-question]").forEach(question => {
    question.querySelectorAll("[data-card-answer]").forEach(button => {
      button.addEventListener("click", () => {
        question.querySelectorAll("[data-card-answer]").forEach(item => item.classList.remove("correct","wrong"));
        button.classList.add(button.dataset.cardAnswer === question.dataset.answer ? "correct" : "wrong");
      });
    });
  });
}

function setupChallenges() {
  stage.querySelectorAll("[data-challenge]").forEach(challenge => {
    challenge.querySelectorAll("[data-challenge-answer]").forEach(button => {
      button.addEventListener("click", () => {
        challenge.querySelectorAll("[data-challenge-answer]").forEach(item => item.classList.remove("correct","wrong"));
        const correct = button.dataset.challengeAnswer === challenge.dataset.answer;
        button.classList.add(correct ? "correct" : "wrong");
        const allCorrect = [...stage.querySelectorAll("[data-challenge]")].every(item => item.querySelector(".correct"));
        document.querySelector("#challengeFeedback").textContent = allCorrect ? "答對了！最大是 753，最小是 103。" : correct ? "這一題答對了，再完成另一題。" : "再看看數字排列的順序。";
      });
    });
  });
}

function setupReview() {
  stage.querySelectorAll("[data-review]").forEach(item => {
    item.querySelectorAll("[data-review-symbol]").forEach(button => {
      button.addEventListener("click", () => {
        item.querySelectorAll("[data-review-symbol]").forEach(choice => choice.classList.remove("correct","wrong"));
        const correct = button.dataset.reviewSymbol === item.dataset.answer;
        button.classList.add(correct ? "correct" : "wrong");
        item.querySelector(".symbol-slot").textContent = button.dataset.reviewSymbol;
        const feedback = item.querySelector(".feedback");
        feedback.classList.toggle("wrong",!correct);
        feedback.textContent = correct ? "答對了！" : "再從百位開始比較。";
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
  setupChoiceQuestion();
  setupSymbolGroups();
  setupCardQuestions();
  setupChallenges();
  setupReview();
}

function changeSlide(amount) {
  const nextIndex = Math.max(0,Math.min(currentSlide + amount,slides.length - 1));
  if (nextIndex === currentSlide) return;
  currentSlide = nextIndex;
  renderSlide();
}

previousButton.addEventListener("click",() => changeSlide(-1));
nextButton.addEventListener("click",() => changeSlide(1));
document.querySelector("#resetSlide").addEventListener("click",renderSlide);
document.addEventListener("keydown",event => {
  if (event.target.matches("button")) return;
  if (event.key === "ArrowLeft" || event.key === "PageUp") changeSlide(-1);
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") changeSlide(1);
});
document.querySelector("#speakSlide").addEventListener("click",() => {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const readable = [...stage.querySelectorAll("h1,h2,h3,.slide-kicker,.subtitle,.rule-box,.place-hint,.review-pair")].map(node => node.textContent.trim()).filter(Boolean).join("。 ");
  const utterance = new SpeechSynthesisUtterance(readable);
  utterance.lang = "zh-TW";
  utterance.rate = .82;
  speechSynthesis.speak(utterance);
});
document.querySelector("#fullscreen").addEventListener("click",async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
  else await document.exitFullscreen();
});
document.addEventListener("fullscreenchange",() => document.body.classList.toggle("fullscreen-mode",Boolean(document.fullscreenElement)));

renderSlide();
