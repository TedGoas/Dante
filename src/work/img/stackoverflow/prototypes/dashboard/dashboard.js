(function () {
  var RULE_OFFSET = 2;
  var RANGE_END = new Date(2024, 8, 29);
  var dayCount = 28;
  var rangeStart = new Date(2024, 8, 2);
  var hasNotifiedParent = false;
  var currentRangeId = "4w";

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function formatDayLabel(dayIndex) {
    var date = new Date(rangeStart);
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
    var divisor = Math.max(dayCount - 1, 1);
    for (var day = 0; day < dayCount; day += 1) {
      snapX.push((plotWidth / divisor) * day);
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
    var divisor = Math.max(dayCount - 1, 1);

    for (var i = 0; i < dayCount; i += 1) {
      var fraction = (i / divisor) * (anchors.length - 1);
      var point = interpolateFields(anchors, fraction, fields);
      point.label = formatDayLabel(i);
      series.push(point);
    }

    if (overrides) {
      Object.keys(overrides).forEach(function (key) {
        var dayIndex = Number(key);
        if (dayIndex < 0 || dayIndex >= series.length) {
          return;
        }
        series[dayIndex] = Object.assign({}, series[dayIndex], overrides[key], {
          label: formatDayLabel(dayIndex),
        });
      });
    }

    return series;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function formatDuration(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return minutes + "min " + seconds + "sec";
  }

  function formatCount(value) {
    return value.toLocaleString("en-US");
  }

  function formatCompact(value) {
    if (value >= 1000) {
      var thousands = value / 1000;
      var rounded = thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
      return rounded + "K";
    }
    return formatCount(value);
  }

  function formatPercent(value, total) {
    return Math.round((value / total) * 100) + "%";
  }

  function updateDelta(el, trend, delta) {
    if (!el) {
      return;
    }

    var icon = el.querySelector(".so-dashboard__delta-icon img");
    var value = el.querySelector(".so-dashboard__delta-value");

    el.classList.remove("so-dashboard__delta--up", "so-dashboard__delta--down");
    el.classList.add(trend === "up" ? "so-dashboard__delta--up" : "so-dashboard__delta--down");
    if (icon) {
      icon.src = trend === "up" ? "img/icon-arrow-up.svg" : "img/icon-arrow-down.svg";
      icon.style.transform = "";
    }
    if (value) {
      value.textContent = delta + "%";
    }
  }

  function notifyParent() {
    if (hasNotifiedParent || window.parent === window) {
      return;
    }

    hasNotifiedParent = true;
    window.parent.postMessage({ type: "dante-html-embed-interacted" }, "*");
  }

  function buildAxisLabels(labelCount) {
    var labels = [];
    var divisor = Math.max(labelCount - 1, 1);
    var dayDivisor = Math.max(dayCount - 1, 1);

    for (var i = 0; i < labelCount; i += 1) {
      var dayIndex = Math.round((i / divisor) * dayDivisor);
      labels.push(formatDayLabel(dayIndex));
    }

    return labels;
  }

  function setAxisLabels(el, labels) {
    if (!el) {
      return;
    }
    el.textContent = "";
    labels.forEach(function (label) {
      var span = document.createElement("span");
      span.textContent = label;
      el.appendChild(span);
    });
  }

  function setRangeWindow(days) {
    dayCount = days;
    rangeStart = new Date(RANGE_END);
    rangeStart.setDate(rangeStart.getDate() - (days - 1));
  }

  /**
   * Straight port of Launchpad DonutWidget.vue Chart.js behavior.
   * Keep SO data/colors/tooltip content; match Launchpad geometry + hoverOffset.
   */
  function initDonutChart() {
    var chartRoot = document.querySelector('[data-chart="answer-ratio"]');
    if (!chartRoot || typeof Chart === "undefined") {
      return null;
    }

    var canvas = chartRoot.querySelector(".so-dashboard__donut-canvas");
    var tooltip = chartRoot.querySelector(".so-dashboard__donut-tooltip");
    var tooltipName = document.getElementById("so-donut-tooltip-name");
    var tooltipCount = document.getElementById("so-donut-tooltip-count");
    var tooltipPct = document.getElementById("so-donut-tooltip-pct");
    var legendButtons = chartRoot.parentElement.querySelectorAll(".so-dashboard__legend-button");
    var totalEl = document.getElementById("so-donut-total");

    var segments = [
      { id: "accepted", label: "Accepted", value: 2811, color: "#00c950" },
      { id: "answered", label: "Answered", value: 541, color: "#00a6f4" },
      { id: "unanswered", label: "Unanswered", value: 1609, color: "#ffd230" },
    ];

    var total = segments.reduce(function (sum, segment) {
      return sum + segment.value;
    }, 0);

    var activeSegmentIndex = null;
    var pinnedIndex = null;
    var chart;

    function getActiveIndex() {
      if (activeSegmentIndex != null) {
        return activeSegmentIndex;
      }
      return pinnedIndex;
    }

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

    function syncLegend() {
      legendButtons.forEach(function (button) {
        var sliceId = button.getAttribute("data-slice");
        var segment = segments.find(function (item) {
          return item.id === sliceId;
        });
        var valueEl = button.querySelector("[data-slice-value]");
        if (segment && valueEl) {
          valueEl.textContent = formatCount(segment.value);
        }
      });
      if (totalEl) {
        totalEl.textContent = formatCompact(total);
      }
    }

    function renderState(opts) {
      var activeIndex = getActiveIndex();
      var isIsolated = activeIndex != null;
      var shouldAnimate = opts && opts.animate && !prefersReducedMotion();

      applyDataset(activeIndex);

      if (isIsolated) {
        chart.setActiveElements([{ datasetIndex: 0, index: activeIndex }]);
      } else {
        chart.setActiveElements([]);
      }

      chart.options.animation = shouldAnimate
        ? { duration: 650, easing: "easeOutQuart" }
        : false;
      chart.update(shouldAnimate ? "default" : "none");

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
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "62%",
        layout: {
          padding: 14,
        },
        animation: false,
        animations: {
          numbers: {
            type: "number",
            properties: ["circumference", "endAngle", "startAngle"],
          },
        },
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

    syncLegend();
    renderState();

    return {
      setSegments: function (nextSegments) {
        segments = nextSegments.map(function (segment) {
          return Object.assign({}, segment);
        });
        total = segments.reduce(function (sum, segment) {
          return sum + segment.value;
        }, 0);
        activeSegmentIndex = null;
        pinnedIndex = null;
        syncLegend();
        renderState({ animate: true });
      },
    };
  }

  function makeAreaFill(stops) {
    return function (context) {
      var chart = context.chart;
      var area = chart.chartArea;
      if (!area) {
        return stops[0];
      }

      var gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
      var last = stops.length - 1;
      for (var i = 0; i <= last; i += 1) {
        gradient.addColorStop(i / last, stops[i]);
      }
      return gradient;
    };
  }

  var SKY_FILL = makeAreaFill(["rgba(0, 166, 244, 0.3)", "rgba(0, 166, 244, 0.1)", "rgba(0, 166, 244, 0)"]);
  var GRAY_FILL = makeAreaFill(["rgba(161, 161, 161, 0.28)", "rgba(161, 161, 161, 0.1)", "rgba(161, 161, 161, 0)"]);

  function initChart(options) {
    var hitarea = document.querySelector(options.hitareaSelector);
    if (!hitarea) {
      return null;
    }

    var plotWidth = 0;
    var snapX = [];
    var flipThreshold = 0;
    var series = options.series;
    var plot = options.plot;
    var hover = hitarea.querySelector(".so-dashboard__hover");
    var canvas = hitarea.querySelector(".so-dashboard__plot-canvas");
    var lineChart = null;
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

    function syncLineChart(animate) {
      if (!lineChart || !plot) {
        return;
      }

      lineChart.data.labels = PLOT_LABELS;
      options.lineDatasets.forEach(function (dataset, index) {
        lineChart.data.datasets[index].data = plot[dataset.key];
      });

      var shouldAnimate = animate && !prefersReducedMotion();
      lineChart.options.animation = shouldAnimate
        ? { duration: 650, easing: "easeOutQuart" }
        : false;
      lineChart.update(shouldAnimate ? "default" : "none");
    }

    if (canvas && typeof Chart !== "undefined" && options.lineDatasets) {
      lineChart = new Chart(canvas, {
        type: "line",
        data: {
          labels: PLOT_LABELS,
          datasets: options.lineDatasets.map(function (dataset) {
            return {
              data: plot[dataset.key],
              borderColor: dataset.borderColor,
              backgroundColor: dataset.fill,
              fill: true,
              tension: 0,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 0,
              order: dataset.order || 0,
            };
          }),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
          scales: {
            x: {
              display: false,
              grid: { display: false },
            },
            y: {
              display: false,
              min: 0,
              max: options.yMax,
              grid: { display: false },
            },
          },
          layout: {
            padding: 0,
          },
        },
      });
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
      if (!show || !state || !state.data) {
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
      var lastIndex = Math.max(dayCount - 1, 0);

      if (event.key === "ArrowRight") {
        event.preventDefault();
        keyboardIndex = Math.min(next + 1, lastIndex);
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
        keyboardIndex = lastIndex;
        resolveAndRender(lastPointerX, true, keyboardIndex);
      }
    });

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(function () {
        rebuildGeometry();
      }).observe(hitarea);
    }

    return {
      setSeries: function (nextSeries, nextPlot, animate) {
        series = nextSeries;
        plot = nextPlot;
        keyboardIndex = null;
        rebuildGeometry();
        syncLineChart(!!animate);
        if (pointerInside || document.activeElement === hitarea) {
          resolveAndRender(lastPointerX, true, null);
        } else {
          renderHover(null, false);
        }
      },
    };
  }

  var PLOT_LABELS = ["0", "1", "2", "3", "4"];

  // Always five stops; range changes only move Y values so Chart.js morphs vertically.
  var CHART_SHAPES = {
    "7d": {
      activity: [
        { questions: 220, questionsDelta: 14, answers: 140, answersDelta: -10 },
        { questions: 130, questionsDelta: -24, answers: 230, answersDelta: 22 },
        { questions: 250, questionsDelta: 30, answers: 170, answersDelta: -8 },
        { questions: 150, questionsDelta: -18, answers: 255, answersDelta: 16 },
        { questions: 205, questionsDelta: 10, answers: 155, answersDelta: -12 },
      ],
      tta: [
        { value: 520, valueDelta: -8 },
        { value: 780, valueDelta: 12 },
        { value: 610, valueDelta: -6 },
        { value: 840, valueDelta: 10 },
        { value: 560, valueDelta: -4 },
      ],
      votes: [
        { value: 88, valueDelta: 14 },
        { value: 42, valueDelta: -18 },
        { value: 76, valueDelta: 10 },
        { value: 50, valueDelta: -12 },
        { value: 82, valueDelta: 8 },
      ],
      comments: [
        { value: 45, valueDelta: -10 },
        { value: 90, valueDelta: 16 },
        { value: 58, valueDelta: -8 },
        { value: 84, valueDelta: 12 },
        { value: 62, valueDelta: -4 },
      ],
    },
    "4w": {
      activity: [
        { questions: 178, questionsDelta: 8, answers: 192, answersDelta: 4 },
        { questions: 172, questionsDelta: -5, answers: 165, answersDelta: -12 },
        { questions: 204, questionsDelta: 32, answers: 201, answersDelta: 6 },
        { questions: 190, questionsDelta: -8, answers: 205, answersDelta: 4 },
        { questions: 195, questionsDelta: 3, answers: 198, answersDelta: -2 },
      ],
      tta: [
        { value: 780, valueDelta: 4 },
        { value: 720, valueDelta: -6 },
        { value: 860, valueDelta: 8 },
        { value: 790, valueDelta: -3 },
        { value: 900, valueDelta: 6 },
      ],
      votes: [
        { value: 72, valueDelta: 5 },
        { value: 58, valueDelta: -8 },
        { value: 84, valueDelta: 12 },
        { value: 66, valueDelta: -4 },
        { value: 78, valueDelta: -11 },
      ],
      comments: [
        { value: 70, valueDelta: 3 },
        { value: 55, valueDelta: -9 },
        { value: 82, valueDelta: 10 },
        { value: 64, valueDelta: -5 },
        { value: 75, valueDelta: -8 },
      ],
    },
    "3m": {
      activity: [
        { questions: 160, questionsDelta: 3, answers: 200, answersDelta: 6 },
        { questions: 210, questionsDelta: 12, answers: 150, answersDelta: -10 },
        { questions: 145, questionsDelta: -9, answers: 225, answersDelta: 14 },
        { questions: 235, questionsDelta: 16, answers: 170, answersDelta: -5 },
        { questions: 185, questionsDelta: 4, answers: 195, answersDelta: 5 },
      ],
      tta: [
        { value: 820, valueDelta: 5 },
        { value: 640, valueDelta: -10 },
        { value: 750, valueDelta: 4 },
        { value: 880, valueDelta: 8 },
        { value: 660, valueDelta: -8 },
      ],
      votes: [
        { value: 55, valueDelta: -6 },
        { value: 80, valueDelta: 10 },
        { value: 48, valueDelta: -12 },
        { value: 92, valueDelta: 16 },
        { value: 85, valueDelta: 9 },
      ],
      comments: [
        { value: 78, valueDelta: 6 },
        { value: 50, valueDelta: -11 },
        { value: 88, valueDelta: 14 },
        { value: 40, valueDelta: -14 },
        { value: 68, valueDelta: 2 },
      ],
    },
  };

  function plotFromAnchors(anchors, keys) {
    var plot = {};
    keys.forEach(function (key) {
      plot[key] = anchors.map(function (anchor) {
        return anchor[key];
      });
    });
    return plot;
  }

  var RANGE_PRESETS = {
    "7d": {
      id: "7d",
      label: "Last 7 days",
      days: 7,
      phrase: "last 7 days",
      kickerUsers: 2180,
      kickerRep: 98420,
      donut: [
        { id: "accepted", label: "Accepted", value: 520, color: "#00c950" },
        { id: "answered", label: "Answered", value: 310, color: "#00a6f4" },
        { id: "unanswered", label: "Unanswered", value: 560, color: "#ffd230" },
      ],
      ttaSeconds: 552,
      ttaDelta: 4,
      ttaTrend: "up",
      interaction: "4.8",
      interactionDelta: 8,
      interactionTrend: "up",
      pills: {
        answers: { label: "2.1 Answers", delta: 9, trend: "up" },
        comments: { label: "1.6 Comments", delta: 14, trend: "down" },
        votes: { label: "1.1 Votes", delta: 42, trend: "up" },
      },
      activityQuestions: 2140,
      activityQuestionsDelta: 7,
      activityQuestionsTrend: "up",
      activityAnswers: 2680,
      activityAnswersDelta: 2,
      activityAnswersTrend: "down",
      votes: 486,
      votesDelta: 6,
      votesTrend: "down",
      comments: 512,
      commentsDelta: 4,
      commentsTrend: "down",
      activityAxisCount: 7,
    },
    "4w": {
      id: "4w",
      label: "Last 4 weeks",
      days: 28,
      phrase: "last 4 weeks",
      kickerUsers: 7410,
      kickerRep: 432190,
      donut: [
        { id: "accepted", label: "Accepted", value: 2811, color: "#00c950" },
        { id: "answered", label: "Answered", value: 541, color: "#00a6f4" },
        { id: "unanswered", label: "Unanswered", value: 1609, color: "#ffd230" },
      ],
      ttaSeconds: 648,
      ttaDelta: 6,
      ttaTrend: "up",
      interaction: "5.3",
      interactionDelta: 23,
      interactionTrend: "up",
      pills: {
        answers: { label: "2.3 Answers", delta: 22, trend: "up" },
        comments: { label: "1.9 Comments", delta: 31, trend: "down" },
        votes: { label: "1.1 Votes", delta: 121, trend: "up" },
      },
      activityQuestions: 8911,
      activityQuestionsDelta: 12,
      activityQuestionsTrend: "up",
      activityAnswers: 11109,
      activityAnswersDelta: 3,
      activityAnswersTrend: "down",
      votes: 1909,
      votesDelta: 11,
      votesTrend: "down",
      comments: 1909,
      commentsDelta: 11,
      commentsTrend: "down",
      activityAxisCount: 10,
    },
    "3m": {
      id: "3m",
      label: "Last 3 months",
      days: 90,
      phrase: "last 3 months",
      kickerUsers: 18920,
      kickerRep: 1245600,
      donut: [
        { id: "accepted", label: "Accepted", value: 11200, color: "#00c950" },
        { id: "answered", label: "Answered", value: 3100, color: "#00a6f4" },
        { id: "unanswered", label: "Unanswered", value: 3200, color: "#ffd230" },
      ],
      ttaSeconds: 702,
      ttaDelta: 3,
      ttaTrend: "down",
      interaction: "5.1",
      interactionDelta: 11,
      interactionTrend: "up",
      pills: {
        answers: { label: "2.2 Answers", delta: 14, trend: "up" },
        comments: { label: "1.8 Comments", delta: 9, trend: "down" },
        votes: { label: "1.1 Votes", delta: 58, trend: "up" },
      },
      activityQuestions: 28440,
      activityQuestionsDelta: 9,
      activityQuestionsTrend: "up",
      activityAnswers: 35120,
      activityAnswersDelta: 5,
      activityAnswersTrend: "up",
      votes: 6120,
      votesDelta: 8,
      votesTrend: "up",
      comments: 5980,
      commentsDelta: 2,
      commentsTrend: "down",
      activityAxisCount: 10,
    },
  };

  function buildSeriesForRange(preset) {
    var shapes = CHART_SHAPES[preset.id] || CHART_SHAPES["4w"];

    return {
      activity: buildDailyFromAnchors(shapes.activity, ["questions", "answers"]),
      activityPlot: plotFromAnchors(shapes.activity, ["questions", "answers"]),
      tta: buildDailyFromAnchors(shapes.tta, ["value"]),
      ttaPlot: plotFromAnchors(shapes.tta, ["value"]),
      votes: buildDailyFromAnchors(shapes.votes, ["value"]),
      votesPlot: plotFromAnchors(shapes.votes, ["value"]),
      comments: buildDailyFromAnchors(shapes.comments, ["value"]),
      commentsPlot: plotFromAnchors(shapes.comments, ["value"]),
    };
  }

  function applyHeadlineMetrics(preset) {
    var kicker = document.getElementById("so-participation-kicker");
    if (kicker) {
      kicker.textContent =
        formatCount(preset.kickerUsers) +
        " total users earned " +
        formatCount(preset.kickerRep) +
        " reputation in the " +
        preset.phrase +
        ".";
    }

    var ttaMetric = document.getElementById("so-tta-metric");
    if (ttaMetric) {
      ttaMetric.textContent = formatDuration(preset.ttaSeconds);
    }
    updateDelta(document.getElementById("so-tta-card-delta"), preset.ttaTrend, preset.ttaDelta);

    var interactionMetric = document.getElementById("so-interaction-metric");
    if (interactionMetric) {
      interactionMetric.textContent = preset.interaction;
    }
    updateDelta(document.getElementById("so-interaction-delta"), preset.interactionTrend, preset.interactionDelta);

    var pillAnswers = document.getElementById("so-pill-answers");
    var pillComments = document.getElementById("so-pill-comments");
    var pillVotes = document.getElementById("so-pill-votes");
    if (pillAnswers) {
      pillAnswers.textContent = preset.pills.answers.label;
    }
    if (pillComments) {
      pillComments.textContent = preset.pills.comments.label;
    }
    if (pillVotes) {
      pillVotes.textContent = preset.pills.votes.label;
    }
    updateDelta(document.getElementById("so-pill-answers-delta"), preset.pills.answers.trend, preset.pills.answers.delta);
    updateDelta(document.getElementById("so-pill-comments-delta"), preset.pills.comments.trend, preset.pills.comments.delta);
    updateDelta(document.getElementById("so-pill-votes-delta"), preset.pills.votes.trend, preset.pills.votes.delta);

    var questionsMetric = document.getElementById("so-activity-questions-metric");
    var answersMetric = document.getElementById("so-activity-answers-metric");
    if (questionsMetric) {
      questionsMetric.textContent = formatCount(preset.activityQuestions);
    }
    if (answersMetric) {
      answersMetric.textContent = formatCount(preset.activityAnswers);
    }
    updateDelta(
      document.getElementById("so-activity-questions-card-delta"),
      preset.activityQuestionsTrend,
      preset.activityQuestionsDelta
    );
    updateDelta(
      document.getElementById("so-activity-answers-card-delta"),
      preset.activityAnswersTrend,
      preset.activityAnswersDelta
    );

    var votesMetric = document.getElementById("so-votes-metric");
    var commentsMetric = document.getElementById("so-comments-metric");
    if (votesMetric) {
      votesMetric.textContent = formatCount(preset.votes);
    }
    if (commentsMetric) {
      commentsMetric.textContent = formatCount(preset.comments);
    }
    updateDelta(document.getElementById("so-votes-card-delta"), preset.votesTrend, preset.votesDelta);
    updateDelta(document.getElementById("so-comments-card-delta"), preset.commentsTrend, preset.commentsDelta);
  }

  function applyAxisLabels(preset) {
    var activityAxis = document.getElementById("so-activity-xaxis");
    if (activityAxis) {
      activityAxis.classList.toggle("so-dashboard__x-axis--ten", preset.activityAxisCount >= 10);
      setAxisLabels(activityAxis, buildAxisLabels(preset.activityAxisCount));
    }
    setAxisLabels(document.getElementById("so-tta-xaxis"), buildAxisLabels(5));
    setAxisLabels(document.getElementById("so-votes-xaxis"), buildAxisLabels(3));
    setAxisLabels(document.getElementById("so-comments-xaxis"), buildAxisLabels(3));
  }

  function initAllCharts() {
    var charts = {
      activity: null,
      tta: null,
      votes: null,
      comments: null,
      donut: null,
    };

    function mountCharts(series) {
      charts.activity = initChart({
        hitareaSelector: '[data-chart="activity"]',
        plotWidth: 801,
        flipRatio: 0.75,
        series: series.activity,
        plot: series.activityPlot,
        yMax: 300,
        lineDatasets: [
          { key: "answers", borderColor: "#00A6F4", fill: SKY_FILL, order: 2 },
          { key: "questions", borderColor: "#A1A1A1", fill: GRAY_FILL, order: 1 },
        ],
        render: function (data) {
          document.getElementById("so-activity-tooltip-date").textContent = data.label;
          document.getElementById("so-activity-questions-label").textContent = data.questions + " questions";
          document.getElementById("so-activity-answers-label").textContent = data.answers + " answers";
          updateDelta(document.getElementById("so-activity-questions-delta"), data.questionsTrend, data.questionsDelta);
          updateDelta(document.getElementById("so-activity-answers-delta"), data.answersTrend, data.answersDelta);
        },
      });

      charts.tta = initChart({
        hitareaSelector: '[data-chart="tta"]',
        plotWidth: 351,
        flipRatio: 0.5,
        series: series.tta,
        plot: series.ttaPlot,
        yMax: 900,
        lineDatasets: [{ key: "value", borderColor: "#00A6F4", fill: SKY_FILL, order: 1 }],
        render: function (data) {
          document.getElementById("so-tta-tooltip-date").textContent = data.label;
          document.getElementById("so-tta-value-label").textContent = formatDuration(data.value);
          updateDelta(document.getElementById("so-tta-delta"), data.valueTrend, data.valueDelta);
        },
      });

      charts.votes = initChart({
        hitareaSelector: '[data-chart="votes"]',
        plotWidth: 211,
        flipRatio: 0.5,
        series: series.votes,
        plot: series.votesPlot,
        yMax: 100,
        lineDatasets: [{ key: "value", borderColor: "#00A6F4", fill: SKY_FILL, order: 1 }],
        render: function (data) {
          document.getElementById("so-votes-tooltip-date").textContent = data.label;
          document.getElementById("so-votes-value-label").textContent = data.value + " votes";
          updateDelta(document.getElementById("so-votes-delta"), data.valueTrend, data.valueDelta);
        },
      });

      charts.comments = initChart({
        hitareaSelector: '[data-chart="comments"]',
        plotWidth: 211,
        flipRatio: 0.5,
        series: series.comments,
        plot: series.commentsPlot,
        yMax: 100,
        lineDatasets: [{ key: "value", borderColor: "#00A6F4", fill: SKY_FILL, order: 1 }],
        render: function (data) {
          document.getElementById("so-comments-tooltip-date").textContent = data.label;
          document.getElementById("so-comments-value-label").textContent = data.value + " comments";
          updateDelta(document.getElementById("so-comments-delta"), data.valueTrend, data.valueDelta);
        },
      });

      charts.donut = initDonutChart();
    }

    function applyRange(rangeId, options) {
      var preset = RANGE_PRESETS[rangeId];
      if (!preset) {
        return;
      }

      currentRangeId = rangeId;
      setRangeWindow(preset.days);

      var labelEl = document.getElementById("so-range-label");
      if (labelEl) {
        labelEl.textContent = preset.label;
      }

      applyHeadlineMetrics(preset);
      applyAxisLabels(preset);

      if (charts.donut && charts.donut.setSegments) {
        charts.donut.setSegments(preset.donut);
      }

      var series = buildSeriesForRange(preset);
      if (charts.activity) {
        charts.activity.setSeries(series.activity, series.activityPlot, true);
      }
      if (charts.tta) {
        charts.tta.setSeries(series.tta, series.ttaPlot, true);
      }
      if (charts.votes) {
        charts.votes.setSeries(series.votes, series.votesPlot, true);
      }
      if (charts.comments) {
        charts.comments.setSeries(series.comments, series.commentsPlot, true);
      }

      if (!options || !options.silent) {
        notifyParent();
      }

      reportHeightToParent();
    }

    function initRangeControl() {
      var root = document.querySelector("[data-range]");
      var button = document.getElementById("so-range-button");
      var menu = document.getElementById("so-range-menu");
      if (!root || !button || !menu) {
        return;
      }

      var options = menu.querySelectorAll('[role="option"]');

      function setOpen(open) {
        button.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          menu.removeAttribute("hidden");
        } else {
          menu.setAttribute("hidden", "");
        }
      }

      function isOpen() {
        return button.getAttribute("aria-expanded") === "true";
      }

      function syncSelected() {
        options.forEach(function (option) {
          var selected = option.getAttribute("data-range-id") === currentRangeId;
          if (selected) {
            option.setAttribute("aria-selected", "true");
          } else {
            option.removeAttribute("aria-selected");
          }
        });
      }

      button.addEventListener("click", function (event) {
        event.stopPropagation();
        setOpen(!isOpen());
      });

      options.forEach(function (option) {
        option.addEventListener("click", function (event) {
          event.stopPropagation();
          var rangeId = option.getAttribute("data-range-id");
          if (rangeId && rangeId !== currentRangeId) {
            applyRange(rangeId);
            syncSelected();
          }
          setOpen(false);
          button.focus();
        });
      });

      document.addEventListener("click", function (event) {
        if (!root.contains(event.target)) {
          setOpen(false);
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          setOpen(false);
        }
      });

      syncSelected();
    }

    var initial = RANGE_PRESETS[currentRangeId];
    setRangeWindow(initial.days);
    mountCharts(buildSeriesForRange(initial));
    initRangeControl();
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

  function initInfoTips() {
    var wraps = document.querySelectorAll("[data-info-tip]");
    if (!wraps.length) {
      return;
    }

    wraps.forEach(function (wrap) {
      var hasNotified = false;

      function onReveal() {
        if (hasNotified) {
          return;
        }
        hasNotified = true;
        notifyParent();
      }

      wrap.addEventListener("pointerenter", onReveal);
      wrap.addEventListener("focusin", onReveal);
    });
  }

  function initDownloadToast() {
    var button = document.getElementById("so-download-button");
    var toast = document.getElementById("so-download-toast");
    if (!button || !toast) {
      return;
    }

    var hideTimer = null;
    var TOAST_MS = 2000;

    function hideToast() {
      toast.classList.remove("is-visible");
      hideTimer = window.setTimeout(function () {
        toast.setAttribute("hidden", "");
        hideTimer = null;
      }, prefersReducedMotion() ? 0 : 200);
    }

    function showToast() {
      if (hideTimer) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }

      toast.removeAttribute("hidden");
      void toast.offsetWidth;
      toast.classList.add("is-visible");
      notifyParent();

      hideTimer = window.setTimeout(hideToast, TOAST_MS);
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      showToast();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initAllCharts();
      initInfoTips();
      initDownloadToast();
      initHeightReporter();
    });
  } else {
    initAllCharts();
    initInfoTips();
    initDownloadToast();
    initHeightReporter();
  }
})();
