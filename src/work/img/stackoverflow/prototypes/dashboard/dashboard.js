(function () {
  var RULE_OFFSET = 2;
  var DAILY_COUNT = 28;
  var RANGE_START = new Date(2024, 8, 2);
  var hasNotifiedParent = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function formatDayLabel(dayIndex) {
    var date = new Date(RANGE_START);
    date.setDate(date.getDate() + dayIndex);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function getNearestIndex(x, snapX) {
    var nearest = 0;
    var minDist = Infinity;

    for (var i = 0; i < snapX.length; i += 1) {
      var dist = Math.abs(x - snapX[i]);
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

  function buildSnapX(plotWidth) {
    var snapX = [];
    for (var day = 0; day < DAILY_COUNT; day += 1) {
      snapX.push((plotWidth / (DAILY_COUNT - 1)) * day);
    }
    return snapX;
  }

  function interpolateFields(anchors, fraction, fields) {
    var index = clamp(fraction, 0, anchors.length - 1);
    var lower = Math.floor(index);
    var upper = Math.min(lower + 1, anchors.length - 1);
    var amount = index - lower;
    var start = anchors[lower];
    var end = anchors[upper];
    var point = {};

    for (var i = 0; i < fields.length; i += 1) {
      var field = fields[i];
      var deltaField = field + "Delta";
      var trendField = field + "Trend";
      var delta = lerp(start[deltaField], end[deltaField], amount);
      point[field] = Math.round(lerp(start[field], end[field], amount));
      point[deltaField] = normalizeDelta(delta);
      point[trendField] = trendFromDelta(delta);
    }

    return point;
  }

  function buildDailyFromAnchors(anchors, fields, overrides) {
    var series = [];

    for (var i = 0; i < DAILY_COUNT; i += 1) {
      var fraction = (i / (DAILY_COUNT - 1)) * (anchors.length - 1);
      var point = interpolateFields(anchors, fraction, fields);
      point.label = formatDayLabel(i);
      series.push(point);
    }

    if (overrides) {
      Object.keys(overrides).forEach(function (key) {
        var dayIndex = Number(key);
        series[dayIndex] = Object.assign({}, series[dayIndex], overrides[key], {
          label: formatDayLabel(dayIndex),
        });
      });
    }

    return series;
  }

  function formatDuration(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return minutes + "min " + seconds + "sec";
  }

  function updateDelta(el, trend, delta) {
    var icon = el.querySelector(".so-dashboard__delta-icon img");
    var value = el.querySelector(".so-dashboard__delta-value");

    el.classList.remove("so-dashboard__delta--up", "so-dashboard__delta--down");
    el.classList.add(trend === "up" ? "so-dashboard__delta--up" : "so-dashboard__delta--down");
    icon.src = trend === "up" ? "img/icon-arrow-up.svg" : "img/icon-arrow-down.svg";
    icon.style.transform = "";
    value.textContent = delta + "%";
  }

  function notifyParent() {
    if (hasNotifiedParent || window.parent === window) {
      return;
    }

    hasNotifiedParent = true;
    window.parent.postMessage({ type: "dante-html-embed-interacted" }, "*");
  }

  function formatCount(value) {
    return value.toLocaleString("en-US");
  }

  function formatPercent(value, total) {
    return Math.round((value / total) * 100) + "%";
  }

  /**
   * Straight port of Launchpad DonutWidget.vue Chart.js behavior.
   * Keep SO data/colors/tooltip content; match Launchpad geometry + hoverOffset.
   */
  function initDonutChart() {
    var chartRoot = document.querySelector('[data-chart="answer-ratio"]');
    if (!chartRoot || typeof Chart === "undefined") {
      return;
    }

    var canvas = chartRoot.querySelector(".so-dashboard__donut-canvas");
    var tooltip = chartRoot.querySelector(".so-dashboard__donut-tooltip");
    var tooltipName = document.getElementById("so-donut-tooltip-name");
    var tooltipCount = document.getElementById("so-donut-tooltip-count");
    var tooltipPct = document.getElementById("so-donut-tooltip-pct");
    var legendButtons = chartRoot.parentElement.querySelectorAll(".so-dashboard__legend-button");

    var segments = [
      { id: "accepted", label: "Accepted", value: 2811, color: "#00c950" },
      { id: "answered", label: "Answered", value: 541, color: "#00a6f4" },
      { id: "unanswered", label: "Unanswered", value: 1609, color: "#ffd230" },
    ];

    var total = segments.reduce(function (sum, segment) {
      return sum + segment.value;
    }, 0);

    // Launchpad: single activeSegmentIndex (hover). We also keep pin for legend buttons.
    var activeSegmentIndex = null;
    var pinnedIndex = null;
    var chart;

    function getActiveIndex() {
      if (activeSegmentIndex != null) {
        return activeSegmentIndex;
      }
      return pinnedIndex;
    }

    // Mirror DonutWidget chartConfig computed
    function buildDataset(activeIndex) {
      return {
        data: segments.map(function (segment) {
          return segment.value;
        }),
        backgroundColor: segments.map(function (segment, index) {
          if (activeIndex === null) {
            return segment.color;
          }
          return index === activeIndex ? segment.color : segment.color + "40";
        }),
        borderWidth: 3,
        borderColor: segments.map(function (segment, index) {
          return activeIndex === index ? segment.color : "#FFFFFF";
        }),
        borderRadius: 0,
        hoverOffset: 12,
      };
    }

    // Mirror DonutWidget tooltipPosition computed
    function positionTooltip(activeIndex) {
      var meta = chart.getDatasetMeta(0);
      var arc = meta.data[activeIndex];
      if (!arc) {
        return;
      }

      var props = arc.getProps(["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius"], true);
      var midAngle = (props.startAngle + props.endAngle) / 2;
      var offsetDistance = (props.innerRadius + props.outerRadius) / 2;
      var tipX = props.x + Math.cos(midAngle) * offsetDistance;
      var tipY = props.y + Math.sin(midAngle) * offsetDistance;
      var tooltipW = 120;
      var tooltipH = 44;
      var pad = 4;

      tipX = Math.max(pad, Math.min(tipX, chart.width - tooltipW - pad));
      tipY = Math.max(pad, Math.min(tipY, chart.height - tooltipH - pad));

      tooltip.style.left = tipX + "px";
      tooltip.style.top = tipY + "px";
    }

    function applyDataset(activeIndex) {
      var dataset = buildDataset(activeIndex);
      var current = chart.data.datasets[0];

      current.data = dataset.data;
      current.backgroundColor = dataset.backgroundColor;
      current.borderWidth = dataset.borderWidth;
      current.borderColor = dataset.borderColor;
      current.borderRadius = dataset.borderRadius;
      current.hoverOffset = dataset.hoverOffset;
    }

    function renderState() {
      var activeIndex = getActiveIndex();
      var isIsolated = activeIndex != null;

      applyDataset(activeIndex);

      // Chart.js applies hoverOffset only to active elements (Launchpad relies on
      // native hover; we set them explicitly so legend pin gets the same offset).
      if (isIsolated) {
        chart.setActiveElements([{ datasetIndex: 0, index: activeIndex }]);
      } else {
        chart.setActiveElements([]);
      }

      chart.update();

      legendButtons.forEach(function (button, index) {
        var isActive = activeIndex === index;
        var isPinned = pinnedIndex === index;
        button.classList.toggle("is-faded", isIsolated && !isActive);
        button.setAttribute("aria-pressed", isPinned ? "true" : "false");
      });

      if (!isIsolated) {
        tooltip.classList.remove("is-active");
        tooltip.setAttribute("aria-hidden", "true");
        return;
      }

      var segment = segments[activeIndex];
      tooltipName.textContent = segment.label;
      tooltipCount.textContent = formatCount(segment.value);
      tooltipPct.textContent = formatPercent(segment.value, total);
      positionTooltip(activeIndex);
      tooltip.classList.add("is-active");
      tooltip.setAttribute("aria-hidden", "false");
    }

    chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: segments.map(function (segment) {
          return segment.label;
        }),
        datasets: [buildDataset(null)],
      },
      // Mirror DonutWidget chartOptions
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "62%",
        layout: {
          padding: 14,
        },
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        onHover: function (event, elements) {
          var nextIndex = elements.length ? elements[0].index : null;
          if (nextIndex === activeSegmentIndex) {
            return;
          }
          if (nextIndex != null) {
            notifyParent();
          }
          activeSegmentIndex = nextIndex;
          renderState();
        },
      },
    });

    chartRoot.addEventListener("mouseleave", function () {
      activeSegmentIndex = null;
      renderState();
    });

    legendButtons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        notifyParent();
        pinnedIndex = pinnedIndex === index ? null : index;
        renderState();
      });
    });

    renderState();
  }

  function initChart(options) {
    var hitarea = document.querySelector(options.hitareaSelector);
    if (!hitarea) {
      return;
    }

    var plotWidth = 0;
    var snapX = [];
    var flipThreshold = 0;
    var series = options.series;
    var hover = hitarea.querySelector(".so-dashboard__hover");
    var activeIndex = -1;
    var pointerInside = false;
    var lastPointerX = 0;
    var keyboardIndex = null;

    function rebuildGeometry() {
      plotWidth = hitarea.clientWidth || options.plotWidth || 0;
      snapX = buildSnapX(plotWidth);
      flipThreshold = plotWidth * options.flipRatio;
      if (lastPointerX === 0) {
        lastPointerX = plotWidth / 2;
      }
    }

    rebuildGeometry();

    function resolveHover(pointerX, forcedKeyboardIndex) {
      var x = clamp(pointerX, 0, plotWidth);
      var dataIndex = forcedKeyboardIndex != null ? forcedKeyboardIndex : getNearestIndex(x, snapX);
      var ruleX = forcedKeyboardIndex != null ? snapX[dataIndex] : x;

      return {
        x: ruleX,
        dataIndex: dataIndex,
        data: series[dataIndex],
        flip: ruleX > flipThreshold,
      };
    }

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
      options.render(state.data);
    }

    function resolveAndRender(pointerX, show, forcedKeyboardIndex) {
      if (show) {
        notifyParent();
      }
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

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(function () {
        rebuildGeometry();
      }).observe(hitarea);
    }
  }

  var activityAnchors = [
    { questions: 178, questionsDelta: 8, answers: 192, answersDelta: 4 },
    { questions: 172, questionsDelta: -5, answers: 165, answersDelta: -12 },
    { questions: 196, questionsDelta: 10, answers: 175, answersDelta: 5 },
    { questions: 188, questionsDelta: -4, answers: 195, answersDelta: 8 },
    { questions: 204, questionsDelta: 32, answers: 201, answersDelta: 6 },
    { questions: 210, questionsDelta: 15, answers: 198, answersDelta: -2 },
    { questions: 190, questionsDelta: -8, answers: 205, answersDelta: 4 },
    { questions: 185, questionsDelta: -3, answers: 215, answersDelta: 8 },
    { questions: 195, questionsDelta: 3, answers: 198, answersDelta: -2 },
  ];

  // SVG path shapes roughly: high → mid → peak → mid → high (seconds for TTA)
  var ttaAnchors = [
    { value: 780, valueDelta: 4 },
    { value: 720, valueDelta: -6 },
    { value: 860, valueDelta: 8 },
    { value: 790, valueDelta: -3 },
    { value: 900, valueDelta: 6 },
  ];

  var votesAnchors = [
    { value: 72, valueDelta: 5 },
    { value: 58, valueDelta: -8 },
    { value: 84, valueDelta: 12 },
    { value: 66, valueDelta: -4 },
    { value: 78, valueDelta: -11 },
  ];

  var commentsAnchors = [
    { value: 70, valueDelta: 3 },
    { value: 55, valueDelta: -9 },
    { value: 82, valueDelta: 10 },
    { value: 64, valueDelta: -5 },
    { value: 75, valueDelta: -8 },
  ];

  function initAllCharts() {
    var activitySeries = buildDailyFromAnchors(activityAnchors, ["questions", "answers"], {
      14: {
        questions: 204,
        questionsDelta: 32,
        questionsTrend: "up",
        answers: 201,
        answersDelta: 6,
        answersTrend: "up",
      },
    });

    var ttaSeries = buildDailyFromAnchors(ttaAnchors, ["value"]);
    var votesSeries = buildDailyFromAnchors(votesAnchors, ["value"]);
    var commentsSeries = buildDailyFromAnchors(commentsAnchors, ["value"]);

    initChart({
      hitareaSelector: '[data-chart="activity"]',
      plotWidth: 801,
      flipRatio: 0.75,
      series: activitySeries,
      render: function (data) {
        document.getElementById("so-activity-tooltip-date").textContent = data.label;
        document.getElementById("so-activity-questions-label").textContent = data.questions + " questions";
        document.getElementById("so-activity-answers-label").textContent = data.answers + " answers";
        updateDelta(document.getElementById("so-activity-questions-delta"), data.questionsTrend, data.questionsDelta);
        updateDelta(document.getElementById("so-activity-answers-delta"), data.answersTrend, data.answersDelta);
      },
    });

    initChart({
      hitareaSelector: '[data-chart="tta"]',
      plotWidth: 351,
      flipRatio: 0.5,
      series: ttaSeries,
      render: function (data) {
        document.getElementById("so-tta-tooltip-date").textContent = data.label;
        document.getElementById("so-tta-value-label").textContent = formatDuration(data.value);
        updateDelta(document.getElementById("so-tta-delta"), data.valueTrend, data.valueDelta);
      },
    });

    initChart({
      hitareaSelector: '[data-chart="votes"]',
      plotWidth: 211,
      flipRatio: 0.5,
      series: votesSeries,
      render: function (data) {
        document.getElementById("so-votes-tooltip-date").textContent = data.label;
        document.getElementById("so-votes-value-label").textContent = data.value + " votes";
        updateDelta(document.getElementById("so-votes-delta"), data.valueTrend, data.valueDelta);
      },
    });

    initChart({
      hitareaSelector: '[data-chart="comments"]',
      plotWidth: 211,
      flipRatio: 0.5,
      series: commentsSeries,
      render: function (data) {
        document.getElementById("so-comments-tooltip-date").textContent = data.label;
        document.getElementById("so-comments-value-label").textContent = data.value + " comments";
        updateDelta(document.getElementById("so-comments-delta"), data.valueTrend, data.valueDelta);
      },
    });

    initDonutChart();
  }

  function reportHeightToParent() {
    var root = document.querySelector(".so-dashboard");
    if (!root || !window.parent || window.parent === window) {
      return;
    }

    var height = Math.ceil(root.getBoundingClientRect().height);
    if (height < 1) {
      return;
    }

    window.parent.postMessage(
      {
        type: "dante-html-embed-resize",
        height: height,
      },
      "*"
    );
  }

  function initHeightReporter() {
    reportHeightToParent();

    window.addEventListener("load", reportHeightToParent);
    window.addEventListener("resize", reportHeightToParent);

    var root = document.querySelector(".so-dashboard");
    if (root && typeof ResizeObserver !== "undefined") {
      new ResizeObserver(reportHeightToParent).observe(root);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initAllCharts();
      initHeightReporter();
    });
  } else {
    initAllCharts();
    initHeightReporter();
  }
})();
