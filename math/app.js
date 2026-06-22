const activities = [
  { name: "看一看", title: "這樣有平分嗎？", instruction: "看看每一盒的糖果數量，再選答案。", hint: "數一數：兩盒的糖果一樣多嗎？" },
  { name: "分一分", title: "把 6 顆蘋果平分給 3 位小朋友", instruction: "按「放一顆」，輪流把蘋果分出去。", hint: "先給第 1 位一顆，再給第 2 位一顆，最後給第 3 位一顆。" },
  { name: "裝一裝", title: "把 12 個蛋糕平分到 4 個盤子", instruction: "拖曳蛋糕到盤子裡，讓每盤都有 3 個。", hint: "一盤放一個，輪流放；每個盤子最多放 3 個。" },
  { name: "配一配", title: "哪一個算式代表這個分法？", instruction: "20 塊餅乾，平分給 5 位小朋友。", hint: "總共有 20 塊，分給 5 人，所以用 20 除以 5。" },
  { name: "剪一剪", title: "24 公分的緞帶，每 6 公分剪一段", instruction: "按「剪下一段」，看看能剪成幾段。", hint: "每剪一段，就從 24 公分減掉 6 公分。" }
];

const curriculum = window.MATH_CURRICULUM;
let currentUnitId = "division";

let step = 0;
let completed = new Set();
let distribution = [0, 0, 0];
let apples = 6;
let cakeDistribution = [0, 0, 0, 0];
let cakesRemaining = 12;
let cuts = 0;
let mode = "home";
let currentSpokenText = "選擇跟著老師學，或自己練習。";
let practiceQuestions = [];
let practiceIndex = 0;
let practiceScore = 0;
let practiceHints = 0;
let practiceAnswered = false;
let practiceHintUsed = false;

const card = document.querySelector("#activity");
const progressList = document.querySelector("#progressList");
const nextBtn = document.querySelector("#nextBtn");
const hintBtn = document.querySelector("#hintBtn");
const speakBtn = document.querySelector("#speakBtn");
const calmBtn = document.querySelector("#calmBtn");
const homeBtn = document.querySelector("#homeBtn");
const toast = document.querySelector("#toast");
const lessonActions = document.querySelector(".lesson-actions");

function header() {
  const activity = activities[step];
  currentSpokenText = `${activity.title}。${activity.instruction}`;
  return `<p class="eyebrow">第 ${step + 1} 關｜${activity.name}</p>
    <h1>${activity.title}</h1>
    <p class="instruction">${activity.instruction}</p>`;
}

function feedback() { return `<div class="feedback" id="feedback"></div><div id="hint"></div>`; }

function renderProgress() {
  progressList.style.gridTemplateColumns = "repeat(5, 1fr)";
  progressList.innerHTML = activities.map((item, index) =>
    `<li class="${index === step ? "active" : ""} ${completed.has(index) ? "done" : ""}" ${index === step ? 'aria-current="step"' : ""}>${index + 1}. ${item.name}</li>`
  ).join("");
}

function render() {
  mode = "teaching";
  homeBtn.hidden = false;
  homeBtn.innerHTML = '<span aria-hidden="true">←</span> 返回本課選單';
  lessonActions.hidden = false;
  renderProgress();
  nextBtn.disabled = !completed.has(step);
  nextBtn.innerHTML = step === activities.length - 1 ? "完成學習 ✓" : "下一關 <span aria-hidden=\"true\">→</span>";

  if (step === 0) renderEqualShare();
  if (step === 1) renderDistribute();
  if (step === 2) renderCakes();
  if (step === 3) renderEquation();
  if (step === 4) renderRibbon();
}

function renderMathHome() {
  mode = "math";
  currentSpokenText = "這是數學學習站。請選擇想學的數學單元。";
  progressList.innerHTML = "";
  progressList.style.gridTemplateColumns = "";
  lessonActions.hidden = true;
  homeBtn.hidden = true;
  card.innerHTML = `<div class="platform-home">
    <p class="eyebrow">數學學習站</p>
    <h1>今天要學什麼？</h1>
    <p class="instruction">請選擇一個數學單元。</p>
    <div class="unit-grid">
      ${curriculum.units.map(unit => `<button class="unit-card unit-${unit.color}" data-unit-id="${unit.id}" ${unit.enabled ? "" : "disabled"}>
        <span class="unit-icon" aria-hidden="true">${unit.icon}</span>
        <strong>${unit.title}</strong>
        <span class="unit-note">${unit.note}</span>
      </button>`).join("")}
    </div>
  </div>`;
  card.querySelectorAll("[data-unit-id]:not([disabled])").forEach(button => {
    button.addEventListener("click", () => renderUnitHome(button.dataset.unitId));
  });
}

function renderUnitHome(unitId = currentUnitId) {
  const unit = curriculum.units.find(item => item.id === unitId);
  if (!unit || !unit.enabled) return;
  currentUnitId = unitId;
  mode = "unit";
  currentSpokenText = `${unit.title}單元，共有 ${unit.lessons.length} 課。請選擇課程。`;
  progressList.innerHTML = "";
  progressList.style.gridTemplateColumns = "";
  lessonActions.hidden = true;
  homeBtn.hidden = false;
  homeBtn.innerHTML = '<span aria-hidden="true">←</span> 返回數學首頁';
  card.innerHTML = `<div class="unit-home">
    <div class="breadcrumb" aria-label="目前位置"><span>數學</span><b aria-hidden="true">›</b><strong>${unit.title}</strong></div>
    <div class="unit-title-row"><span class="unit-title-icon unit-${unit.color}" aria-hidden="true">${unit.icon}</span><div><p class="eyebrow">數學單元</p><h1>${unit.title}</h1></div></div>
    <p class="instruction">按照順序學習，也可以回來複習完成的課程。</p>
    <div class="lesson-list">
      ${unit.lessons.map(lesson => `<button class="lesson-row" data-lesson-id="${lesson.id}" ${lesson.enabled ? "" : "disabled"}>
        <span class="lesson-number">${lesson.order}</span>
        <span class="lesson-info"><strong>${lesson.title}</strong><small>${lesson.source || "教材尚未放入工作區"}</small></span>
        <span class="lesson-status ${lesson.enabled ? "ready" : "pending"}">${lesson.status}</span>
        <span class="lesson-arrow" aria-hidden="true">${lesson.enabled ? "→" : "–"}</span>
      </button>`).join("")}
    </div>
  </div>`;
  card.querySelectorAll("[data-lesson-id]:not([disabled])").forEach(button => {
    button.addEventListener("click", renderHome);
  });
}

function renderHome() {
  mode = "home";
  currentSpokenText = "除法第 1 課，認識平分與除法。選擇跟著老師學，或自己練習。";
  progressList.innerHTML = "";
  progressList.style.gridTemplateColumns = "";
  lessonActions.hidden = true;
  homeBtn.hidden = false;
  homeBtn.innerHTML = '<span aria-hidden="true">←</span> 返回除法單元';
  card.innerHTML = `<div class="mode-home">
    <div class="breadcrumb" aria-label="目前位置"><span>數學</span><b aria-hidden="true">›</b><span>除法</span><b aria-hidden="true">›</b><strong>第 1 課</strong></div>
    <p class="eyebrow">除法｜第 1 課</p>
    <h1 class="lesson-menu-title">認識平分與除法</h1>
    <p class="instruction">今天想怎麼學？</p>
    <div class="mode-grid">
      <button class="mode-card teaching-mode" id="teachingModeBtn">
        <span class="mode-icon" aria-hidden="true">👩‍🏫</span>
        <strong>跟著老師學</strong>
        <span>5 個步驟，有提示、有操作</span>
        <em>適合第一次學習</em>
      </button>
      <button class="mode-card practice-mode" id="practiceModeBtn">
        <span class="mode-icon" aria-hidden="true">✏️</span>
        <strong>自己練習</strong>
        <span>每回合隨機 6 題</span>
        <em>適合學完以後練習</em>
      </button>
    </div>
  </div>`;
  card.querySelector("#teachingModeBtn").addEventListener("click", startTeaching);
  card.querySelector("#practiceModeBtn").addEventListener("click", startPractice);
}

function startTeaching() {
  resetLesson();
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makePracticeQuestions() {
  const divisionFacts = shuffle([
    [12, 3, 4, "🧁"], [15, 3, 5, "🍬"], [16, 4, 4, "🍎"],
    [18, 3, 6, "⭐"], [20, 5, 4, "🍪"], [24, 6, 4, "🎀"]
  ]);
  const factories = [
    () => ({ prompt: "下面有平分嗎？", visual: groupVisual([3, 3], "🍬"), choices: ["有平分", "沒有平分"], answer: "有平分", hint: "數一數兩組是不是一樣多。", explanation: "兩組都是 3 個，所以有平分。" }),
    () => ({ prompt: "下面有平分嗎？", visual: groupVisual([2, 4], "⚾"), choices: ["有平分", "沒有平分"], answer: "沒有平分", hint: "比較左邊和右邊的數量。", explanation: "一組 2 個、一組 4 個，數量不同。" }),
    ...divisionFacts.map(([total, divisor, quotient, icon]) => () => {
      const alternatives = shuffle([quotient, quotient + 1, Math.max(2, quotient - 1)]).filter((n, i, a) => a.indexOf(n) === i);
      return {
        prompt: `${total} 個物品，每 ${divisor} 個分成一組，可以分成幾組？`,
        visual: groupedItems(total, divisor, icon),
        choices: alternatives.map(number => `${number} 組`), answer: `${quotient} 組`,
        hint: `每 ${divisor} 個圈成一組，再數有幾組。`, explanation: `${total} ÷ ${divisor} = ${quotient}。`
      };
    }),
    () => ({ prompt: "20 塊餅乾平分給 5 人，哪個算式正確？", visual: "<div class=\"practice-story\">🍪 20 塊　👧👦 5 人</div>", choices: ["20 ÷ 5 = 4", "20 ÷ 4 = 5", "5 ÷ 20 = 4"], answer: "20 ÷ 5 = 4", hint: "總數是 20，分給 5 人。", explanation: "20 ÷ 5 = 4，每人 4 塊。" }),
    () => ({ prompt: "算一算，空格裡是多少？", visual: "<div class=\"practice-equation\">24 ÷ 6 = <span>？</span></div>", choices: ["3", "4", "5"], answer: "4", hint: "想一想：6 乘以多少等於 24？", explanation: "因為 6 × 4 = 24，所以答案是 4。" })
  ];
  return shuffle(factories).slice(0, 6).map(factory => factory());
}

function groupVisual(counts, icon) {
  return `<div class="practice-groups">${counts.map((count, index) => `<div><strong>第 ${index + 1} 組</strong><span>${icon.repeat(count)}</span></div>`).join("")}</div>`;
}

function groupedItems(total, divisor, icon) {
  const groups = total / divisor;
  return `<div class="practice-groups">${Array.from({length: groups}, (_, index) => `<div><strong>第 ${index + 1} 組</strong><span>${icon.repeat(divisor)}</span></div>`).join("")}</div>`;
}

function startPractice() {
  mode = "practice";
  practiceQuestions = makePracticeQuestions();
  practiceIndex = 0;
  practiceScore = 0;
  practiceHints = 0;
  practiceAnswered = false;
  practiceHintUsed = false;
  homeBtn.hidden = false;
  homeBtn.innerHTML = '<span aria-hidden="true">←</span> 返回本課選單';
  lessonActions.hidden = true;
  renderPractice();
}

function renderPracticeProgress() {
  progressList.style.gridTemplateColumns = "repeat(6, 1fr)";
  progressList.innerHTML = practiceQuestions.map((_, index) => `<li class="${index === practiceIndex ? "active" : ""} ${index < practiceIndex ? "done" : ""}" ${index === practiceIndex ? 'aria-current="step"' : ""}>第 ${index + 1} 題</li>`).join("");
}

function renderPractice() {
  const question = practiceQuestions[practiceIndex];
  currentSpokenText = `第 ${practiceIndex + 1} 題。${question.prompt}`;
  renderPracticeProgress();
  card.innerHTML = `<div class="practice-header">
      <p class="eyebrow">自己練習｜第 ${practiceIndex + 1} 題，共 6 題</p>
      <div class="score-chip">目前答對 ${practiceScore} 題</div>
    </div>
    <h1>${question.prompt}</h1>
    <div class="practice-visual">${question.visual}</div>
    <div class="choice-row practice-choices">${question.choices.map(choice => `<button class="choice" data-practice-answer="${choice}">${choice}</button>`).join("")}</div>
    <div class="feedback" id="feedback"></div><div id="hint"></div>
    <div class="practice-actions">
      <button class="secondary-button" id="practiceHintBtn">💡 給我提示</button>
      <button class="primary-button" id="practiceNextBtn" disabled>${practiceIndex === 5 ? "看結果" : "下一題 →"}</button>
    </div>`;
  card.querySelectorAll("[data-practice-answer]").forEach(button => button.addEventListener("click", () => answerPractice(button)));
  card.querySelector("#practiceHintBtn").addEventListener("click", showPracticeHint);
  card.querySelector("#practiceNextBtn").addEventListener("click", nextPracticeQuestion);
}

function answerPractice(button) {
  if (practiceAnswered) return;
  practiceAnswered = true;
  const question = practiceQuestions[practiceIndex];
  const correct = button.dataset.practiceAnswer === question.answer;
  if (correct) {
    practiceScore += 1;
    button.classList.add("correct");
    setFeedback(`答對了！${question.explanation}`, "good");
  } else {
    button.classList.add("wrong");
    const rightButton = [...card.querySelectorAll("[data-practice-answer]")].find(item => item.dataset.practiceAnswer === question.answer);
    rightButton.classList.add("correct");
    setFeedback(`答案是「${question.answer}」。${question.explanation}`, "try");
  }
  card.querySelectorAll("[data-practice-answer]").forEach(item => { item.disabled = true; });
  card.querySelector("#practiceNextBtn").disabled = false;
  speak(correct ? "答對了！" : `答案是${question.answer}。`);
}

function showPracticeHint() {
  const question = practiceQuestions[practiceIndex];
  if (!practiceHintUsed) {
    practiceHints += 1;
    practiceHintUsed = true;
  }
  card.querySelector("#hint").innerHTML = `<div class="hint-box">💡 ${question.hint}</div>`;
  speak(question.hint);
}

function nextPracticeQuestion() {
  if (!practiceAnswered) return;
  if (practiceIndex === 5) showPracticeResult();
  else {
    practiceIndex += 1;
    practiceAnswered = false;
    practiceHintUsed = false;
    renderPractice();
  }
}

function showPracticeResult() {
  progressList.querySelectorAll("li").forEach(item => item.classList.add("done"));
  currentSpokenText = `練習完成。答對 ${practiceScore} 題。`;
  const message = practiceScore >= 5 ? "除法概念很穩定" : practiceScore >= 3 ? "再練一次會更熟悉" : "可以先回到教學模式複習";
  card.innerHTML = `<div class="finish practice-result">
    <div class="finish-icon" aria-hidden="true">${practiceScore >= 5 ? "★" : "✓"}</div>
    <h1>練習完成</h1>
    <div class="result-number"><strong>${practiceScore}</strong><span>／6 題</span></div>
    <p>${message}</p>
    <div class="result-details"><span>答對 ${practiceScore} 題</span><span>使用提示 ${practiceHints} 題</span></div>
    <div class="choice-row"><button class="secondary-button" id="resultHomeBtn">回首頁</button><button class="primary-button" id="practiceAgainBtn">再練 6 題</button></div>
  </div>`;
  card.querySelector("#resultHomeBtn").addEventListener("click", renderHome);
  card.querySelector("#practiceAgainBtn").addEventListener("click", startPractice);
  speak(currentSpokenText);
}

function renderEqualShare() {
  card.innerHTML = `${header()}<div class="question-area"><div>
    <div class="group-row" aria-label="兩盒糖果">
      <div class="group-box"><strong>第 1 盒</strong><div class="items" aria-label="3 顆糖果">🍬 🍬 🍬</div></div>
      <div class="group-box"><strong>第 2 盒</strong><div class="items" aria-label="3 顆糖果">🍬 🍬 🍬</div></div>
    </div>
    <div class="choice-row">
      <button class="choice" data-answer="yes">✓ 有平分</button>
      <button class="choice" data-answer="no">✕ 沒有平分</button>
    </div>${feedback()}</div></div>`;
  card.querySelectorAll("[data-answer]").forEach(button => button.addEventListener("click", () => {
    if (button.dataset.answer === "yes") succeed("答對了！兩盒都是 3 顆，一樣多。", button);
    else retry("再數一次。第 1 盒和第 2 盒都是幾顆呢？");
  }));
}

function renderDistribute() {
  card.innerHTML = `${header()}<div class="question-area"><div class="counter-layout">
    <div class="source-tray">
      <strong>蘋果區</strong>
      <div class="apple-pile" role="img" aria-label="還有 ${apples} 顆蘋果">${"🍎".repeat(apples) || '<span class="empty-tray">都分完了</span>'}</div>
      <output aria-live="polite">還有 ${apples} 顆</output>
      <button class="object-button" id="giveBtn" ${apples === 0 ? "disabled" : ""}>放一顆</button>
    </div>
    <div class="targets">${distribution.map((count, i) => `<div class="target"><strong>第 ${i + 1} 位</strong><div class="items" aria-label="${count} 顆蘋果">${"🍎".repeat(count) || "　"}</div><small>${count} 顆</small></div>`).join("")}</div>
  </div>${feedback()}</div>`;
  card.querySelector("#giveBtn").addEventListener("click", giveApple);
  if (apples === 0) window.setTimeout(() => succeed("分好了！每位小朋友都有 2 顆。"), 80);
}

function giveApple() {
  const given = 6 - apples;
  distribution[given % 3] += 1;
  apples -= 1;
  renderDistribute();
}

function renderCakes() {
  card.innerHTML = `${header()}<div class="question-area cake-activity">
    <div class="cake-tray">
      <strong>蛋糕區</strong>
      <div class="loose-cakes" aria-label="還有 ${cakesRemaining} 個蛋糕">
        ${Array.from({length: cakesRemaining}, (_, i) => `<button class="draggable-cake" draggable="true" data-cake="${i}" aria-label="蛋糕 ${i + 1}，可拖曳">🧁</button>`).join("") || '<span class="empty-tray">都裝好了</span>'}
      </div>
      <output aria-live="polite">還有 ${cakesRemaining} 個</output>
    </div>
    <div class="cake-plates" aria-label="4 個盤子">
      ${cakeDistribution.map((count, index) => `<div class="cake-plate ${count === 3 ? "full" : ""}" data-plate="${index}">
        <strong>第 ${index + 1} 盤</strong>
        <div class="plate-cakes" aria-label="${count} 個蛋糕">${"🧁".repeat(count) || "把蛋糕放這裡"}</div>
        <small>${count} / 3</small>
        <button class="object-button plate-add" data-add-plate="${index}" ${cakesRemaining === 0 || count === 3 ? "disabled" : ""}>放一個到這盤</button>
      </div>`).join("")}
    </div>${feedback()}</div>`;

  card.querySelectorAll(".draggable-cake").forEach(cake => {
    cake.addEventListener("dragstart", event => {
      event.dataTransfer.setData("text/plain", "cake");
      event.dataTransfer.effectAllowed = "move";
      cake.classList.add("dragging");
    });
    cake.addEventListener("dragend", () => cake.classList.remove("dragging"));
  });

  card.querySelectorAll(".cake-plate").forEach(plate => {
    plate.addEventListener("dragover", event => {
      event.preventDefault();
      plate.classList.add("drag-over");
    });
    plate.addEventListener("dragleave", () => plate.classList.remove("drag-over"));
    plate.addEventListener("drop", event => {
      event.preventDefault();
      plate.classList.remove("drag-over");
      if (event.dataTransfer.getData("text/plain") === "cake") placeCake(Number(plate.dataset.plate));
    });
  });

  card.querySelectorAll("[data-add-plate]").forEach(button => {
    button.addEventListener("click", () => placeCake(Number(button.dataset.addPlate)));
  });

  if (cakesRemaining === 0) window.setTimeout(() => succeed("平分完成！每盤 3 個，一共有 4 盤。"), 80);
}

function placeCake(plateIndex) {
  if (cakesRemaining === 0) return;
  if (cakeDistribution[plateIndex] >= 3) {
    retry("這個盤子已經有 3 個了，請放到其他盤子。");
    return;
  }
  cakeDistribution[plateIndex] += 1;
  cakesRemaining -= 1;
  renderCakes();
}

function renderEquation() {
  card.innerHTML = `${header()}<div class="question-area"><div>
    <div class="match-visual" aria-label="20 塊餅乾，分成 5 組">🍪🍪🍪🍪　🍪🍪🍪🍪　🍪🍪🍪🍪　🍪🍪🍪🍪　🍪🍪🍪🍪</div>
    <div class="choice-row">
      <button class="choice" data-eq="wrong">20 ÷ 4 = 5</button>
      <button class="choice" data-eq="right">20 ÷ 5 = 4</button>
      <button class="choice" data-eq="wrong">5 ÷ 20 = 4</button>
    </div>${feedback()}</div></div>`;
  card.querySelectorAll("[data-eq]").forEach(button => button.addEventListener("click", () => {
    button.dataset.eq === "right" ? succeed("答對了！20 平分給 5 人，每人 4 塊。", button) : retry("先找總數 20，再找分給幾人：5 人。")
  }));
}

function renderRibbon() {
  const segments = Array.from({length: 4}, (_, i) => `<span class="ribbon-segment ${i < cuts ? "removed" : ""}" style="left:${i * 25}%">6 公分</span>`).join("");
  const cutLines = Array.from({length: 4}, (_, i) => {
    const state = i < cuts ? "cut-done" : i === cuts ? "next-cut" : "waiting-cut";
    return `<span class="ribbon-cut-line ${state}" style="left:${(i + 1) * 25}%" aria-hidden="true"><span class="scissors">✂</span></span>`;
  }).join("");
  card.innerHTML = `${header()}<div class="question-area"><div style="width:100%">
    <p class="cut-guide"><span class="cut-guide-line" aria-hidden="true"></span> 沿著粗線剪</p>
    <div class="ribbon" aria-label="24 公分緞帶，分成四段；粗線是下一個剪的位置">${segments}${cutLines}</div>
    <p class="cut-count">已剪下：${cuts} 段　｜　剩下：${24 - cuts * 6} 公分</p>
    <div class="choice-row"><button class="object-button" id="cutBtn" ${cuts === 4 ? "disabled" : ""}>✂ 剪下一段</button></div>
    ${feedback()}</div></div>`;
  card.querySelector("#cutBtn").addEventListener("click", () => { cuts += 1; renderRibbon(); });
  if (cuts === 4) window.setTimeout(() => succeed("完成！24 ÷ 6 = 4，可以剪成 4 段。"), 80);
}

function succeed(message, button) {
  completed.add(step);
  if (button) button.classList.add("correct");
  setFeedback(message, "good");
  nextBtn.disabled = false;
  renderProgress();
  speak(message);
}

function retry(message) {
  setFeedback(message, "try");
  showToast("沒關係，再試一次");
}

function setFeedback(message, type) {
  const element = card.querySelector("#feedback");
  if (!element) return;
  element.className = `feedback ${type}`;
  element.textContent = message;
}

function showHint() {
  const target = card.querySelector("#hint");
  if (!target) return;
  target.innerHTML = `<div class="hint-box">💡 ${activities[step].hint}</div>`;
  speak(activities[step].hint);
}

function speak(text = currentSpokenText) {
  if (!("speechSynthesis" in window)) { showToast("這個瀏覽器不支援語音"); return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-TW";
  utterance.rate = .82;
  speechSynthesis.speak(utterance);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function showFinish() {
  progressList.querySelectorAll("li").forEach(item => item.classList.add("done"));
  card.innerHTML = `<div class="finish"><div class="finish-icon" aria-hidden="true">★</div><h1>你完成除法練習了！</h1><p>你會平分、分組，也會用除法算式記錄。</p><button class="primary-button" id="againBtn">再練習一次</button></div>`;
  document.querySelector(".lesson-actions").hidden = true;
  card.querySelector("#againBtn").addEventListener("click", resetLesson);
  speak("恭喜完成！你已經會用除法解決問題了。")
}

function resetLesson() {
  step = 0; completed.clear(); distribution = [0,0,0]; apples = 6;
  cakeDistribution = [0,0,0,0]; cakesRemaining = 12; cuts = 0;
  document.querySelector(".lesson-actions").hidden = false;
  render();
}

function navigateBack() {
  if (mode === "teaching" || mode === "practice") renderHome();
  else if (mode === "home") renderUnitHome(currentUnitId);
  else if (mode === "unit") renderMathHome();
  else renderMathHome();
}

nextBtn.addEventListener("click", () => {
  if (!completed.has(step)) return;
  if (step === activities.length - 1) showFinish();
  else { step += 1; render(); card.focus({preventScroll: true}); }
});
hintBtn.addEventListener("click", showHint);
speakBtn.addEventListener("click", () => speak());
calmBtn.addEventListener("click", () => {
  const active = document.body.classList.toggle("calm");
  calmBtn.setAttribute("aria-pressed", String(active));
  showToast(active ? "已開啟柔和模式" : "已關閉柔和模式");
});
homeBtn.addEventListener("click", navigateBack);

renderMathHome();
