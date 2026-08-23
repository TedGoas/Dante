(function () {
  const REPLY_TEXT = 'Anytime, thank you.';
  const CHANNEL = 'Web chat';
  const DESTINATION = 'Digital Engagement';

  const SEED_ROWS = [
    {
      id: 'alisia',
      name: 'Alisia Marita',
      time: '2min ago',
      topic: 'RE: Broken band',
      preview:
        "I think that's it for today. You've been very helpful, thank so much for looking into this for me.",
      unread: false,
      selected: true,
      featured: false
    },
    {
      id: 'marcus',
      name: 'Marcus Chen',
      time: '8min ago',
      topic: 'RE: Shipping delay',
      preview:
        'The tracking still shows in transit. Can someone confirm whether a replacement has already been sent?',
      unread: true,
      selected: false,
      featured: true
    },
    {
      id: 'priya',
      name: 'Priya Nair',
      time: '14min ago',
      topic: 'Appointment reschedule',
      preview:
        'I need to move my visit with Dr. Miller to next week if possible. Thursday afternoon works best.',
      unread: true,
      selected: false,
      featured: false
    },
    {
      id: 'jordan',
      name: 'Jordan Blake',
      time: '21min ago',
      topic: 'Billing question',
      preview:
        'I was charged twice for last month. Can you check the invoice and let me know what happened?',
      unread: false,
      selected: false,
      featured: false
    }
  ];

  const INCOMING_POOL = [
    {
      name: 'Sam Ortiz',
      time: 'Just now',
      topic: 'Warranty claim',
      preview: 'The clasp failed again after two weeks. Do I need a case number before I mail it back?',
      unread: true
    },
    {
      name: 'Elena Rossi',
      time: 'Just now',
      topic: 'Order confirmation',
      preview: 'I never got a confirmation email for order 44821. Could you resend it to this address?',
      unread: true
    },
    {
      name: 'Devon Park',
      time: 'Just now',
      topic: 'Return label',
      preview: 'I accepted the exchange but still need a prepaid label. Can you send one today?',
      unread: true
    }
  ];

  const inbox = document.getElementById('inbox');
  const cursor = document.getElementById('cursor');
  const toast = document.getElementById('toast');

  let rows = [];
  let incomingIndex = 0;
  let runToken = 0;
  let timers = [];

  cursor.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5.5 3.5L18.2 11.1L12.4 12.7L15.2 20.1L12.5 21.2L9.6 13.6L5.5 16.8V3.5Z" fill="#111" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>';

  function iconForward() {
    return '<svg class="qr-row__meta-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function iconReply() {
    return '<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M5.5 4.2L2.8 6.9L5.5 9.6M3.1 6.9H8.4C10.1 6.9 11.4 8.2 11.4 9.9V11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function iconResolve() {
    return '<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2.8 7.2L5.6 10L11.2 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function iconSmile() {
    return '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.4" stroke="currentColor" stroke-width="1.2"/><path d="M5.6 9.2C6.2 10.1 7 10.6 8 10.6C9 10.6 9.8 10.1 10.4 9.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="6.2" cy="6.6" r="0.7" fill="currentColor"/><circle cx="9.8" cy="6.6" r="0.7" fill="currentColor"/></svg>';
  }

  function iconSend() {
    return '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.4 8.1L13.2 3.4L9.1 13.1L7.4 9.3L2.4 8.1Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M7.5 9.3L13.2 3.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
  }

  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
  }

  function wait(ms, token) {
    return new Promise((resolve) => {
      const id = window.setTimeout(() => {
        if (token === runToken) {
          resolve();
        }
      }, ms);
      timers.push(id);
    });
  }

  function showCursor(visible) {
    cursor.hidden = !visible;
  }

  function moveCursorTo(el, offsetX, offsetY) {
    if (!el) {
      return;
    }

    const rootBox = document.body.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    cursor.style.left = `${box.left - rootBox.left + (offsetX ?? box.width * 0.55)}px`;
    cursor.style.top = `${box.top - rootBox.top + (offsetY ?? box.height * 0.65)}px`;
  }

  function createRow(data) {
    const row = document.createElement('article');
    row.className = 'qr-row';
    row.dataset.id = data.id;

    if (data.selected) {
      row.classList.add('qr-row--selected');
    }

    if (data.unread) {
      row.classList.add('qr-row--unread');
    }

    if (data.featured) {
      row.dataset.featured = 'true';
    }

    row.innerHTML = `
      <div class="qr-row__dot" aria-hidden="true"><span></span></div>
      <div class="qr-row__body">
        <div class="qr-row__header">
          <p class="qr-row__name"></p>
          <p class="qr-row__time"></p>
        </div>
        <p class="qr-row__topic"></p>
        <p class="qr-row__preview"></p>
        <div class="qr-row__footer">
          <div class="qr-row__meta">
            <span>${CHANNEL}</span>
            ${iconForward()}
            <span>${DESTINATION}</span>
          </div>
          <div class="qr-row__actions">
            <button type="button" class="qr-btn qr-btn--reply">
              <span class="qr-btn__icon">${iconReply()}</span>
              <span class="qr-btn__label">Reply</span>
            </button>
            <button type="button" class="qr-btn qr-btn--resolve">
              <span class="qr-btn__icon">${iconResolve()}</span>
              <span class="qr-btn__label">Resolve</span>
            </button>
          </div>
        </div>
        <div class="qr-row__composer">
          <div class="qr-row__composer-inner">
            <div class="qr-composer">
              <p class="qr-composer__field is-placeholder">Reply to ${data.name.split(' ')[0]}</p>
              <div class="qr-composer__tools">
                <span class="qr-composer__icon" aria-hidden="true">${iconSmile()}</span>
                <span class="qr-composer__icon qr-composer__icon--send" aria-hidden="true">${iconSend()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    row.querySelector('.qr-row__name').textContent = data.name;
    row.querySelector('.qr-row__time').textContent = data.time;
    row.querySelector('.qr-row__topic').textContent = data.topic;
    row.querySelector('.qr-row__preview').textContent = data.preview;

    return row;
  }

  function renderRows(list, { animateLast } = {}) {
    inbox.innerHTML = '';
    rows = list.map((item) => ({ ...item }));
    rows.forEach((item, index) => {
      const el = createRow(item);
      if (animateLast && index === rows.length - 1) {
        el.classList.add('is-entering');
      }
      inbox.appendChild(el);
    });
  }

  function featuredEl() {
    return inbox.querySelector('[data-featured="true"]') || inbox.querySelector('.qr-row');
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
  }

  function hideToast() {
    toast.classList.remove('is-visible');
  }

  async function typeIntoComposer(row, text, token) {
    const field = row.querySelector('.qr-composer__field');
    field.classList.remove('is-placeholder');
    field.textContent = '';

    for (let i = 0; i < text.length; i += 1) {
      if (token !== runToken) {
        return;
      }

      field.textContent += text[i];
      await wait(28 + (i % 3) * 8, token);
    }
  }

  async function runDemo(token) {
    const row = featuredEl();

    if (!row) {
      return;
    }

    showCursor(true);
    moveCursorTo(row, 180, 40);
    await wait(450, token);
    if (token !== runToken) {
      return;
    }

    row.classList.add('is-hovered');
    moveCursorTo(row.querySelector('.qr-btn--reply'), 28, 16);
    await wait(500, token);
    if (token !== runToken) {
      return;
    }

    row.querySelector('.qr-btn--reply').classList.add('is-hot');
    await wait(280, token);
    if (token !== runToken) {
      return;
    }

    row.classList.add('is-composing');
    await wait(360, token);
    if (token !== runToken) {
      return;
    }

    moveCursorTo(row.querySelector('.qr-composer'), 90, 16);
    await wait(220, token);
    if (token !== runToken) {
      return;
    }

    await typeIntoComposer(row, REPLY_TEXT, token);
    if (token !== runToken) {
      return;
    }

    const send = row.querySelector('.qr-composer__icon--send');
    moveCursorTo(send, 10, 10);
    await wait(280, token);
    if (token !== runToken) {
      return;
    }

    send.classList.add('is-hot');
    await wait(180, token);
    if (token !== runToken) {
      return;
    }

    row.querySelector('.qr-row__preview').textContent = REPLY_TEXT;
    row.classList.remove('is-composing');
    row.querySelector('.qr-btn--reply').classList.remove('is-hot');
    showToast('Reply sent');
    await wait(900, token);
    if (token !== runToken) {
      return;
    }

    hideToast();
    row.classList.add('is-hovered');
    moveCursorTo(row.querySelector('.qr-btn--resolve'), 28, 16);
    await wait(420, token);
    if (token !== runToken) {
      return;
    }

    row.querySelector('.qr-btn--resolve').classList.add('is-hot');

    row.classList.remove('is-hovered', 'is-composing');
    row.removeAttribute('data-featured');

    const resolveHeight = Math.ceil(row.getBoundingClientRect().height);
    row.style.maxHeight = `${resolveHeight}px`;
    row.classList.add('is-resolving');

    await wait(32, token);
    if (token !== runToken) {
      return;
    }

    row.style.maxHeight = '0px';
    row.classList.add('is-gone');
    await wait(270, token);
    if (token !== runToken) {
      return;
    }

    const featuredIndex = rows.findIndex((item) => item.featured);
    const nextIncoming = INCOMING_POOL[incomingIndex % INCOMING_POOL.length];
    incomingIndex += 1;

    const nextRows = rows
      .filter((_, index) => index !== featuredIndex)
      .map((item) => ({
        ...item,
        featured: false,
        selected: item.id === 'alisia'
      }));

    nextRows.push({
      id: `incoming-${incomingIndex}`,
      ...nextIncoming,
      selected: false,
      featured: false
    });

    renderRows(nextRows, { animateLast: true });
    showCursor(false);
    await wait(700, token);
  }

  function resetDemo() {
    runToken += 1;
    clearTimers();
    hideToast();
    toast.hidden = true;
    showCursor(false);
    incomingIndex = 0;
    renderRows(SEED_ROWS.map((item) => ({ ...item })));
  }

  function playDemo() {
    resetDemo();
    const token = runToken;
    window.setTimeout(() => {
      if (token === runToken) {
        runDemo(token);
      }
    }, 120);
  }

  window.addEventListener('message', (event) => {
    const type = event.data?.type;

    if (type === 'dante-thumb-prototype-play') {
      playDemo();
      return;
    }

    if (type === 'dante-thumb-prototype-reset') {
      resetDemo();
    }
  });

  resetDemo();
})();
