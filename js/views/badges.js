HHG.views.badges = {
  title: function () { return HHG.t('badges_title'); },
  render: function (c) {
    var esc = HHG.esc, t = HHG.t, C = HHG.Content, S = HHG.Scoring;
    var earned = HHG.Store.state.badges.filter(function (id) { return C.badges.some(function (b) { return b.id === id; }); }).length;

    var grid = C.badges.map(function (b) {
      var on = HHG.Badges.has(b.id);
      return '<li class="bcard' + (on ? ' is-on' : '') + '">' + HHG.badgeEmblem(b.id, on, 32) +
        '<b>' + esc(HHG.pick(b.name)) + '</b><p>' + esc(HHG.pick(b.desc)) + '</p>' +
        '<span class="chip chip--' + (on ? 'done' : 'locked') + '">' + esc(t(on ? 'badge_earned' : 'badge_todo')) + '</span></li>';
    }).join('');

    var rows = C.locations.map(function (loc) {
      var s = S.stateOf(loc), pct = S.pct(loc);
      var meta = s === 'locked' ? t('status_locked') : S.isCompleted(loc) ? S.best(loc) + '/' + S.max(loc) : (HHG.Quiz.session(loc.id) ? t('in_progress') : t('not_played'));
      return '<li class="prow"><span class="prow__n">' + loc.order + '</span><div class="prow__b"><b>' + esc(HHG.pick(loc.name)) + '</b>' +
        '<div class="bar bar--sm"><i style="width:' + pct + '%"></i></div></div><span class="prow__m">' + esc(meta) + '</span></li>';
    }).join('');

    c.innerHTML =
      '<div class="page page--wide">' +
        '<h1 class="h1">' + esc(t('badges_title')) + '</h1>' +
        '<div class="summary summary--tight"><div class="summary__score"><span class="eyebrow">' + esc(t('total_score')) + '</span><b>' + S.total() + '<small> / ' + S.totalMax() + '</small></b></div>' +
        '<p class="summary__badges">' + HHG.icon('medal', 20) + esc(t('badges_count', { n: earned, m: C.badges.length })) + '</p></div>' +
        '<ul class="bgrid">' + grid + '</ul>' +
        '<h2 class="h2">' + esc(t('progress_title')) + '</h2>' +
        '<ul class="plist">' + rows + '</ul>' +
        '<div class="danger"><button class="btn btn--ghost" id="reset">' + HHG.icon('reset', 18) + esc(t('reset')) + '</button></div>' +
      '</div>';

    document.getElementById('reset').addEventListener('click', function () {
      HHG.dialog({ title: t('reset_title'), msg: t('reset_msg'), confirm: t('confirm_reset'),
        onConfirm: function () { HHG.Store.reset(); HHG.Router.navigate('/'); } });
    });
  }
};
