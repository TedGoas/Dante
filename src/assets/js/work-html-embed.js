(function () {
  // Height source of truth: dante-html-embed-resize postMessage.
  // Do not skip this listener when CSS.supports('frame-sizing', 'content-height')
  // — Chrome 154 claimed support but height:auto + native sizing collapsed the
  // Stack Overflow dashboard. See AGENTS.md (html-embed) before enabling frame-sizing.
  function initHtmlEmbeds() {
    var embeds = document.querySelectorAll('[data-html-embed]');
    if (!embeds.length) {
      return;
    }

    function embedForSource(source) {
      for (var i = 0; i < embeds.length; i += 1) {
        var iframe = embeds[i].querySelector('iframe');
        if (iframe && iframe.contentWindow === source) {
          return embeds[i];
        }
      }
      return null;
    }

    window.addEventListener('message', function (event) {
      if (!event.data || event.data.type !== 'dante-html-embed-resize') {
        return;
      }

      var height = Number(event.data.height);
      if (!height || height < 1) {
        return;
      }

      var embed = embedForSource(event.source);
      if (!embed) {
        return;
      }

      var iframe = embed.querySelector('iframe');
      if (!iframe) {
        return;
      }

      iframe.style.height = Math.ceil(height) + 'px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHtmlEmbeds);
  } else {
    initHtmlEmbeds();
  }
})();
