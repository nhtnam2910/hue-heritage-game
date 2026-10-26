/* Điều hướng theo #/đường-dẫn (chạy được trên GitHub Pages không cần cấu hình máy chủ) */
(function () {
  var routes = [], last = null;
  var Router = HHG.Router = {
    name: '', params: {},
    add: function (pattern, view) { routes.push({ parts: pattern.split('/').filter(Boolean), view: view }); },
    navigate: function (path) {
      if (location.hash === '#' + path) Router.refresh(); else location.hash = '#' + path;
    },
    refresh: function () { Router.render(); },
    start: function () {
      window.addEventListener('hashchange', function () { Router.render(true); });
      Router.render(true);
    },
    match: function () {
      var parts = (location.hash.slice(1) || '/').split('/').filter(Boolean);
      for (var i = 0; i < routes.length; i++) {
        var r = routes[i];
        if (r.parts.length !== parts.length) continue;
        var params = {}, ok = true;
        for (var j = 0; j < parts.length; j++) {
          if (r.parts[j].charAt(0) === ':') params[r.parts[j].slice(1)] = decodeURIComponent(parts[j]);
          else if (r.parts[j] !== parts[j]) { ok = false; break; }
        }
        if (ok) return { view: r.view, params: params, name: r.parts[0] || '' };
      }
      return null;
    },
    render: function (scrollTop) {
      var el = document.getElementById('view');
      if (last && last.destroy) { try { last.destroy(); } catch (e) {} }
      var m = Router.match();
      if (!m) m = { view: HHG.views.notFound, params: {}, name: '404' };
      Router.name = m.name; Router.params = m.params; last = m.view;
      var y = window.scrollY;
      el.innerHTML = '';
      m.view.render(el, m.params);
      if (m.name !== '') {
        el.insertAdjacentHTML('beforeend', '<p class="verline">' + HHG.t('content_version', { v: HHG.Content.version }) + '</p>');
      }
      document.title = (m.view.title ? m.view.title(m.params) + ' · ' : '') + 'Hue Heritage Game';
      HHG.renderChrome();
      if (scrollTop) { window.scrollTo(0, 0); el.focus({ preventScroll: true }); } else window.scrollTo(0, y);
    }
  };
})();
