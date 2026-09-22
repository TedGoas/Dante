(function () {
  'use strict';

  const CRITERIA = [
    'Fits into my schedule',
    'Happens often',
    'Involves the kids',
    'Is cheap',
    'Gives me meaning',
    'Gives me energy',
    'Has positive result'
  ];

  const HOBBY_COLORS = ['#FF6B6B', '#4A90E2', '#4CAF50'];

  function createEmptyScores() {
    const scores = {};
    CRITERIA.forEach(function (criterion) {
      scores[criterion] = null;
    });
    return scores;
  }

  function createHobby(id, name, colorIndex) {
    return {
      id: String(id),
      name: name,
      scores: createEmptyScores(),
      color: HOBBY_COLORS[colorIndex]
    };
  }

  const state = {
    hobbies: [createHobby(1, 'Hobby 1', 0), createHobby(2, 'Hobby 2', 1)],
    visible: { '1': true, '2': true },
    editingId: null,
    draftName: '',
    nextHobbyId: 3
  };

  let chart = null;

  const hobbyListEl = document.getElementById('hobby-list');
  const togglesEl = document.getElementById('visibility-toggles');
  const addHobbyBtn = document.getElementById('add-hobby');
  const resetScoresBtn = document.getElementById('reset-scores');
  const canvasEl = document.getElementById('radar-chart');

  function calculateAverage(hobby) {
    const values = CRITERIA.map(function (c) {
      return hobby.scores[c];
    }).filter(function (s) {
      return typeof s === 'number';
    });
    if (values.length === 0) return null;
    return values.reduce(function (sum, score) {
      return sum + score;
    }, 0) / values.length;
  }

  function formatCriterionLabel(criterion) {
    if (criterion.length <= 35) return criterion;
    const words = criterion.split(' ');
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }

  function nextColorIndex() {
    const used = {};
    state.hobbies.forEach(function (hobby) {
      const index = HOBBY_COLORS.indexOf(hobby.color);
      if (index >= 0) used[index] = true;
    });
    for (let i = 0; i < HOBBY_COLORS.length; i += 1) {
      if (!used[i]) return i;
    }
    return state.hobbies.length % HOBBY_COLORS.length;
  }

  function updateHobbyName(id, name) {
    state.hobbies.forEach(function (hobby) {
      if (hobby.id === id) hobby.name = name;
    });
  }

  function updateScore(hobbyId, criterion, score) {
    state.hobbies.forEach(function (hobby) {
      if (hobby.id === hobbyId) {
        hobby.scores[criterion] = score;
      }
    });
  }

  function addHobby() {
    if (state.hobbies.length >= 3) return;
    const id = state.nextHobbyId;
    state.nextHobbyId += 1;
    const colorIndex = nextColorIndex();
    const hobby = createHobby(id, 'Hobby ' + id, colorIndex);
    state.hobbies.push(hobby);
    state.visible[hobby.id] = true;
    render();
  }

  function removeHobby(id) {
    if (state.hobbies.length <= 2) return;
    state.hobbies = state.hobbies.filter(function (hobby) {
      return hobby.id !== id;
    });
    delete state.visible[id];
    if (state.editingId === id) {
      state.editingId = null;
      state.draftName = '';
    }
    render();
  }

  function toggleVisibility(id) {
    state.visible[id] = !state.visible[id];
    renderChart();
    renderToggles();
  }

  function resetScores() {
    state.hobbies.forEach(function (hobby) {
      hobby.scores = createEmptyScores();
    });
    render();
  }

  function startEditing(id, currentName) {
    state.editingId = id;
    state.draftName = currentName;
    renderHobbyCards();
    const input = hobbyListEl.querySelector('[data-name-input="' + id + '"]');
    if (input) {
      input.focus();
      input.select();
    }
  }

  function commitEditing(id) {
    const trimmed = state.draftName.trim();
    if (trimmed) {
      updateHobbyName(id, trimmed);
    }
    state.editingId = null;
    state.draftName = '';
    render();
  }

  function cancelEditing() {
    state.editingId = null;
    state.draftName = '';
    renderHobbyCards();
  }

  function renderHobbyCards() {
    hobbyListEl.innerHTML = '';

    state.hobbies.forEach(function (hobby) {
      const card = document.createElement('article');
      card.className = 'hobby-card';
      card.setAttribute('data-hobby-id', hobby.id);

      const header = document.createElement('div');
      header.className = 'hobby-card__header';

      const identity = document.createElement('div');
      identity.className = 'hobby-card__identity';

      const swatch = document.createElement('span');
      swatch.className = 'hobby-card__swatch';
      swatch.style.backgroundColor = hobby.color;
      swatch.setAttribute('aria-hidden', 'true');
      identity.appendChild(swatch);

      if (state.editingId === hobby.id) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'hobby-card__name-input';
        input.value = state.draftName;
        input.setAttribute('data-name-input', hobby.id);
        input.setAttribute('aria-label', 'Hobby name');
        input.style.width = Math.max(state.draftName.length * 0.6, 8) + 'em';
        input.addEventListener('input', function (event) {
          state.draftName = event.target.value;
          input.style.width = Math.max(state.draftName.length * 0.6, 8) + 'em';
        });
        input.addEventListener('blur', function () {
          commitEditing(hobby.id);
        });
        input.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            commitEditing(hobby.id);
          } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelEditing();
          }
        });
        identity.appendChild(input);
      } else {
        const name = document.createElement('h3');
        name.className = 'hobby-card__name';
        name.textContent = hobby.name;
        name.title = 'Click to edit';
        name.addEventListener('click', function () {
          startEditing(hobby.id, hobby.name);
        });
        identity.appendChild(name);
      }

      header.appendChild(identity);

      if (state.hobbies.length > 2) {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'hobby-card__remove';
        removeBtn.textContent = 'Remove';
        removeBtn.title = 'Remove hobby';
        removeBtn.addEventListener('click', function () {
          removeHobby(hobby.id);
        });
        header.appendChild(removeBtn);
      }

      card.appendChild(header);

      const criteria = document.createElement('div');
      criteria.className = 'hobby-card__criteria';

      CRITERIA.forEach(function (criterion) {
        const row = document.createElement('div');
        row.className = 'criterion';

        const label = document.createElement('span');
        label.className = 'criterion__label';
        label.textContent = criterion;
        row.appendChild(label);

        const scores = document.createElement('div');
        scores.className = 'criterion__scores';
        scores.setAttribute('role', 'group');
        scores.setAttribute('aria-label', hobby.name + ': ' + criterion);

        [1, 2, 3, 4, 5].forEach(function (score) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'score-btn';
          btn.textContent = String(score);
          if (hobby.scores[criterion] === score) {
            btn.classList.add('is-selected');
            btn.style.backgroundColor = hobby.color;
          }
          btn.addEventListener('click', function () {
            updateScore(hobby.id, criterion, score);
            render();
          });
          scores.appendChild(btn);
        });

        row.appendChild(scores);
        criteria.appendChild(row);
      });

      card.appendChild(criteria);
      hobbyListEl.appendChild(card);
    });
  }

  function renderToggles() {
    togglesEl.innerHTML = '';

    state.hobbies.forEach(function (hobby) {
      const avg = calculateAverage(hobby);
      const isVisible = state.visible[hobby.id] !== false;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'visibility-toggle' + (isVisible ? '' : ' is-hidden');
      btn.setAttribute('aria-pressed', isVisible ? 'true' : 'false');

      const swatch = document.createElement('span');
      swatch.className = 'hobby-card__swatch';
      swatch.style.backgroundColor = hobby.color;
      swatch.setAttribute('aria-hidden', 'true');
      btn.appendChild(swatch);

      const name = document.createElement('span');
      name.className = 'visibility-toggle__name';
      name.textContent = hobby.name;
      btn.appendChild(name);

      const avgEl = document.createElement('span');
      avgEl.className = 'visibility-toggle__avg';
      avgEl.textContent = avg !== null ? avg.toFixed(2) : 'N/A';
      btn.appendChild(avgEl);

      btn.addEventListener('click', function () {
        toggleVisibility(hobby.id);
      });

      togglesEl.appendChild(btn);
    });
  }

  function getChartData() {
    return {
      labels: CRITERIA.map(formatCriterionLabel),
      datasets: state.hobbies.map(function (hobby) {
        return {
          label: hobby.name,
          data: CRITERIA.map(function (criterion) {
            return hobby.scores[criterion] ?? 0;
          }),
          backgroundColor: hobby.color + '33',
          borderColor: hobby.color,
          borderWidth: 2,
          pointBackgroundColor: hobby.color,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: hobby.color,
          pointRadius: 4,
          pointHoverRadius: 6,
          hidden: state.visible[hobby.id] === false
        };
      })
    };
  }

  function getChartOptions() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      scales: {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          pointLabels: {
            font: {
              size: 14,
              family: "'Space Grotesk', system-ui, -apple-system, sans-serif",
              weight: '400'
            },
            color: '#374151',
            padding: 10
          },
          ticks: {
            stepSize: 1,
            backdropColor: 'transparent',
            color: '#6b7280',
            font: {
              size: 12,
              family: "'Space Grotesk', system-ui, -apple-system, sans-serif",
              weight: '400'
            }
          },
          suggestedMin: 0,
          suggestedMax: 5
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const value = context.parsed.r;
              return label + ': ' + (value === 0 ? 'Not rated' : value);
            }
          }
        }
      },
      animation: reduceMotion
        ? false
        : {
            duration: 300,
            easing: 'easeInOutQuart'
          }
    };
  }

  function ensureChart() {
    if (typeof Chart === 'undefined') {
      return false;
    }
    if (!chart) {
      chart = new Chart(canvasEl, {
        type: 'radar',
        data: getChartData(),
        options: getChartOptions()
      });
    }
    return true;
  }

  function renderChart() {
    if (!ensureChart()) return;
    chart.data = getChartData();
    chart.update('none');
  }

  function renderActions() {
    addHobbyBtn.hidden = state.hobbies.length >= 3;
  }

  function render() {
    renderActions();
    renderHobbyCards();
    renderToggles();
    renderChart();
  }

  addHobbyBtn.addEventListener('click', addHobby);
  resetScoresBtn.addEventListener('click', resetScores);

  window.addEventListener('resize', function () {
    if (chart) chart.resize();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
