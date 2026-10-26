/* Khởi động: nạp chuỗi giao diện, nạp nội dung (bản lưu → dự phòng), rồi làm mới nền từ Web App */
(function () {
  var cfg = HHG_CONFIG, Store = HHG.Store;

  function loadFallback() {
    return Promise.all([
      HHG.fetchJson(cfg.FALLBACK.locations), HHG.fetchJson(cfg.FALLBACK.questions), HHG.fetchJson(cfg.FALLBACK.badges)
    ]).then(function (r) { return { contentVersion: 1, locations: r[0], questions: r[1], badges: r[2] }; });
  }
  function valid(d) { return d && !d.error && Array.isArray(d.locations) && d.locations.length && Array.isArray(d.questions); }

  /* Gọi Web App: nếu thành công và có bản mới hơn thì lưu vào trình duyệt */
  function refreshFromWebApp() {
    if (!cfg.CONTENT_URL) return;
    HHG.fetchJson(cfg.CONTENT_URL, cfg.FETCH_TIMEOUT).then(function (d) {
      if (!valid(d)) return;
      var shown = HHG.Content.version;
      Store.setCachedContent(d);
      HHG.Content.source = 'live';
      if (d.contentVersion !== shown) {
        var playing = HHG.Router.name === 'quiz';
        if (!playing) {
          HHG.setContent(d);
          HHG.Router.refresh();
          HHG.toast(HHG.t('new_content', { v: d.contentVersion }));
        }
      }
    }).catch(function () { /* Dùng bản đã có; không làm gián đoạn người chơi */ });
  }

  function showError() {
    document.getElementById('view').innerHTML =
      '<div class="page page--narrow center"><h1 class="h1">Hue Heritage Game</h1><p>' + HHG.esc(HHG.t('load_error')) +
      '</p><button class="btn btn--primary" onclick="location.reload()">' + HHG.esc(HHG.t('retry')) + '</button></div>';
  }

  function boot() {
    Store.load();
    document.documentElement.lang = Store.state.lang;
    HHG.I18n.init().then(function () {
      var cached = Store.getCachedContent();
      if (cached) { HHG.Content.source = 'cache'; return cached; }
      HHG.Content.source = 'fallback';
      return loadFallback();
    }).then(function (d) {
      HHG.setContent(d);
      var R = HHG.Router;
      R.add('/', HHG.views.welcome);
      R.add('/map', HHG.views.map);
      R.add('/location/:id', HHG.views.location);
      R.add('/quiz/:id', HHG.views.quiz);
      R.add('/result/:id', HHG.views.result);
      R.add('/badges', HHG.views.badges);
      R.add('/about', HHG.views.about);
      R.start();
      refreshFromWebApp();
    }).catch(function (e) {
      console.error(e);
      HHG.renderChrome();
      showError();
    });
  }
  boot();
})();
