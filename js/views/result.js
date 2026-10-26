HHG.views.result = {
  title: function () { return HHG.t('result_title'); },
  render: function (c, p) {
    var esc = HHG.esc, t = HHG.t, C = HHG.Content;
    var r = HHG.Store.state.lastResult, loc = C.locById[p.id];
    if (!loc || !r || r.id !== p.id) { HHG.Router.navigate(loc ? '/location/' + p.id : '/map'); return; }

    var pct = r.max ? Math.round(r.score / r.max * 100) : 0;
    var CIRC = 2 * Math.PI * 54;
    var badges = r.newBadges.map(function (id) {
      var b = C.badges.filter(function (x) { return x.id === id; })[0];
      if (!b) return '';
      return '<li class="newbadge">' + HHG.badgeEmblem(id, true, 26) + '<span><small>' + esc(t('new_badge')) + '</small><b>' + esc(HHG.pick(b.name)) + '</b></span></li>';
    }).join('');

    var unlock = r.unlocked.length
      ? '<p class="callout callout--ok">' + HHG.icon('check', 22) + '<span>' + esc(t('unlock_ok', { names: r.unlocked.map(function (id) { return HHG.pick(C.locById[id].name); }).join(', ') })) + '</span></p>'
      : (r.needPct ? '<p class="callout callout--lock">' + HHG.icon('lock', 22) + '<span>' + esc(t('unlock_fail', { pct: r.needPct })) + '</span></p>' : '');

    c.innerHTML =
      '<section class="page page--narrow result">' +
        '<p class="eyebrow center">' + esc(t('result_title')) + ' · ' + esc(HHG.pick(loc.name)) + '</p>' +
        '<div class="ring">' +
          '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="ring__bg"/>' +
          '<circle cx="60" cy="60" r="54" class="ring__fg" id="ringfg" stroke-dasharray="' + CIRC.toFixed(1) + '" stroke-dashoffset="' + CIRC.toFixed(1) + '" transform="rotate(-90 60 60)"/></svg>' +
          '<div class="ring__t"><b>' + r.score + '</b><span>/ ' + r.max + ' ' + esc(t('points')) + '</span></div>' +
        '</div>' +
        '<p class="result__sum">' + esc(t('correct_count', { n: r.right, total: r.total })) + '</p>' +
        (r.isBest ? '<p class="result__best">' + HHG.icon('star', 16) + esc(t('new_best')) + '</p>' : '') +
        (badges ? '<ul class="newbadges">' + badges + '</ul>' : '') + unlock +
        '<div class="actions actions--col">' +
          '<a class="btn btn--gold btn--lg btn--block" href="#/map">' + HHG.icon('map', 20) + esc(t('back_map')) + '</a>' +
          '<button class="btn btn--ghost btn--lg btn--block" id="replay">' + HHG.icon('reset', 18) + esc(t('replay_quest')) + '</button>' +
        '</div>' +
      '</section>';

    requestAnimationFrame(function () {
      var fg = document.getElementById('ringfg');
      if (fg) fg.style.strokeDashoffset = (CIRC * (1 - pct / 100)).toFixed(1);
    });
    document.getElementById('replay').addEventListener('click', function () {
      HHG.Quiz.start(p.id); HHG.Router.navigate('/quiz/' + p.id);
    });
  }
};
