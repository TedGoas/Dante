(function () {
  function initHtmlEmbeds() {
    var embeds = document.querySelectorAll('[data-html-embed]');
    if (!embeds.length) {
      return;
    }

    window.addEventListener('message', function (event) {
      if (!event.data || event.data.type !== 'dante-html-embed-interacted') {
        return;
      }

      embeds.forEach(function (embed) {
        embed.classList.add('is-interacted');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHtmlEmbeds);
  } else {
    initHtmlEmbeds();
  }
})();
