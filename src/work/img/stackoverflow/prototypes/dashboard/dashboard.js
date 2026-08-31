(function () {
  var PLOT_WIDTH = 801;
  var RULE_OFFSET = 2;
  var FLIP_THRESHOLD = PLOT_WIDTH * 0.75;
  var DAILY_COUNT = 28;
  var RANGE_START = new Date(2024, 8, 2);

  var anchorData = [
    {
      questions: 178,
      questionsDelta: 8,
      questionsTrend: "up",
      answers: 192,
      answersDelta: 4,
      answersTrend: "up",
    },
    {
      questions: 172,
      questionsDelta: 5,
      questionsTrend: "down",
      answers: 165,
      answersDelta: 12,
      answersTrend: "down",
    },
    {
      questions: 196,
      questionsDelta: 10,
      questionsTrend: "up",
      answers: 175,
      answersDelta: 5,
      answersTrend: "up",
    },
    {
      questions: 188,
      questionsDelta: 4,
      questionsTrend: "down",
      answers: 195,
      answersDelta: 8,
      answersTrend: "up",
    },
    {
      questions: 204,
      questionsDelta: 32,
      questionsTrend: "up",
      answers: 201,
      answersDelta: 6,
      answersTrend: "up",
    },
    {
      questions: 210,
      questionsDelta: 15,
      questionsTrend: "up",
      answers: 198,
      answersDelta: 2,
      answersTrend: "down",
    },
    {
      questions: 190,
      questionsDelta: 8,
      questionsTrend: "down",
      answers: 205,
      answersDelta: 4,
      answersTrend: "up",
    },
    {
      questions: 185,
      questionsDelta: 3,
      questionsTrend: "down",
      answers: 215,
      answersDelta: 8,
      answersTrend: "up",
    },
    {
      questions: 195,
      questionsDelta: 3,
      questionsTrend: "up",
      answers: 198,
      answersDelta: 2,
      answersTrend: "down",
    },
  ];

  var SNAP_X = [];
  var dailyData = [];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function formatDayLabel(dayIndex) {
    var date = new Date(RANGE_START);
    date.setDate(date.getDate() + dayIndex);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function getNearestIndex(x) {
    var nearest = 0;
    var minDist = Infinity;

    for (var i = 0; i < SNAP_X.length; i += 1) {
      var dist = Math.abs(x - SNAP_X[i]);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }

    return nearest;
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function trendFromDelta(delta) {
    return delta >= 0 ? "up" : "down";
  }

  function normalizeDelta(delta) {
    return Math.max(0, Math.round(Math.abs(delta)));
  }

  function interpolatePoint(series, fraction, label) {
    var index = clamp(fraction, 0, series.length - 1);
    var lower = Math.floor(index);
    var upper = Math.min(lower + 1, series.length - 1);
    var amount = index - lower;
    var start = series[lower];
    var end = series[upper];
    var questionsDelta = lerp(start.questionsDelta, end.questionsDelta, amount);
    var answersDelta = lerp(start.answersDelta, end.answersDelta, amount);

    return {
      label: label,
      questions: Math.round(lerp(start.questions, end.questions, amount)),
      questionsDelta: normalizeDelta(questionsDelta),
      questionsTrend: trendFromDelta(questionsDelta),
      answers: Math.round(lerp(start.answers, end.answers, amount)),
      answersDelta: normalizeDelta(answersDelta),
      answersTrend: trendFromDelta(answersDelta),
    };
  }

  function buildDailySeries() {
    SNAP_X = [];
    dailyData = [];

    for (var day = 0; day < DAILY_COUNT; day += 1) {
      SNAP_X.push((PLOT_WIDTH / (DAILY_COUNT - 1)) * day);
    }

    for (var i = 0; i < DAILY_COUNT; i += 1) {
      var fraction = (i / (DAILY_COUNT - 1)) * (anchorData.length - 1);
      dailyData.push(interpolatePoint(anchorData, fraction, formatDayLabel(i)));
    }

    dailyData[14] = {
      label: formatDayLabel(14),
      questions: 204,
      questionsDelta: 32,
      questionsTrend: "up",
      answers: 201,
      answersDelta: 6,
      answersTrend: "up",
    };
  }

  function resolveHover(pointerX, keyboardIndex) {
    var x = clamp(pointerX, 0, PLOT_WIDTH);
    var dataIndex = keyboardIndex != null ? keyboardIndex : getNearestIndex(x);
    var ruleX = keyboardIndex != null ? SNAP_X[dataIndex] : x;

    return {
      x: ruleX,
      dataIndex: dataIndex,
      data: dailyData[dataIndex],
      flip: ruleX > FLIP_THRESHOLD,
    };
  }

  function updateDelta(el, trend, delta) {
    var icon = el.querySelector(".so-dashboard__delta-icon img");
    var value = el.querySelector(".so-dashboard__delta-value");

    el.classList.remove("so-dashboard__delta--up", "so-dashboard__delta--down");
    el.classList.add(trend === "up" ? "so-dashboard__delta--up" : "so-dashboard__delta--down");
    icon.src = trend === "up" ? "img/icon-arrow-up.svg" : "img/icon-arrow-down.svg";
    icon.style.transform = trend === "down" ? "none" : "";
    value.textContent = delta + "%";
  }

  function initActivityChart() {
    buildDailySeries();

    var hitarea = document.querySelector(".so-dashboard__plot-hitarea");
    if (!hitarea) {
      return;
    }

    var hover = hitarea.querySelector(".so-dashboard__hover");
    var tooltipDate = document.getElementById("so-activity-tooltip-date");
    var questionsLabel = document.getElementById("so-activity-questions-label");
    var answersLabel = document.getElementById("so-activity-answers-label");
    var questionsDelta = document.getElementById("so-activity-questions-delta");
    var answersDelta = document.getElementById("so-activity-answers-delta");

    var activeIndex = -1;
    var pointerInside = false;
    var lastPointerX = PLOT_WIDTH / 2;
    var keyboardIndex = null;

    function renderHover(state, show) {
      if (!show || !state) {
        hover.classList.remove("is-active");
        hover.setAttribute("aria-hidden", "true");
        activeIndex = -1;
        keyboardIndex = null;
        return;
      }

      activeIndex = state.dataIndex;

      hover.style.left = state.x - RULE_OFFSET + "px";
      hover.classList.toggle("so-dashboard__hover--flip", state.flip);
      hover.classList.add("is-active");
      hover.setAttribute("aria-hidden", "false");

      tooltipDate.textContent = state.data.label;
      questionsLabel.textContent = state.data.questions + " questions";
      answersLabel.textContent = state.data.answers + " answers";
      updateDelta(questionsDelta, state.data.questionsTrend, state.data.questionsDelta);
      updateDelta(answersDelta, state.data.answersTrend, state.data.answersDelta);
    }

    function resolveAndRender(pointerX, show, forcedKeyboardIndex) {
      renderHover(resolveHover(pointerX, forcedKeyboardIndex), show);
    }

    function hideIfIdle() {
      if (!pointerInside && document.activeElement !== hitarea) {
        renderHover(null, false);
      }
    }

    hitarea.addEventListener("pointerenter", function () {
      pointerInside = true;
    });

    hitarea.addEventListener("pointermove", function (event) {
      pointerInside = true;
      keyboardIndex = null;
      var rect = hitarea.getBoundingClientRect();
      lastPointerX = event.clientX - rect.left;
      resolveAndRender(lastPointerX, true, null);
    });

    hitarea.addEventListener("pointerleave", function () {
      pointerInside = false;
      hideIfIdle();
    });

    hitarea.addEventListener("focus", function () {
      if (keyboardIndex == null) {
        keyboardIndex = activeIndex >= 0 ? activeIndex : 0;
      }
      resolveAndRender(lastPointerX, true, keyboardIndex);
    });

    hitarea.addEventListener("blur", function () {
      hideIfIdle();
    });

    hitarea.addEventListener("keydown", function (event) {
      var next = keyboardIndex != null ? keyboardIndex : activeIndex >= 0 ? activeIndex : 0;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        keyboardIndex = Math.min(next + 1, DAILY_COUNT - 1);
        resolveAndRender(lastPointerX, true, keyboardIndex);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        keyboardIndex = Math.max(next - 1, 0);
        resolveAndRender(lastPointerX, true, keyboardIndex);
      } else if (event.key === "Home") {
        event.preventDefault();
        keyboardIndex = 0;
        resolveAndRender(lastPointerX, true, keyboardIndex);
      } else if (event.key === "End") {
        event.preventDefault();
        keyboardIndex = DAILY_COUNT - 1;
        resolveAndRender(lastPointerX, true, keyboardIndex);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initActivityChart);
  } else {
    initActivityChart();
  }
})();
