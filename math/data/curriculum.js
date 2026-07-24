window.MATH_CURRICULUM = {
  title: "數學學習站",
  semesters: [
    {
      id: "first",
      title: "第一學期",
      description: "先認識 1000 與 2000 以內的數。",
      unitIds: ["number-1000", "number-2000"]
    },
    {
      id: "second",
      title: "第二學期",
      description: "把數學用在時間與生活中的練習。",
      unitIds: ["clock", "division"]
    }
  ],
  units: [
    {
      id: "number-1000",
      title: "1000以內的數",
      icon: "數",
      color: "blue",
      enabled: true,
      note: "共 6 份教材｜目前完成 6 份",
      lessons: [
        {
          id: "count-to-1000",
          order: 1,
          title: "數到1000",
          source: "01_數到1000.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-01-count-to-1000/index.html"
        },
        {
          id: "place-value",
          order: 2,
          title: "百、十、個與位值",
          source: "02_百十個與位值.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-02-place-value/index.html"
        },
        {
          id: "money-exchange",
          order: 3,
          title: "認識錢幣與換錢",
          source: "03_認識錢幣與換錢.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-03-money-exchange/index.html"
        },
        {
          id: "pay-exactly",
          order: 4,
          title: "數錢與剛好付錢",
          source: "04_數錢與剛好付錢.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-04-pay-exactly/index.html"
        },
        {
          id: "compare-review",
          order: 5,
          title: "數字比大小與總複習",
          source: "05_數字比大小與總複習.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-05-compare-review/index.html"
        },
        {
          id: "student-self-study",
          order: 6,
          title: "1000 以內的數學生自學",
          source: "1000.html",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/student-self-study/index.html"
        }
      ]
    },
    {
      id: "number-2000",
      title: "2000 以內的數",
      icon: "2K",
      color: "green",
      enabled: true,
      note: "上課用簡報 4 份｜學生自習 1 份",
      lessons: [
        {
          id: "recognize-1000-2000",
          kind: "presentation",
          order: 1,
          title: "認識 1000 與 2000",
          source: "01_認識1000與2000.pptx",
          enabled: true,
          status: "可以上課",
          href: "lessons/number-2000/lesson-01-recognize-1000-2000/index.html"
        },
        {
          id: "place-value-reading-writing",
          kind: "presentation",
          order: 2,
          title: "位值與數的讀寫",
          source: "02_位值與數的讀寫.pptx",
          enabled: true,
          status: "可以上課",
          href: "lessons/number-2000/lesson-02-place-value-reading-writing/index.html"
        },
        {
          id: "compare-order",
          kind: "presentation",
          order: 3,
          title: "比大小與排序",
          source: "03_比大小與排序.pptx",
          enabled: true,
          status: "可以上課",
          href: "lessons/number-2000/lesson-03-compare-order/index.html"
        },
        {
          id: "student-self-study-2000",
          kind: "self-study",
          order: 4,
          title: "積木數數定位板",
          source: "學生自學互動教材",
          enabled: true,
          status: "可以練習",
          href: "lessons/number-2000/student-self-study/index.html"
        },
        {
          id: "comprehensive-practice",
          kind: "presentation",
          order: 5,
          title: "綜合練習",
          source: "05_綜合練習.pptx",
          enabled: true,
          status: "可以練習",
          href: "lessons/number-2000/lesson-05-comprehensive-practice/index.html"
        }
      ]
    },
    {
      id: "clock",
      title: "認識整點與半點",
      icon: "時",
      color: "purple",
      enabled: true,
      note: "互動練習：整點、半點、混合題型",
      lessons: [
        {
          id: "lesson-01-clock-mixed",
          order: 1,
          title: "整點與半點混合練習",
          source: "互動式網頁教材",
          enabled: true,
          status: "可以練習",
          href: "lessons/clock/lesson-01-clock-mixed/index.html"
        }
      ]
    },
    {
      id: "division",
      title: "除法",
      icon: "÷",
      color: "orange",
      enabled: true,
      note: "目前 1 課",
      lessons: [
        { id: "lesson-01", order: 1, title: "認識平分與除法", source: "除法1.pptx", enabled: true, status: "可以學習" }
      ]
    }
  ]
};
window.MATH_CURRICULUM = {
  title: "數學學習站",
  units: [
    {
      id: "number-1000",
      title: "1000以內的數",
      icon: "數",
      color: "blue",
      enabled: true,
      note: "共 6 份教材｜目前完成 6 份",
      lessons: [
        {
          id: "count-to-1000",
          order: 1,
          title: "數到1000",
          source: "01_數到1000.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-01-count-to-1000/index.html"
        },
        {
          id: "place-value",
          order: 2,
          title: "百、十、個與位值",
          source: "02_百十個與位值.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-02-place-value/index.html"
        },
        {
          id: "money-exchange",
          order: 3,
          title: "認識錢幣與換錢",
          source: "03_認識錢幣與換錢.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-03-money-exchange/index.html"
        },
        {
          id: "pay-exactly",
          order: 4,
          title: "數錢與剛好付錢",
          source: "04_數錢與剛好付錢.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-04-pay-exactly/index.html"
        },
        {
          id: "compare-review",
          order: 5,
          title: "數字比大小與總複習",
          source: "05_數字比大小與總複習.pptx",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/lesson-05-compare-review/index.html"
        },
        {
          id: "student-self-study",
          order: 6,
          title: "1000 以內的數學生自學",
          source: "1000.html",
          enabled: true,
          status: "可以學習",
          href: "lessons/number-1000/student-self-study/index.html"
        }
      ]
    },
    {
      id: "number-2000",
      title: "2000 以內的數",
      icon: "2K",
      color: "green",
      enabled: true,
      note: "上課用簡報 4 份｜學生自習 1 份",
      lessons: [
        {
          id: "recognize-1000-2000",
          kind: "presentation",
          order: 1,
          title: "認識 1000 與 2000",
          source: "01_認識1000與2000.pptx",
          enabled: true,
          status: "可以上課",
          href: "lessons/number-2000/lesson-01-recognize-1000-2000/index.html"
        },
        {
          id: "place-value-reading-writing",
          kind: "presentation",
          order: 2,
          title: "位值與數的讀寫",
          source: "02_位值與數的讀寫.pptx",
          enabled: true,
          status: "可以上課",
          href: "lessons/number-2000/lesson-02-place-value-reading-writing/index.html"
        },
        {
          id: "compare-order",
          kind: "presentation",
          order: 3,
          title: "比大小與排序",
          source: "03_比大小與排序.pptx",
          enabled: true,
          status: "可以上課",
          href: "lessons/number-2000/lesson-03-compare-order/index.html"
        },
        {
          id: "student-self-study-2000",
          kind: "self-study",
          order: 4,
          title: "積木數數定位板",
          source: "學生自學互動教材",
          enabled: true,
          status: "可以練習",
          href: "lessons/number-2000/student-self-study/index.html"
        },
        {
          id: "comprehensive-practice",
          kind: "presentation",
          order: 5,
          title: "綜合練習",
          source: "05_綜合練習.pptx",
          enabled: true,
          status: "可以練習",
          href: "lessons/number-2000/lesson-05-comprehensive-practice/index.html"
        }
      ]
    },
    {
      id: "division",
      title: "除法",
      icon: "÷",
      color: "orange",
      enabled: true,
      note: "目前 1 課",
      lessons: [
        { id: "lesson-01", order: 1, title: "認識平分與除法", source: "除法1.pptx", enabled: true, status: "可以學習" }
      ]
    }
  ]
};
