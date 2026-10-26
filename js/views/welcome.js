HHG.views.welcome = {
  title: function () { return HHG.t('hero_kicker'); },
  render: function (c) {
    var esc = HHG.esc, t = HHG.t, st = HHG.Store.state, C = HHG.Content;
    var started = Object.keys(st.progress).length || Object.keys(st.sessions).length;
    var lang = HHG.I18n.lang();
    var langs = [['vi', 'Tiếng Việt', 'Vietnamese'], ['en', 'English', 'Tiếng Anh']].map(function (l) {
      return '<button type="button" class="langcard' + (l[0] === lang ? ' is-on' : '') + '" data-lang="' + l[0] + '" aria-pressed="' + (l[0] === lang) + '" lang="' + l[0] + '">' +
        '<span class="langcard__code">' + l[0].toUpperCase() + '</span><span class="langcard__n">' + l[1] + '</span></button>';
    }).join('');

    c.innerHTML =
      '<section class="hero">' +
        '<div class="hero__lattice"></div>' +
        '<svg class="hero__gate" viewBox="0 0 600 220" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><use href="#gate"/></svg>' +
        '<div class="hero__in">' +
          '<p class="hero__kicker">' + esc(t('hero_kicker')) + '</p>' +
          '<h1 class="hero__title">Hue Heritage <span>Game</span></h1>' +
          '<p class="hero__tag">' + esc(t('tagline')) + '</p>' +
        '</div>' +
      '</section>' +
      '<section class="page page--narrow welcome">' +
        '<div class="panel welcome__panel">' +
          '<h2 class="eyebrow">' + esc(t('choose_lang')) + '</h2>' +
          '<div class="langcards">' + langs + '</div>' +
          '<a class="btn btn--gold btn--lg btn--block" href="#/map">' +
            esc(t(started ? 'continue_journey' : 'start_journey')) + HHG.icon('right', 20) + '</a>' +
          '<ul class="stats">' +
            '<li><b>' + C.locations.length + '</b><span>' + esc(t('stat_locations')) + '</span></li>' +
            '<li><b>' + C.questions.length + '</b><span>' + esc(t('stat_questions')) + '</span></li>' +
            '<li><b>2</b><span>' + esc(t('stat_langs')) + '</span></li>' +
          '</ul>' +
        '</div>' +
        '<div class="how">' +
          '<h2 class="eyebrow">' + esc(t('how_title')) + '</h2>' +
          '<ol class="steps">' +
            '<li><span class="steps__n">1</span><p>' + esc(t('how_1')) + '</p></li>' +
            '<li><span class="steps__n">2</span><p>' + esc(t('how_2')) + '</p></li>' +
            '<li><span class="steps__n">3</span><p>' + esc(t('how_3')) + '</p></li>' +
          '</ol>' +
        '</div>' +
      '</section>';
  }
};
