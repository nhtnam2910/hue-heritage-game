HHG.views.about = {
  title: function () { return HHG.t('about_title'); },
  render: function (c) {
    var esc = HHG.esc, t = HHG.t, C = HHG.Content, cfg = HHG_CONFIG, code = HHG.Store.state.pcode;

    function form(key, url) {
      return url
        ? '<a class="btn btn--ghost btn--block" target="_blank" rel="noopener" href="' + esc(url) + '">' + HHG.icon('link', 18) + esc(t(key)) + '</a>'
        : '<span class="btn btn--ghost btn--block is-disabled" aria-disabled="true">' + esc(t(key)) + ' · ' + esc(t('coming_soon')) + '</span>';
    }
    var srcs = C.locations.map(function (l) {
      return '<li><b>' + esc(HHG.pick(l.name)) + '</b><ul>' + l.sources.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></li>';
    }).join('');

    c.innerHTML =
      '<div class="page page--narrow about">' +
        '<h1 class="h1">' + esc(t('about_title')) + '</h1>' +
        '<p class="lead">' + esc(t('about_p1')) + '</p><p>' + esc(t('about_p2')) + '</p>' +
        '<section class="panel"><h2 class="h2">' + esc(t('research_title')) + '</h2>' +
          '<p class="eyebrow">' + esc(t('pcode')) + '</p>' +
          '<div class="pcode"><output id="pcode">' + esc(code) + '</output>' +
          '<button class="btn btn--primary btn--sm" id="copy">' + HHG.icon('copy', 16) + esc(t('copy')) + '</button></div>' +
          '<p class="muted">' + esc(t('pcode_help')) + '</p>' +
          '<div class="forms">' + form('pretest', cfg.PRETEST_URL) + form('posttest', cfg.POSTTEST_URL) + form('survey', cfg.SURVEY_URL) + '</div>' +
        '</section>' +
        '<section class="refs"><h2 class="h2">' + esc(t('sources_title')) + '</h2><ul class="reflist">' + srcs + '</ul></section>' +
        '<section class="refs"><h2 class="h2">' + esc(t('credits_title')) + '</h2><p class="muted">' + esc(t('credits_map')) + '</p></section>' +
      '</div>';

    document.getElementById('copy').addEventListener('click', function () {
      var done = function () { HHG.toast(t('copied')); };
      if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, done); else done();
    });
  }
};
