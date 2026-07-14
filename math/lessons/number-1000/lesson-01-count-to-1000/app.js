"use strict";

const stage = document.querySelector("#slideStage");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
const pageLabel = document.querySelector("#pageLabel");
const progressFill = document.querySelector("#progressFill");
let currentSlide = 0;

function piece(type, x, y, label = "", value = 0, extra = "") {
  const shownLabel = label === null ? "" : (label || value);
  const tag = shownLabel === "" ? "" : `<span class="piece-tag">${shownLabel}</span>`;
  return `<div class="drag-piece ${type} ${extra}" data-value="${value}" aria-label="可拖拉的${value}積木">${tag}</div>`;
}

function groupPieces(type, count, value, extra = "") {
  return Array.from({ length: count }, (_, index) => piece(type, 0, 0, index === 0 ? String(value) : null, value, extra)).join("");
}

function workbench(pieces, label = "積木操作區", density = "") {
  return `<div class="workbench-wrap"><div class="dual-workbench ${density}"><section class="block-tray"><p class="zone-title">積木區</p><div class="tray-items">${pieces}</div></section><section class="drop-workspace"><p class="zone-title">操作區</p><p class="drop-message">把積木拖到這裡</p></section></div><p class="workbench-caption">${label}</p></div>`;
}

function infiniteWorkbench(label = "把需要的積木拖到操作區", density = "") {
  const palette = piece("hundred-flat", 0, 0, "100", 100, "source-piece") + piece("ten-rod", 0, 0, "10", 10, "source-piece") + piece("unit-cube", 0, 0, "1", 1, "source-piece");
  return workbench(palette, label, `${density} infinite-workbench`);
}

function sequenceRow(values, answer, choices) {
  const cards = values.map(value => value === "?" ? `<div class="sequence-card blank drop-target" data-correct="${answer}">？</div>` : `<div class="sequence-card">${value}</div>`).join('<span class="arrow">→</span>');
  const bank = choices.map(value => `<button class="drag-number" type="button" draggable="true" data-number="${value}">${value}</button>`).join("");
  return `<div class="sequence-row">${cards}</div><div class="number-bank" aria-label="可拖拉的數字卡">${bank}</div><p class="practice-feedback" aria-live="polite">把正確的數字卡拖到問號，也可以先點數字卡再點問號。</p>`;
}

const slides = [
  () => `<article class="slide center" data-slide-number="1"><div class="title-number">1000</div><p class="slide-kicker">第一學期數學</p><h1>數到1000</h1><p class="subtitle">國中特教班適用版｜網頁互動簡報</p></article>`,

  () => `<article class="slide center" data-slide-number="2"><p class="slide-kicker">今天要學</p><h2>每次加 1、10 或 100</h2><ul class="goal-list"><li><span>1</span>認識個位積木、十條和百格板</li><li><span>2</span>從 100 數到 1000</li><li><span>3</span>找出數列的下一個數</li></ul></article>`,

  () => `<article class="slide" data-slide-number="3"><p class="slide-kicker">活動 1｜看積木，數一數金幣</p><h2>積木代表多少枚金幣？</h2><div class="split"><div class="lesson-copy"><div class="callout"><strong>1 個小積木</strong>表示 1 枚金幣。<br><strong>1 條十條</strong>表示 10 枚金幣。<br><strong>1 張百格板</strong>表示 100 枚金幣。</div><p class="prompt">請把右邊的積木拖開，看看三種積木的大小。</p></div>${workbench(
    piece("unit-cube", 14, 22, "1", 1) + piece("ten-rod", 43, 14, "", 10) + piece("hundred-flat", 64, 19, "100", 100),
    "積木附件"
  )}</div></article>`,

  () => `<article class="slide" data-slide-number="4"><p class="slide-kicker">活動 1｜100 個一數</p><h2>1 箱有 100 枚金幣</h2><div class="split"><div class="lesson-copy"><p class="prompt">2 箱共有幾枚？請拖拉百格板，再填入答案。</p><div class="count-strip"><span class="number-chip">1 箱＝100</span><span class="arrow">→</span><span class="number-chip">2 箱＝？</span><span class="arrow">→</span><span class="number-chip">再加 1 箱</span></div><p>每增加 1 個百格板，就是<strong>＋100</strong>。</p><label class="answer-line">2 箱＝<input class="answer-input" type="text" inputmode="numeric" maxlength="4" aria-label="兩箱共有幾枚金幣">枚</label></div>${infiniteWorkbench("積木會自動複製，可以重複拖拉", "dense-blocks")}</div></article>`,

  () => `<article class="slide slide-five" data-slide-number="5"><p class="slide-kicker">活動 1｜從 900 數到下一個數</p><h2>9 箱再加 1 箱是多少？</h2><div class="slide-five-grid"><div class="lesson-copy"><label class="equation answer-equation">900 <span class="plus">＋ 100</span> ＝ <input class="answer-input equation-input" type="text" inputmode="numeric" maxlength="4" aria-label="900加100的答案"></label><div class="callout"><strong>先拖拉百格板，再填入答案。</strong><br>完成後，一起讀出這個數。</div><div class="count-strip"><span class="number-chip">9 箱＝900</span><span class="arrow">＋</span><span class="number-chip">1 箱＝100</span></div></div>${infiniteWorkbench("積木會自動複製，可以重複拖拉", "dense-blocks")}</div></article>`,

  () => `<article class="slide" data-slide-number="6"><p class="slide-kicker">活動 2｜一個一個地數</p><h2>已經有 200 枚，再找到 1 枚</h2><div class="split"><div class="lesson-copy"><div class="count-strip"><span class="number-chip">200</span><span class="arrow">→</span><span class="number-chip">201</span><span class="arrow">→</span><span class="number-chip">202</span><span class="arrow">→</span><span class="number-chip">203</span></div><p class="prompt">200 再加 1 是 201，讀作「二百零一」。</p><p>每加入 1 個小積木，就是<strong>＋1</strong>。</p></div>${infiniteWorkbench("選擇100、10或1，積木會自動複製", "dense-blocks")}</div></article>`,

  () => `<article class="slide" data-slide-number="7"><p class="slide-kicker">活動 2｜跨過整十、整百和整千</p><h2>再加 1，新的數是多少？</h2><div class="case-tabs"><button class="case-tab" data-case="209" aria-pressed="true">209＋1</button><button class="case-tab" data-case="299" aria-pressed="false">299＋1</button><button class="case-tab" data-case="999" aria-pressed="false">999＋1</button></div><div id="casePanel" class="case-panel"></div></article>`,

  () => `<article class="slide" data-slide-number="8"><p class="slide-kicker">活動 2｜十個十個地數</p><h2>每次再加 10</h2><div class="split"><div class="lesson-copy"><div class="count-strip"><span class="number-chip">300</span><span class="arrow">→</span><span class="number-chip">310</span><span class="arrow">→</span><span class="number-chip">320</span><span class="arrow">→</span><span class="number-chip">330</span></div><p class="prompt">390 再加 10 是多少？</p><div class="equation">390 <span class="plus">＋10</span> ＝ <span class="answer">400</span></div></div>${infiniteWorkbench("選擇100、10或1，積木會自動複製", "dense-blocks")}</div></article>`,

  () => `<article class="slide practice-slide" data-slide-number="9"><p class="slide-kicker">活動 3｜數列練習</p><h2>把正確的數字放進空格</h2><div class="sequence-board"><section><h3>每次加 10</h3>${sequenceRow([385, 395, "?", 415, 425, 435], 405, [405, 414, 514])}</section><section><h3>每次加 100</h3>${sequenceRow([214, 314, "?", 514, 614, 714], 414, [314, 414, 614])}</section></div></article>`,

  () => `<article class="slide center" data-slide-number="10"><div class="divider-icon">✋</div><p class="divider-title">換你做做看</p><h2>先找規律，再放入正確的數字</h2><p class="subtitle">下一頁有 3 組數列。</p></article>`,

  () => `<article class="slide compact-practice" data-slide-number="11"><p class="slide-kicker">活動 3｜綜合練習</p><h2>找出每一列少掉的數</h2><div class="sequence-board"><section><h3>每次減少 100</h3>${sequenceRow([937, 837, "?", 637, 537, 437, 337], 737, [637, 737, 937])}</section><section><h3>每次減少 10</h3>${sequenceRow([655, 645, 635, "?", 615, 605, 595], 625, [615, 625, 635])}</section><section><h3>每次減少 1</h3>${sequenceRow([801, 800, 799, 798, "?", 796, 795], 797, [796, 797, 798])}</section></div></article>`
];

const cases = {
  209: { before: 209, after: 210, reading: "二百一十", note: "9 個一加 1 個一，可以換成 1 個十。", pieces: groupPieces("hundred-flat", 2, 100) + groupPieces("unit-cube", 9, 1) + piece("unit-cube", 0, 0, "＋1", 1, "add-one") },
  299: { before: 299, after: 300, reading: "三百", note: "個位和十位都滿了，再加 1 就換成新的 1 個百。", pieces: groupPieces("hundred-flat", 2, 100) + groupPieces("ten-rod", 9, 10) + groupPieces("unit-cube", 9, 1) + piece("unit-cube", 0, 0, "＋1", 1, "add-one") },
  999: { before: 999, after: 1000, reading: "一千", note: "999 再加 1，會跨到下一個整千數。", pieces: groupPieces("hundred-flat", 9, 100) + groupPieces("ten-rod", 9, 10) + groupPieces("unit-cube", 9, 1) + piece("unit-cube", 0, 0, "＋1", 1, "add-one") }
};

function renderCase(key) {
  const item = cases[key];
  document.querySelectorAll(".case-tab").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.case === String(key))));
  const panel = document.querySelector("#casePanel");
  panel.innerHTML = `<div class="lesson-copy"><p class="prompt">有 ${item.before} 枚金幣，再加 1 枚。</p><div class="equation">${item.before} <span class="plus">＋1</span> ＝ <span class="answer">${item.after}</span></div><div class="callout"><strong>${item.after} 讀作「${item.reading}」</strong><br>${item.note}</div></div>${infiniteWorkbench("選擇100、10或1，積木會自動複製", "dense-blocks")}`;
}

function setupCaseTabs() {
  const tabs = document.querySelectorAll(".case-tab");
  if (!tabs.length) return;
  tabs.forEach(button => button.addEventListener("click", () => { renderCase(button.dataset.case); setupDraggablePieces(); }));
  renderCase("209");
}

function setupDraggablePieces() {
  document.querySelectorAll(".drag-piece").forEach(item => {
    if (item.dataset.dragReady === "1") return;
    item.dataset.dragReady = "1";
    item.addEventListener("pointerdown", event => {
      event.preventDefault();
      const board = item.closest(".dual-workbench");
      if (!board) return;
      const sourceBox = item.getBoundingClientRect();
      const boardBox = board.getBoundingClientRect();
      const offsetX = event.clientX - sourceBox.left;
      const offsetY = event.clientY - sourceBox.top;
      let activeItem = item;

      if (item.classList.contains("source-piece")) {
        activeItem = item.cloneNode(true);
        activeItem.classList.remove("source-piece");
        activeItem.classList.add("spawned-piece");
        activeItem.dataset.dragReady = "";
        board.appendChild(activeItem);
        activeItem.style.left = `${sourceBox.left - boardBox.left}px`;
        activeItem.style.top = `${sourceBox.top - boardBox.top}px`;
        setupDraggablePieces();
      } else if (item.parentElement !== board) {
        board.appendChild(activeItem);
        activeItem.style.left = `${sourceBox.left - boardBox.left}px`;
        activeItem.style.top = `${sourceBox.top - boardBox.top}px`;
      }

      activeItem.classList.add("dragging");

      const move = moveEvent => {
        const itemBox = activeItem.getBoundingClientRect();
        const left = Math.max(0, Math.min(moveEvent.clientX - boardBox.left - offsetX, boardBox.width - itemBox.width));
        const top = Math.max(0, Math.min(moveEvent.clientY - boardBox.top - offsetY, boardBox.height - itemBox.height));
        activeItem.style.left = `${left}px`;
        activeItem.style.top = `${top}px`;
        const dropZone = board.querySelector(".drop-workspace");
        const dropBox = dropZone.getBoundingClientRect();
        const centerX = moveEvent.clientX - offsetX + itemBox.width / 2;
        const centerY = moveEvent.clientY - offsetY + itemBox.height / 2;
        dropZone.classList.toggle("receiving", centerX >= dropBox.left && centerX <= dropBox.right && centerY >= dropBox.top && centerY <= dropBox.bottom);
      };

      const stop = () => {
        activeItem.classList.remove("dragging");
        board.querySelector(".drop-workspace")?.classList.remove("receiving");
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
    });
  });
}

let selectedNumber = null;

function checkNumber(target, value) {
  const correct = Number(target.dataset.correct);
  const feedback = target.closest("section").querySelector(".practice-feedback");
  target.textContent = value;
  target.classList.remove("correct", "wrong");
  if (Number(value) === correct) {
    target.classList.add("correct");
    feedback.textContent = `答對了！空格是 ${correct}。`;
  } else {
    target.classList.add("wrong");
    feedback.textContent = "再看一次規律，換一張數字卡。";
  }
}

function setupNumberCards() {
  selectedNumber = null;
  document.querySelectorAll(".drag-number").forEach(card => {
    card.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", card.dataset.number));
    card.addEventListener("click", () => {
      selectedNumber = card.dataset.number;
      card.closest("section").querySelector(".practice-feedback").textContent = `已選擇 ${selectedNumber}，請點一下問號。`;
    });
  });
  document.querySelectorAll(".drop-target").forEach(target => {
    target.addEventListener("dragover", event => { event.preventDefault(); target.classList.add("is-over"); });
    target.addEventListener("dragleave", () => target.classList.remove("is-over"));
    target.addEventListener("drop", event => {
      event.preventDefault(); target.classList.remove("is-over");
      checkNumber(target, event.dataTransfer.getData("text/plain"));
    });
    target.addEventListener("click", () => { if (selectedNumber !== null) checkNumber(target, selectedNumber); });
  });
}

function renderSlide() {
  stage.innerHTML = slides[currentSlide]();
  pageLabel.textContent = `第 ${currentSlide + 1} 頁／共 ${slides.length} 頁`;
  progressFill.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  setupCaseTabs();
  setupDraggablePieces();
  setupNumberCards();
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
  if (event.key === "ArrowLeft" || event.key === "PageUp") changeSlide(-1);
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") changeSlide(1);
});

document.querySelector("#speakSlide").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const readable = [...stage.querySelectorAll("h1, h2, h3, .prompt, .callout, .subtitle")].map(node => node.textContent).join("。 ");
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
