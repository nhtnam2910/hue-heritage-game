HHG.views.quiz = {
  title: function (p) { var l = HHG.Content.locById[p.id]; return l ? HHG.pick(l.name) : ''; },
  render: function (c, p) {
    var esc = HHG.esc, t = HHG.t, Q = HHG.Quiz, loc = HHG.Content.locById[p.id];
    if (!loc || !HHG.Scoring.isUnlocked(loc)) { HHG.Router.navigate(loc ? '/location/' + p.id : '/map'); return; }
    var qs = Q.questions(loc);
    if (!qs.length) { HHG.Router.navigate('/location/' + p.id); return; }
    var sess = Q.session(p.id) || Q.start(p.id);

    function draw(focusFb) {
      if (sess.idx >= qs.length) { Q.finish(p.id); HHG.Router.navigate('/result/' + p.id); return; }
      var q = qs[sess.idx], a = sess.answers[q.id], hinted = !!sess.hints[q.id];
      var letters = 'ABCD';

      var segs = qs.map(function (x, i) {
        var done = !!sess.answers[x.id];
        return '<i class="' + (done ? 'is-done' : '') + (i === sess.idx ? ' is-cur' : '') + '"></i>';
      }).join('');

      var opts = q.options.map(function (o, i) {
        var cls = 'opt', icon = '';
        if (a) {
          if (o.id === q.correct) { cls += ' is-right'; icon = HHG.icon('check', 22); }
          else if (o.id === a.choice) { cls += ' is-wrong'; icon = HHG.icon('x', 22); }
          else cls += ' is-dim';
        }
        return '<li><button type="button" class="' + cls + '" data-o="' + esc(o.id) + '"' + (a ? ' disabled' : '') + '>' +
          '<span class="opt__k">' + letters[i] + '</span><span class="opt__t">' + esc(HHG.pick(o.text)) + '</span>' +
          '<span class="opt__i">' + icon + '</span></button></li>';
      }).join('');

      var correctOpt = q.options.filter(function (o) { return o.id === q.correct; })[0];
      var hintBox = hinted && q.hint && HHG.pick(q.hint)
        ? '<p class="hintbox">' + HHG.icon('bulb', 18) + '<span><b>' + esc(t('hint_label')) + ':</b> ' + esc(HHG.pick(q.hint)) + '</span></p>' : '';
      var hintBtn = !a && !hinted && q.hint && HHG.pick(q.hint)
        ? '<button type="button" class="btn btn--ghost btn--sm" id="hint">' + HHG.icon('bulb', 16) + esc(t('hint')) + '</button>' : '';

      var fb = '';
      if (a) {
        fb = '<div class="feedback ' + (a.correct ? 'is-right' : 'is-wrong') + '" id="fb" tabindex="-1">' +
          '<p class="feedback__h">' + HHG.icon(a.correct ? 'check' : 'x', 22) + '<b>' + esc(t(a.correct ? 'correct' : 'wrong')) + '</b>' +
          '<span class="feedback__pts">' + esc(t('pts_gain', { n: a.pts })) + '</span></p>' +
          (a.correct ? '' : '<p class="feedback__ans">' + esc(t('right_answer', { a: correctOpt ? HHG.pick(correctOpt.text) : '' })) + '</p>') +
          '<p>' + esc(HHG.pick(q.explain)) + '</p></div>';
      }
      var last = sess.idx === qs.length - 1;

      c.innerHTML =
        '<section class="page page--narrow quiz">' +
          '<div class="quiz__top"><a class="back" href="#/location/' + esc(loc.id) + '">' + HHG.icon('left', 18) + '<span>' + esc(t('exit_quest')) + '</span></a>' +
            '<span class="quiz__n">' + esc(t('question_n', { n: sess.idx + 1, total: qs.length })) + '</span></div>' +
          '<div class="segs" aria-hidden="true">' + segs + '</div>' +
          '<p class="eyebrow quiz__loc">' + esc(HHG.pick(loc.name)) + '</p>' +
          '<h1 class="quiz__q">' + esc(HHG.pick(q.prompt)) + '</h1>' +
          '<ul class="opts">' + opts + '</ul>' +
          '<div class="quiz__hint">' + hintBtn + hintBox + '</div>' + fb +
          (a ? '<button type="button" class="btn btn--gold btn--lg btn--block" id="next">' + esc(t(last ? 'finish' : 'next_q')) + HHG.icon('right', 20) + '</button>' : '') +
        '</section>';

      c.querySelectorAll('.opt').forEach(function (b) {
        b.addEventListener('click', function () { Q.answer(p.id, q, b.getAttribute('data-o')); draw(true); });
      });
      var h = document.getElementById('hint');
      if (h) h.addEventListener('click', function () { Q.useHint(p.id, q.id); draw(); });
      var n = document.getElementById('next');
      if (n) n.addEventListener('click', function () { Q.next(p.id); window.scrollTo(0, 0); draw(); });
      if (focusFb) { var f = document.getElementById('fb'); if (f) { f.focus({ preventScroll: true }); f.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } }
    }
    draw();
  }
};
