HHG.views.location = {
  title: function (p) { var l = HHG.Content.locById[p.id]; return l ? HHG.pick(l.name) : ''; },
  render: function (c, p) {
    var esc = HHG.esc, t = HHG.t, S = HHG.Scoring, loc = HHG.Content.locById[p.id];
    if (!loc) { HHG.views.notFound.render(c); return; }
    var s = S.stateOf(loc);

    var acts;
    if (s === 'locked') {
      var req = HHG.Content.locById[loc.unlock.requires];
      acts = '<div class="callout callout--lock">' + HHG.icon('lock', 22) + '<p>' +
        esc(t('unlock_hint', { name: req ? HHG.pick(req.name) : '', pct: loc.unlock.minPct })) + '</p></div>';
    } else {
      var sess = HHG.Quiz.session(loc.id);
      acts = (sess
        ? '<button class="btn btn--gold btn--lg" id="go">' + HHG.icon('play', 18) + esc(t('continue_quest')) + '</button>'
        : '<button class="btn btn--gold btn--lg" id="go">' + HHG.icon('play', 18) + esc(t(s === 'done' ? 'replay_quest' : 'start_quest')) + '</button>');
    }

    var best = s === 'done' ? '<p class="bestline">' + HHG.icon('star', 18) + esc(t('best_score', { s: S.best(loc), m: S.max(loc) })) + '</p>' : '';
    var srcs = loc.sources.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');

    c.innerHTML =
      '<article class="page page--wide loc-detail">' +
        '<a class="back" href="#/map">' + HHG.icon('left', 18) + esc(t('back_map')) + '</a>' +
        '<div class="loc-detail__grid">' +
          HHG.photo(loc, 'photo--hero') +
          '<div class="loc-detail__body">' +
            '<span class="chip chip--' + s + '">' + esc(t(s === 'done' ? 'status_done' : s === 'locked' ? 'status_locked' : 'status_open')) + '</span>' +
            '<h1 class="h1">' + esc(HHG.pick(loc.name)) + '</h1>' +
            '<p class="lead">' + esc(HHG.pick(loc.intro)) + '</p>' + best +
            '<div class="actions">' + acts +
              '<a class="btn btn--ghost btn--lg" target="_blank" rel="noopener" href="' + esc(HHG.dirUrl(loc)) + '">' + HHG.icon('nav', 18) + esc(t('directions')) + '</a>' +
            '</div>' +
            '<section class="refs"><h2 class="eyebrow">' + esc(t('sources')) + '</h2><ul>' + srcs + '</ul></section>' +
          '</div>' +
        '</div>' +
      '</article>';

    var go = document.getElementById('go');
    if (go) go.addEventListener('click', function () {
      if (!HHG.Quiz.session(loc.id) || !HHG.Quiz.questions(loc).length) HHG.Quiz.start(loc.id);
      HHG.Router.navigate('/quiz/' + loc.id);
    });
  }
};
