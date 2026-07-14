const stage = document.querySelector("#slideStage");
const pageLabel = document.querySelector("#pageLabel");
const progressFill = document.querySelector("#progressFill");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
let currentSlide = 0;

function piece(type) {
  const names = { hundred: "1個百", ten: "1個十", one: "1個一" };
  const classes = { hundred: "hundred-flat", ten: "ten-rod", one: "unit-cube" };
  const tenCells = type === "ten" ? '<i class="ten-cell" aria-hidden="true"></i>'.repeat(10) : "";
  const detail = type === "ten" ? "，共有10小格" : "";
  return `<span class="block-piece ${classes[type]}" draggable="true" tabindex="0" role="img" aria-label="${names[type]}${detail}">${tenCells}</span>`;
}

function fruitDots() {
  return '<span aria-hidden="true"></span>'.repeat(10);
}

function blocks(hundreds, tens, ones, title = "積木表示") {
  return `<div class="block-board" data-block-board>
    <p class="block-board-title">${title}（積木可以拖動）</p>
    <div class="block-zone">
      ${piece("hundred").repeat(hundreds)}
      <div class="ten-stack">${piece("ten").repeat(tens)}</div>
      <div class="one-stack">${piece("one").repeat(ones)}</div>
    </div>
    <div class="block-labels"><span>${hundreds} 個百</span><span>${tens} 個十</span><span>${ones} 個一</span></div>
  </div>`;
}

function valueTable(values = ["", "", ""], editable = true) {
  const cells = values.map((value, index) => editable
    ? `<td><input class="place-input" inputmode="numeric" maxlength="2" data-answer="${value}" aria-label="${["百位","十位","個位"][index]}"></td>`
    : `<td>${value}</td>`).join("");
  return `<table class="place-value" aria-label="定位板"><thead><tr><th>百位</th><th>十位</th><th>個位</th></tr></thead><tbody><tr>${cells}</tr></tbody></table>`;
}

function checkPanel(id, answerText = "答對了！") {
  return `<div class="actions-row"><button class="check-button" type="button" data-check="${id}">檢查答案</button><button class="reveal-button" type="button" data-reveal="${id}">顯示答案</button></div><p class="feedback" id="feedback-${id}" aria-live="polite"></p>`;
}

const slides = [
  () => `<article class="slide center" data-slide-number="1"><div class="title-number">百十個</div><p class="slide-kicker">第一學期數學</p><h1>百、十、個與位值</h1><p class="subtitle">國中特教班適用版｜網頁互動簡報</p></article>`,

  () => `<article class="slide center" data-slide-number="2"><p class="slide-kicker">今天要學</p><h2>看懂百位、十位、個位</h2><ul class="goal-list"><li><span>1</span>知道 10 個十可以換成 1 個百</li><li><span>2</span>用定位板記錄三位數</li><li><span>3</span>說出每個數字代表多少</li></ul></article>`,

  () => `<article class="slide" data-slide-number="3"><p class="slide-kicker">活動 2｜幾個百、幾個十、幾個一</p><h2>10 盒蓮霧就是 1 箱</h2><div class="split"><div class="lesson-copy"><p class="prompt">10 個蓮霧裝 1 盒，10 盒裝 1 箱。一箱有幾個蓮霧？</p><div class="fruit-story"><div class="fruit-box"><div class="fruit-dots">${fruitDots()}</div><strong>1盒＝10個</strong></div><span class="story-arrow">× 10 →</span><div class="big-answer">1箱＝100個</div></div><div class="callout">10 條十積木和 1 張百格板一樣多。<br><strong>10 個十＝1 個百＝100</strong></div></div><div class="block-board"><p class="block-board-title">按按鈕，把 10 個十換成 1 個百</p><div class="block-zone" id="regroup100"><div class="ten-stack">${piece("ten").repeat(10)}</div></div><div class="regroup-row"><button class="regroup-button" type="button" data-regroup="hundred">10 個十 → 1 個百</button></div></div></div></article>`,

  () => `<article class="slide" data-slide-number="4"><p class="slide-kicker">活動 2｜看積木，填定位板</p><h2>2 箱、5 盒又 6 個，共有多少個？</h2><div class="split">${blocks(2,5,6,"256 的積木")}<div class="lesson-copy"><p class="prompt">256 是幾個百、幾個十和幾個一合起來的？</p>${valueTable([2,5,6])}<label class="answer-line">共有 <input class="answer-input" inputmode="numeric" maxlength="3" data-answer="256" aria-label="共有多少個蓮霧"> 個</label>${checkPanel("s4")}</div></div></article>`,

  () => `<article class="slide center" data-slide-number="5"><p class="slide-kicker">活動 2｜做做看 1</p><h2>586 是幾個百、幾個十和幾個一？</h2><div class="digit-demo"><span class="digit hundreds">5</span><span class="digit tens">8</span><span class="digit ones">6</span></div>${valueTable([5,8,6])}${checkPanel("s5")}</article>`,

  () => `<article class="slide" data-slide-number="6"><p class="slide-kicker">活動 2｜看積木，填定位板</p><h2>5 個百、3 個十和 9 個一</h2><div class="split">${blocks(5,3,9,"先看積木")}<div class="lesson-copy"><p class="prompt">把積木的數量記在定位板，再寫出合起來是多少。</p>${valueTable([5,3,9])}<label class="answer-line">合起來是 <input class="answer-input" inputmode="numeric" maxlength="3" data-answer="539" aria-label="合起來是多少"></label>${checkPanel("s6")}</div></div></article>`,

  () => `<article class="slide practice-slide" data-slide-number="7"><p class="slide-kicker">活動 2｜先換位，再填定位板</p><h2>2 個百、12 個十和 8 個一</h2><div class="practice-grid"><div class="block-board"><p class="block-board-title">先看積木，再按換位</p><div class="block-zone" id="regroup328">${piece("hundred").repeat(2)}<div class="ten-stack">${piece("ten").repeat(12)}</div><div class="one-stack">${piece("one").repeat(8)}</div></div><div class="block-labels" id="labels328"><span>2 個百</span><span>12 個十</span><span>8 個一</span></div><div class="regroup-row"><button class="regroup-button" type="button" data-regroup="328">10 個十 → 1 個百</button></div></div><div class="lesson-copy"><div class="callout"><strong>10 個十可以換成 1 個百。</strong></div>${valueTable([3,2,8])}<label class="answer-line">合起來是 <input class="answer-input" inputmode="numeric" maxlength="3" data-answer="328" aria-label="合起來是多少"></label>${checkPanel("s7")}</div></div></article>`,

  () => `<article class="slide" data-slide-number="8"><p class="slide-kicker">活動 2｜每個數字代表多少</p><h2>把 428 記在定位板上</h2><div class="split"><div class="lesson-copy">${valueTable([4,2,8],false)}<div class="digit-demo"><span class="digit hundreds">4</span><span class="digit tens">2</span><span class="digit ones">8</span></div></div><div class="lesson-copy"><p class="prompt">428 裡面的 4、2、8，各表示多少？</p><div class="meaning-grid"><button class="meaning-card reveal-button" data-meaning="400">4 表示？</button><button class="meaning-card reveal-button" data-meaning="20">2 表示？</button><button class="meaning-card reveal-button" data-meaning="8">8 表示？</button></div><p class="feedback" id="meaningFeedback">點一個數字看看。</p></div></div></article>`,

  () => `<article class="slide center" data-slide-number="9"><p class="slide-kicker">活動 2｜同一個數字，位置不同</p><h2>111 裡的 3 個「1」，意思一樣嗎？</h2><div class="digit-demo"><span class="digit hundreds">1</span><span class="digit tens">1</span><span class="digit ones">1</span></div><div class="choice-row"><button class="choice-button" type="button" data-choice="same">一樣</button><button class="choice-button" type="button" data-choice="different">不一樣</button></div><div class="meaning-grid" id="meaning111" hidden><div class="meaning-card">百位的 1<br><strong>表示 1 個百</strong></div><div class="meaning-card">十位的 1<br><strong>表示 1 個十</strong></div><div class="meaning-card">個位的 1<br><strong>表示 1 個一</strong></div></div><p class="feedback" id="choiceFeedback" aria-live="polite"></p></article>`,

  () => `<article class="slide center" data-slide-number="10"><div class="divider-icon">✋</div><p class="divider-title">換你做做看</p><h2>先換位，再寫出答案</h2><p class="subtitle">下一頁要把 15 個一換成 1 個十和 5 個一。</p></article>`,

  () => `<article class="slide practice-slide" data-slide-number="11"><p class="slide-kicker">做做看｜綜合練習</p><h2>8 個百、5 個十和 15 個一合起來是多少？</h2><div class="practice-grid"><div class="block-board"><p class="block-board-title">按換位，看看數量怎麼改變</p><div class="block-zone" id="regroup865">${piece("hundred").repeat(8)}<div class="ten-stack">${piece("ten").repeat(5)}</div><div class="one-stack">${piece("one").repeat(15)}</div></div><div class="block-labels" id="labels865"><span>8 個百</span><span>5 個十</span><span>15 個一</span></div><div class="regroup-row"><button class="regroup-button" type="button" data-regroup="865">10 個一 → 1 個十</button></div></div><div class="lesson-copy"><p class="prompt">換位後，是 8 個百、6 個十和 5 個一。</p>${valueTable([8,6,5])}<label class="answer-line">合起來是 <input class="answer-input" inputmode="numeric" maxlength="3" data-answer="865" aria-label="合起來是多少"></label>${checkPanel("s11")}</div></div></article>`
];

function setupDragging() {
  document.querySelectorAll(".block-piece").forEach(item => {
    item.addEventListener("dragstart", event => {
      item.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", "block");
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
  });
  document.querySelectorAll(".block-zone").forEach(zone => {
    zone.addEventListener("dragover", event => event.preventDefault());
    zone.addEventListener("drop", event => {
      event.preventDefault();
      const item = document.querySelector(".block-piece.dragging");
      if (item) zone.appendChild(item);
    });
  });
}

function setupRegrouping() {
  document.querySelectorAll("[data-regroup]").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.regroup;
      if (key === "hundred") {
        document.querySelector("#regroup100").innerHTML = piece("hundred");
        button.textContent = "換位完成：1 個百";
      }
      if (key === "328") {
        const zone = document.querySelector("#regroup328");
        zone.innerHTML = `${piece("hundred").repeat(3)}<div class="ten-stack">${piece("ten").repeat(2)}</div><div class="one-stack">${piece("one").repeat(8)}</div>`;
        document.querySelector("#labels328").innerHTML = "<span>3 個百</span><span>2 個十</span><span>8 個一</span>";
        button.textContent = "換位完成：328";
      }
      if (key === "865") {
        const zone = document.querySelector("#regroup865");
        zone.innerHTML = `${piece("hundred").repeat(8)}<div class="ten-stack">${piece("ten").repeat(6)}</div><div class="one-stack">${piece("one").repeat(5)}</div>`;
        document.querySelector("#labels865").innerHTML = "<span>8 個百</span><span>6 個十</span><span>5 個一</span>";
        button.textContent = "換位完成：865";
      }
      setupDragging();
    });
  });
}

function panelInputs(button) {
  return [...button.closest("article").querySelectorAll("input[data-answer]")];
}

function setupChecking() {
  document.querySelectorAll("[data-check]").forEach(button => {
    button.addEventListener("click", () => {
      const inputs = panelInputs(button);
      const allCorrect = inputs.length > 0 && inputs.every(input => input.value.trim() === input.dataset.answer);
      const feedback = document.querySelector(`#feedback-${button.dataset.check}`);
      feedback.classList.toggle("wrong", !allCorrect);
      feedback.textContent = allCorrect ? "答對了！你已經看懂百位、十位和個位。" : "再看一次積木和定位板，調整答案後再試試看。";
    });
  });
  document.querySelectorAll("[data-reveal]").forEach(button => {
    button.addEventListener("click", () => {
      panelInputs(button).forEach(input => { input.value = input.dataset.answer; });
      const feedback = document.querySelector(`#feedback-${button.dataset.reveal}`);
      feedback.classList.remove("wrong");
      feedback.textContent = "答案已顯示，請一起讀一次。";
    });
  });
}

function setupMeanings() {
  document.querySelectorAll("[data-meaning]").forEach(button => {
    button.addEventListener("click", () => {
      const value = button.dataset.meaning;
      const wording = value === "400" ? "4 個百，也就是 400。" : value === "20" ? "2 個十，也就是 20。" : "8 個一，也就是 8。";
      button.textContent = wording;
      document.querySelector("#meaningFeedback").textContent = wording;
    });
  });
  document.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-choice]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
      const correct = button.dataset.choice === "different";
      const feedback = document.querySelector("#choiceFeedback");
      feedback.classList.toggle("wrong", !correct);
      feedback.textContent = correct ? "答對了！位置不同，代表的數量也不同。" : "再看看 3 個 1 分別在百位、十位和個位。";
      document.querySelector("#meaning111").hidden = !correct;
    });
  });
}

function renderSlide() {
  stage.innerHTML = slides[currentSlide]();
  pageLabel.textContent = `第 ${currentSlide + 1} 頁／共 ${slides.length} 頁`;
  progressFill.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  setupDragging();
  setupRegrouping();
  setupChecking();
  setupMeanings();
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
  const readable = [...stage.querySelectorAll("h1, h2, h3, .prompt, .callout, .subtitle, .answer-line")].map(node => node.textContent.trim()).filter(Boolean).join("。 ");
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
