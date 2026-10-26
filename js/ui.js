/* Khung giao diện chung: thanh trên, thanh tab dưới, hộp thoại, thông báo nhanh */
(function () {
  var esc = HHG.esc;
  var TABS = [
    { r: 'map', icon: 'map', key: 'nav_map' },
    { r: 'badges', icon: 'medal', key: 'nav_badges' },
    { r: 'about', icon: 'info', key: 'nav_about' }
  ];
  var GROUP = { map: 'map', location: 'map', quiz: 'map', result: 'map', badges: 'badges', about: 'about' };

  HHG.renderChrome = function () {
    var lang = HHG.I18n.lang(), cur = GROUP[HHG.Router.name] || '';
    var welcome = HHG.Router.name === '';
    document.body.classList.toggle('is-welcome', welcome);

    var langBtn = ['vi', 'en'].map(function (l) {
      return '<button type="button" class="langsw__b' + (l === lang ? ' is-on' : '') + '" data-lang="' + l + '" aria-pressed="' + (l === lang) + '" lang="' + l + '">' + l.toUpperCase() + '</button>';
    }).join('');

    var links = TABS.map(function (t) {
      return '<a class="topnav__a' + (t.r === cur ? ' is-on' : '') + '" href="#/' + t.r + '"' + (t.r === cur ? ' aria-current="page"' : '') + '>' + HHG.t(t.key) + '</a>';
    }).join('');

    document.getElementById('topbar').innerHTML =
      '<div class="topbar__in">' +
        '<a class="brand" href="#/" aria-label="Hue Heritage Game">' +
          '<span class="mono" aria-hidden="true"><span>H</span></span>' +
          '<span class="brand__t"><b>HUE HERITAGE</b><small>GAME</small></span>' +
        '</a>' +
        '<nav class="topnav" aria-label="' + esc(HHG.t('nav_main')) + '">' + links + '</nav>' +
        '<div class="langsw" role="group" aria-label="' + esc(HHG.t('switch_lang')) + '">' + langBtn + '</div>' +
      '</div>';

    document.getElementById('tabbar').innerHTML = TABS.map(function (t) {
      return '<a class="tab' + (t.r === cur ? ' is-on' : '') + '" href="#/' + t.r + '"' + (t.r === cur ? ' aria-current="page"' : '') + '>' +
        HHG.icon(t.icon, 22) + '<span>' + HHG.t(t.key) + '</span></a>';
    }).join('');
    document.getElementById('tabbar').setAttribute('aria-label', HHG.t('nav_main'));
    document.getElementById('skip').textContent = HHG.t('skip');

    var n = '';
    if (!HHG.Store.ok) n += '<p class="notice" role="alert">' + esc(HHG.t('storage_warn')) + '</p>';
    if (HHG.Store.notice) n += '<p class="notice">' + esc(HHG.t('reset_notice')) + '</p>';
    document.getElementById('notices').innerHTML = n;
  };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]');
    if (b) HHG.I18n.setLang(b.getAttribute('data-lang'));
  });

  /* Hộp thoại xác nhận / thông tin */
  HHG.dialog = function (o) {
    var d = document.getElementById('dlg');
    d.innerHTML =
      '<form method="dialog" class="dlg__box">' +
        '<h2 class="dlg__t">' + esc(o.title) + '</h2>' +
        '<p>' + esc(o.msg) + '</p>' +
        '<div class="dlg__acts">' +
          (o.confirm ? '<button class="btn btn--ghost" value="cancel">' + esc(HHG.t('cancel')) + '</button>' +
                       '<button class="btn btn--primary" value="ok">' + esc(o.confirm) + '</button>'
                     : '<button class="btn btn--primary" value="cancel">' + esc(HHG.t('close')) + '</button>') +
        '</div>' +
      '</form>';
    d.onclose = function () { if (d.returnValue === 'ok' && o.onConfirm) o.onConfirm(); d.returnValue = ''; };
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
  };

  var toastTimer;
  HHG.toast = function (msg) {
    var el = document.getElementById('toast');
    el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2400);
  };

  /* Ảnh địa điểm: nếu chưa có file ảnh thì hiện khung họa tiết */
  HHG.photo = function (loc, cls) {
    return '<figure class="photo ' + (cls || '') + '">' +
      '<div class="photo__ph" aria-hidden="true"><svg viewBox="0 0 600 220" preserveAspectRatio="xMidYMax slice"><use href="#gate"/></svg>' +
      '<span>' + esc(HHG.t('no_photo')) + '</span></div>' +
      '<img src="' + esc(loc.image) + '" alt="' + esc(HHG.pick(loc.imageAlt)) + '" loading="lazy" onerror="this.remove()">' +
      '</figure>';
  };

  HHG.views.notFound = {
    title: function () { return HHG.t('not_found'); },
    render: function (c) {
      c.innerHTML = '<div class="page page--narrow center"><h1 class="h1">404</h1><p>' + esc(HHG.t('not_found')) +
        '</p><a class="btn btn--primary" href="#/map">' + esc(HHG.t('back_map')) + '</a></div>';
    }
  };
})();
