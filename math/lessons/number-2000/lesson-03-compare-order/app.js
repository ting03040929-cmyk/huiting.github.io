const stage = document.querySelector("#slideStage");
const pageLabel = document.querySelector("#pageLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const progressDots = document.querySelector("#progressDots");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");

const storageKey = "webdeck-compare-order-2000-v1";
let currentSlide = 0;
let visited = new Set([0]);
let completed = new Set();

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved?.visited) visited = new Set(saved.visited);
  if (saved?.completed) completed = new Set(saved.completed);
} catch (_) {
  visited = new Set([0]);
  completed = new Set();
}

const placeLabels = ["千位", "百位", "十位", "個位"];

function numberDigits(number) {
  return String(number).padStart(4, "0").split("").map(Number);
}

function displayDigits(number) {
  const raw = String(number).padStart(4, "0").split("");
  let visibleStarted = false;
  return raw.map((digit, index) => {
    if (digit !== "0" || index === 3) visibleStarted = true;
    return visibleStarted ? digit : "";
  });
}

function placeBoard(number, id, compact = false) {
  const digits = displayDigits(number);
  return `<table class="place-board${compact ? " compact" : ""}" data-board-id="${id}" aria-label="${number} 的千位定位板">
    <caption>${number} 的定位板</caption>
    <thead><tr>${placeLabels.map((label, index) => `<th scope="col" data-place="${index}">${label}</th>`).join("")}</tr></thead>
    <tbody><tr>${digits.map((digit, index) => `<td data-place="${index}" class="${digit === "" ? "blank-digit" : ""}">${digit || "—"}</td>`).join("")}</tr></tbody>
  </table>`;
}

function customBoard(digits, id) {
  return `<table class="place-board" data-board-id="${id}" aria-label="有一個數字看不清楚的千位定位板">
    <caption>10 月借閱本數</caption>
    <thead><tr>${placeLabels.map((label, index) => `<th scope="col" data-place="${index}">${label}</th>`).join("")}</tr></thead>
    <tbody><tr>${digits.map((digit, index) => `<td data-place="${index}">${digit}</td>`).join("")}</tr></tbody>
  </table>`;
}

function emptyComparisonBoard() {
  return `<table class="comparison-grid-board" aria-label="千位、百位、十位、個位比較板">
    <thead><tr><th></th>${placeLabels.map(label => `<th>${label}</th>`).join("")}</tr></thead>
    <tbody>
      <tr><th scope="row">數字 1</th>${placeLabels.map(() => "<td></td>").join("")}</tr>
      <tr><th scope="row">數字 2</th>${placeLabels.map(() => "<td></td>").join("")}</tr>
    </tbody>
  </table>`;
}

function stepFlow(steps) {
  return `<div class="compare-flow" style="margin-top: 1.6cqw" aria-label="解題步驟">
    ${steps.map((step, index) => `<div class="flow-step"><span>${index + 1}</span><strong>${step}</strong></div>${index < steps.length - 1 ? '<div class="flow-arrow" aria-hidden="true">→</div>' : ""}`).join("")}
  </div>`;
}

function comparisonFlow() {
  return stepFlow(["先看千位", "一樣，再看下一位", "找到不同，就停止"]);
}

function comparisonView(left, right, id, compact = false) {
  return `<div class="compare-layout" data-comparison="${id}">
    <div class="number-panel"><p class="number-label">${left}</p>${placeBoard(left, `${id}-a`, compact)}</div>
    <div id="relation-${id}" class="relation-mark waiting" aria-label="比較結果">？</div>
    <div class="number-panel"><p class="number-label">${right}</p>${placeBoard(right, `${id}-b`, compact)}</div>
  </div>`;
}

function compareControls(left, right, id, task = id) {
  return `<div class="step-panel">
    <button class="action-button" type="button" data-compare-step="${id}" data-left="${left}" data-right="${right}" data-task="${task}">從千位開始</button>
  </div>
  <p id="feedback-${id}" class="feedback" role="status">先看千位。兩邊一樣，才看下一位。</p>`;
}

function choiceButtons(answer, task, feedbackId) {
  return `<div class="choice-row" aria-label="選擇比較符號">
    ${[">", "<", "＝"].map(symbol => `<button class="choice-button" type="button" data-choice="${symbol}" data-answer="${answer}" data-task="${task}" data-feedback="${feedbackId}">${symbol}</button>`).join("")}
  </div>`;
}

function libraryTable(mode = "plain") {
  const classes = month => {
    if (mode === "maxmin" && month === 10) return "max-cell";
    if (mode === "maxmin" && month === 9) return "min-cell";
    if (mode === "over" && [7,8,10,12].includes(month)) return "target";
    return "";
  };
  return `<table class="data-table" aria-label="圖書館7月到12月借閱本數">
    <thead><tr><th>月份</th>${[7,8,9,10,11,12].map(month => `<th>${month}月</th>`).join("")}</tr></thead>
    <tbody><tr><th>本數</th>
      <td class="${classes(7)}">1232</td><td class="${classes(8)}">1270</td><td class="${classes(9)}">1094</td>
      <td class="${classes(10)}">18□1</td><td class="${classes(11)}">1105</td><td class="${classes(12)}">1357</td>
    </tr></tbody>
  </table>`;
}

const slides = [
  () => `<article class="slide cover center" data-slide-number="1">
    <div class="cover-mark" aria-hidden="true">比</div>
    <p class="unit-label">第 1 單元｜2000 以內的數</p>
    <h1>比大小與排序</h1>
    <p class="subtitle">放進定位板，從左邊第一個位置開始比</p>
  </article>`,

  () => `<article class="slide" data-slide-number="2">
    <p class="slide-kicker">今天要學什麼</p>
    <h2>一次完成一個任務</h2>
    <ul class="goal-list">
      <li><span>1</span>使用 ＞、＜、＝。</li>
      <li><span>2</span>用千位定位板比較兩個數。</li>
      <li><span>3</span>把數字由小到大排列。</li>
    </ul>
  </article>`,

  () => `<article class="slide reference-image-slide" data-slide-number="3">
    <img class="reference-layout-image" src="./images/第三頁_比較大小說明原圖.png" alt="比較大小說明：先比百位，再比十位，最後比個位；大嘴巴朝向大的數字。">
    <div class="symbol-example-strip" aria-label="比較符號例題">
      <div><span>大於例題</span><strong>9 ＞ 6</strong></div>
      <div><span>等於例題</span><strong>7 ＝ 7</strong></div>
      <div><span>小於例題</span><strong>6 ＜ 9</strong></div>
    </div>
  </article>`,

  () => `<article class="slide" data-slide-number="4">
    <p class="slide-kicker">比大小前｜先記住固定順序</p>
    <h2>從左邊第一個位值開始比</h2>
    <div class="rule-layout">
      ${emptyComparisonBoard()}
      <ol class="rule-steps">
        <li><span class="step-badge thousand">1</span><strong>先比千位</strong></li>
        <li><span class="step-badge hundred">2</span><strong>一樣，再比百位</strong></li>
        <li><span class="step-badge ten">3</span><strong>一樣，再比十位</strong></li>
        <li><span class="step-badge one">4</span><strong>最後比個位</strong></li>
      </ol>
    </div>
    <div class="symbol-guide" aria-label="大於、等於、小於符號">
      <div><b>＞</b><span>大於</span></div><div><b>＝</b><span>等於</span></div><div><b>＜</b><span>小於</span></div>
    </div>
    <p class="memory-tip">找到第一個不同的位值，就可以停止。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="5">
    <p class="slide-kicker">完整示範</p>
    <h2 class="question-title">1232 和 1270，哪一個大？</h2>
    ${comparisonView(1232, 1270, "demo1232")}
    ${comparisonFlow()}
    ${compareControls(1232, 1270, "demo1232", "demo1232")}
  </article>`,

  () => `<article class="slide" data-slide-number="6">
    <p class="slide-kicker">第一層：辨認｜選出比較符號</p>
    <h2 class="question-title">481 和 487，應該填哪一個符號？</h2>
    ${comparisonView(481, 487, "q481", true)}
    ${comparisonFlow()}
    ${compareControls(481, 487, "q481", "q481-step")}
    ${choiceButtons("<", "q481-answer", "feedback-q481")}
  </article>`,

  () => `<article class="slide" data-slide-number="7">
    <p class="slide-kicker">第二層：理解｜選出比較符號</p>
    <h2 class="question-title">1200 和 1199，應該填哪一個符號？</h2>
    ${comparisonView(1200, 1199, "q1200", true)}
    ${comparisonFlow()}
    ${compareControls(1200, 1199, "q1200", "q1200-step")}
    ${choiceButtons(">", "q1200-answer", "feedback-q1200")}
  </article>`,

  () => `<article class="slide" data-slide-number="8">
    <p class="slide-kicker">生活例子｜比較錢的多少</p>
    <h2 class="question-title">1000 元和 910 元，哪一邊比較多？</h2>
    <div class="money-scene">
      <div class="money-card"><h3>左邊</h3>${placeBoard(1000, "money-left", true)}<p class="money-total">1000 元</p></div>
      <div class="money-card"><h3>右邊</h3>${placeBoard(910, "money-right", true)}<p class="money-total">910 元</p></div>
    </div>
    ${comparisonFlow()}
    ${choiceButtons(">", "money-answer", "feedback-money")}
    <p id="feedback-money" class="feedback" role="status">1000 的千位是 1；910 的千位沒有數字。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="9">
    <p class="slide-kicker">學校圖書館｜7 月到 12 月借閱統計</p>
    <h2 class="big-question">哪一個月借書最多？哪一個月最少？</h2>
    <div id="library-maxmin">${libraryTable()}</div>
    ${comparisonFlow()}
    <div class="step-panel"><button class="action-button" type="button" data-table-reveal="maxmin">顯示比較提示</button></div>
    <div id="maxmin-answer" class="table-prompt" hidden>
      <div class="answer-card">最多：<strong>10 月</strong></div>
      <div class="answer-card">最少：<strong>9 月</strong></div>
    </div>
    <p id="feedback-maxmin" class="feedback" role="status">先看每個數的千位。千位都是 1，再看百位。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="10">
    <p class="slide-kicker">學校圖書館｜繼續看借閱統計</p>
    <h2 class="big-question">哪些月份借閱的書超過 1200 本？</h2>
    <p class="question-focus"><strong>超過 1200 本</strong>＝比 1200 本多</p>
    <div id="library-over">${libraryTable()}</div>
    ${comparisonFlow()}
    <div class="step-panel"><button class="action-button" type="button" data-table-reveal="over">顯示答案</button></div>
    <p id="feedback-over" class="feedback" role="status">一次看一個月份。先比較千位，再比較百位。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="11">
    <p class="slide-kicker">學校圖書館｜10 月的十位數字看不清楚</p>
    <h2 class="big-question">18□1：□ 填什麼時最小？填什麼時最大？</h2>
    ${customBoard(["1","8","□","1"], "range")}
    ${stepFlow(["先找 □ 在哪一位", "□ 在十位", "填 0 最小，填 9 最大"])}
    <div class="step-panel"><button class="action-button" type="button" data-table-reveal="range">顯示最小與最大</button></div>
    <div id="range-answer" class="range-line" hidden>
      <span class="range-value">最小 1801</span><span class="range-arrow">到</span><span class="range-value">最大 1891</span>
    </div>
    <p id="feedback-range" class="feedback" role="status">□ 在十位。放 0 最小，放 9 最大。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="12">
    <p class="slide-kicker">排序示範｜由小到大</p>
    <h2 class="question-title">把 4 個數由小到大排列</h2>
    <div id="sort-demo-list" class="sort-board-list">
      ${[1094,1105,1232,1270].map(number => `<div class="sort-item" data-sort-demo-number="${number}"><strong>${number}</strong>${placeBoard(number, `sort-${number}`, true)}</div>`).join("")}
    </div>
    ${comparisonFlow()}
    <div class="step-panel"><button class="action-button" type="button" data-sort-demo data-step="0">顯示第 1 個提示</button></div>
    <div id="sort-demo-order" class="sort-order">步驟 1：先看千位。</div>
  </article>`,

  () => `<article class="slide" data-slide-number="13">
    <p class="slide-kicker">第三層：應用｜由小到大排列</p>
    <h2 class="question-title">把 3 個數由小到大排列</h2>
    <div class="sort-board-list three">
      ${[1357,1094,1270].map(number => `<div class="sort-item"><strong>${number}</strong>${placeBoard(number, `practice-${number}`, true)}</div>`).join("")}
    </div>
    ${comparisonFlow()}
    <div id="sort-practice" class="choice-row" data-order="1094,1270,1357" data-selected="">
      ${[1357,1094,1270].map(number => `<button class="number-choice" type="button" data-sort-value="${number}">${number}</button>`).join("")}
    </div>
    <div id="sort-practice-order" class="sort-order">尚未選擇</div>
    <p id="feedback-sort" class="feedback" role="status">先看千位。千位都是 1，再看百位。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="14">
    <p class="slide-kicker">班級活動｜抽數字卡比大小</p>
    <h2 class="question-title">怎麼用數字卡比大小？</h2>
    <div class="application-box">
      <h3>兩人一組，每人使用 0～9 數字卡</h3>
      <ol class="steps">
        <li>① 抽一張卡，放進千位定位板。</li>
        <li>② 排出一個 2000 以內的數。</li>
        <li>③ 從千位開始比較。</li>
        <li>④ 比較大的數獲得 1 分。</li>
      </ol>
    </div>
    <p class="memory-tip">教師提示：先使用固定的 1 當千位，再逐步增加選擇。</p>
  </article>`,

  () => `<article class="slide" data-slide-number="15">
    <p class="slide-kicker">生活應用｜買比較便宜的物品</p>
    <h2 class="question-title">1290 元和 1320 元，哪一個比較便宜？</h2>
    ${comparisonView(1290, 1320, "price", true)}
    ${comparisonFlow()}
    ${compareControls(1290, 1320, "price", "price-step")}
    <div class="choice-row" aria-label="選擇比較便宜的價格">
      <button class="number-choice" type="button" data-life-choice="1290" data-answer="1290">1290 元</button>
      <button class="number-choice" type="button" data-life-choice="1320" data-answer="1290">1320 元</button>
    </div>
  </article>`,

  () => `<article class="slide" data-slide-number="16">
    <p class="slide-kicker">今天學到什麼</p>
    <h2>比較與排序的固定步驟</h2>
    <ol class="steps">
      <li class="active">① 把數字放進千、百、十、個定位板。</li>
      <li>② 從千位開始比較。</li>
      <li>③ 兩邊一樣，才比較下一位。</li>
      <li>④ 找到不同的位值，就可以停止。</li>
    </ol>
    <div class="summary-grid">
      <div class="summary-card"><h3>比大小</h3><p>選擇 ＞、＜、＝。</p></div>
      <div class="summary-card"><h3>由小到大</h3><p>先找最小，再找下一個。</p></div>
    </div>
  </article>`
];

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ visited: [...visited], completed: [...completed] }));
  } catch (_) {}
}

function markCompleted(task) {
  if (!task) return;
  completed.add(task);
  saveProgress();
  renderStatus();
}

function renderStatus() {
  pageLabel.textContent = `第 ${currentSlide + 1} 頁，共 ${slides.length} 頁｜已看 ${visited.size} 頁`;
  scoreLabel.textContent = `已完成 ${completed.size} 個任務`;
}

function clearPlaceHighlights(comparisonId) {
  document.querySelectorAll(`[data-board-id="${comparisonId}-a"] [data-place], [data-board-id="${comparisonId}-b"] [data-place]`)
    .forEach(cell => cell.classList.remove("active-place", "winner-place"));
}

function setupComparisonSteps() {
  document.querySelectorAll("[data-compare-step]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.compareStep;
      const left = Number(button.dataset.left);
      const right = Number(button.dataset.right);
      const leftDigits = numberDigits(left);
      const rightDigits = numberDigits(right);
      const step = Number(button.dataset.step || 0);
      const feedback = document.querySelector(`#feedback-${id}`);
      const relation = document.querySelector(`#relation-${id}`);

      clearPlaceHighlights(id);
      document.querySelectorAll(`[data-board-id="${id}-a"] [data-place="${step}"], [data-board-id="${id}-b"] [data-place="${step}"]`)
        .forEach(cell => cell.classList.add("active-place"));

      const leftDigit = leftDigits[step];
      const rightDigit = rightDigits[step];
      const label = placeLabels[step];
      if (leftDigit === rightDigit) {
        const wording = step === 0 && leftDigit === 0 ? "兩邊的千位都沒有數字" : `${label}都是 ${leftDigit}`;
        feedback.textContent = step === 3 ? `${wording}，兩個數一樣大。` : `${wording}，再看${placeLabels[step + 1]}。`;
        feedback.className = "feedback";
        if (step === 3) {
          relation.textContent = "＝";
          relation.classList.remove("waiting");
          button.disabled = true;
          markCompleted(button.dataset.task);
        } else {
          button.dataset.step = String(step + 1);
          button.textContent = `比較${placeLabels[step + 1]}`;
        }
        return;
      }

      const symbol = leftDigit > rightDigit ? ">" : "<";
      relation.textContent = symbol;
      relation.classList.remove("waiting");
      const winnerBoard = leftDigit > rightDigit ? `${id}-a` : `${id}-b`;
      document.querySelector(`[data-board-id="${winnerBoard}"] td[data-place="${step}"]`)?.classList.add("winner-place");
      feedback.textContent = `${label}：${leftDigit} ${symbol} ${rightDigit}，所以 ${left} ${symbol} ${right}。找到不同，就停止。`;
      feedback.className = "feedback correct";
      button.textContent = "比較完成";
      button.disabled = true;
      markCompleted(button.dataset.task);
    });
  });
}

function setupChoices() {
  document.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => {
      const group = button.closest(".choice-row");
      const feedback = document.querySelector(`#${button.dataset.feedback}`);
      group.querySelectorAll("[data-choice]").forEach(item => item.classList.remove("correct", "wrong"));
      if (button.dataset.choice === button.dataset.answer) {
        button.classList.add("correct");
        feedback.textContent = `答對了：應該填 ${button.dataset.answer}。`;
        feedback.className = "feedback correct";
        group.querySelectorAll("button").forEach(item => item.disabled = true);
        markCompleted(button.dataset.task);
      } else {
        button.classList.add("wrong");
        feedback.textContent = "再看定位板。從千位開始，找到第一個不同的位置。";
        feedback.className = "feedback try-again";
      }
    });
  });
}

function setupTableReveals() {
  document.querySelectorAll("[data-table-reveal]").forEach(button => {
    button.addEventListener("click", () => {
      const type = button.dataset.tableReveal;
      if (type === "maxmin") {
        document.querySelector("#library-maxmin").innerHTML = libraryTable("maxmin");
        document.querySelector("#maxmin-answer").hidden = false;
        document.querySelector("#feedback-maxmin").textContent = "10 月的百位是 8，最多；9 月的百位是 0，最少。";
      }
      if (type === "over") {
        document.querySelector("#library-over").innerHTML = libraryTable("over");
        document.querySelector("#feedback-over").textContent = "超過 1200 本：7 月、8 月、10 月、12 月。";
      }
      if (type === "range") {
        document.querySelector("#range-answer").hidden = false;
        document.querySelector("#feedback-range").textContent = "十位放 0，最小是 1801；十位放 9，最大是 1891。";
      }
      button.textContent = "提示已顯示";
      button.disabled = true;
      markCompleted(`table-${type}`);
    });
  });
}

function setupSortDemo() {
  const button = document.querySelector("[data-sort-demo]");
  if (!button) return;
  const order = document.querySelector("#sort-demo-order");
  button.addEventListener("click", () => {
    const step = Number(button.dataset.step);
    document.querySelectorAll("[data-sort-demo-number]").forEach(item => item.classList.remove("highlight"));
    document.querySelectorAll("#sort-demo-list [data-place]").forEach(cell => cell.classList.remove("active-place"));
    if (step === 0) {
      document.querySelectorAll("#sort-demo-list [data-place='0']").forEach(cell => cell.classList.add("active-place"));
      order.textContent = "千位都是 1。兩邊一樣，再看百位。";
      button.textContent = "顯示第 2 個提示";
      button.dataset.step = "1";
    } else if (step === 1) {
      document.querySelectorAll("#sort-demo-list [data-place='1']").forEach(cell => cell.classList.add("active-place"));
      document.querySelectorAll("[data-sort-demo-number='1094'], [data-sort-demo-number='1105']").forEach(item => item.classList.add("highlight"));
      order.textContent = "百位是 0、1、2、2，所以先排 1094、1105。";
      button.textContent = "顯示第 3 個提示";
      button.dataset.step = "2";
    } else if (step === 2) {
      document.querySelectorAll("[data-board-id='sort-1232'] [data-place='2'], [data-board-id='sort-1270'] [data-place='2']").forEach(cell => cell.classList.add("active-place"));
      document.querySelectorAll("[data-sort-demo-number='1232'], [data-sort-demo-number='1270']").forEach(item => item.classList.add("highlight"));
      order.textContent = "1232 和 1270 的百位一樣，再比十位：3＜7。";
      button.textContent = "顯示完整答案";
      button.dataset.step = "3";
    } else {
      order.innerHTML = `<span class="sort-token">1094</span>＜<span class="sort-token">1105</span>＜<span class="sort-token">1232</span>＜<span class="sort-token">1270</span>`;
      button.textContent = "排序完成";
      button.disabled = true;
      markCompleted("sort-demo");
    }
  });
}

function setupSortPractice() {
  const container = document.querySelector("#sort-practice");
  if (!container) return;
  const correctOrder = container.dataset.order.split(",").map(Number);
  const output = document.querySelector("#sort-practice-order");
  const feedback = document.querySelector("#feedback-sort");
  container.querySelectorAll("[data-sort-value]").forEach(button => {
    button.addEventListener("click", () => {
      const selected = container.dataset.selected ? container.dataset.selected.split(",").filter(Boolean).map(Number) : [];
      const value = Number(button.dataset.sortValue);
      if (value !== correctOrder[selected.length]) {
        feedback.textContent = "這個還不是最小的。請先看千位；一樣，再看百位。";
        feedback.className = "feedback try-again";
        return;
      }
      selected.push(value);
      container.dataset.selected = selected.join(",");
      button.disabled = true;
      output.innerHTML = selected.map(item => `<span class="sort-token">${item}</span>`).join("＜");
      feedback.textContent = selected.length === correctOrder.length ? "答對了：1094＜1270＜1357。" : "正確。再從剩下的數中找最小的。";
      feedback.className = "feedback correct";
      if (selected.length === correctOrder.length) markCompleted("sort-practice");
    });
  });
}

function setupLifeChoice() {
  document.querySelectorAll("[data-life-choice]").forEach(button => {
    button.addEventListener("click", () => {
      const value = button.dataset.lifeChoice;
      const feedback = document.querySelector("#feedback-price");
      if (value === button.dataset.answer) {
        button.classList.add("correct");
        feedback.textContent = "答對了。1290 的百位是 2，1320 的百位是 3，所以 1290 元比較便宜。";
        feedback.className = "feedback correct";
        document.querySelectorAll("[data-life-choice]").forEach(item => item.disabled = true);
        markCompleted("life-price");
      } else {
        feedback.textContent = "再看百位：2 和 3，哪一個比較小？";
        feedback.className = "feedback try-again";
      }
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
  saveProgress();
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  renderStatus();
  renderProgress();
  setupComparisonSteps();
  setupChoices();
  setupTableReveals();
  setupSortDemo();
  setupSortPractice();
  setupLifeChoice();
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
  const readable = [...stage.querySelectorAll("h1, h2, h3, p, li, th, td, caption")]
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
