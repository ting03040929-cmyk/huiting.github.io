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
      note: "上課用簡報 1 份｜學生自習準備中",
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
          id: "student-self-study-2000",
          kind: "self-study",
          order: 2,
          title: "2000 以內的數學生自習",
          source: "教材準備中",
          enabled: false,
          status: "準備中"
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
