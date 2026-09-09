(function () {
  function initHtmlEmbeds() {
    var embeds = document.querySelectorAll('[data-html-embed]');
    if (!embeds.length) {
      return;
    }

    function iframeForSource(source) {
      for (var i = 0; i < embeds.length; i += 1) {
        var iframe = embeds[i].querySelector('iframe');
        if (iframe && iframe.contentWindow === source) {
          return iframe;
        }
      }
      return null;
    }

    window.addEventListener('message', function (event) {
      if (!event.data || typeof event.data.type !== 'string') {
        return;
      }

      if (event.data.type === 'dante-html-embed-interacted') {
        embeds.forEach(function (embed) {
          embed.classList.add('is-interacted');
        });
        return;
      }

      if (event.data.type === 'dante-html-embed-resize') {
        var height = Number(event.data.height);
        if (!height || height < 1) {
          return;
        }

        var iframe = iframeForSource(event.source);
        if (!iframe) {
          return;
        }

        iframe.style.height = Math.ceil(height) + 'px';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHtmlEmbeds);
  } else {
    initHtmlEmbeds();
  }
})();
