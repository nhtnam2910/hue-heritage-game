/* Điều phối luồng hỏi đáp. Phiên làm bài được lưu để người chơi quay lại làm tiếp. */
(function () {
  var S = HHG.Scoring, Store = HHG.Store;
  var Quiz = HHG.Quiz = {
    session: function (id) { return Store.state.sessions[id] || null; },
    start: function (id) {
      var s = { idx: 0, answers: {}, hints: {} };
      Store.state.sessions[id] = s;
      Store.save();
      return s;
    },
    questions: function (loc) {
      return loc.questionIds.map(function (q) { return HHG.Content.qById[q]; }).filter(Boolean);
    },
    useHint: function (id, qid) {
      var s = Quiz.session(id);
      if (s && !s.answers[qid]) { s.hints[qid] = true; Store.save(); }
    },
    answer: function (id, q, choice) {
      var s = Quiz.session(id);
      if (!s || s.answers[q.id]) return null;
      var ok = choice === q.correct;
      var a = { choice: choice, correct: ok, hint: !!s.hints[q.id], pts: S.scoreQuestion(ok, !!s.hints[q.id]) };
      s.answers[q.id] = a;
      Store.save();
      return a;
    },
    next: function (id) { var s = Quiz.session(id); s.idx++; Store.save(); },
    finish: function (id) {
      var loc = HHG.Content.locById[id], s = Quiz.session(id), st = Store.state;
      var qs = Quiz.questions(loc);
      var before = {};
      HHG.Content.locations.forEach(function (l) { before[l.id] = S.isUnlocked(l); });

      var score = 0, right = 0;
      qs.forEach(function (q) {
        var a = s.answers[q.id];
        if (a) { score += a.pts; if (a.correct) right++; }
      });
      var prev = st.progress[id];
      var isBest = !prev || score > prev.score;
      if (isBest) st.progress[id] = { status: 'completed', score: score, max: qs.length * S.FULL, answers: s.answers };
      else prev.status = 'completed';
      delete st.sessions[id];
      st.cv = HHG.Content.version;

      var newBadges = HHG.Badges.evaluate();
      var unlocked = HHG.Content.locations.filter(function (l) { return !before[l.id] && S.isUnlocked(l); })
        .map(function (l) { return l.id; });
      var nextLocked = HHG.Content.locations.filter(function (l) {
        return l.unlock && l.unlock.requires === id && !S.isUnlocked(l);
      });
      st.lastResult = { id: id, score: score, max: qs.length * S.FULL, right: right, total: qs.length,
                        isBest: isBest, newBadges: newBadges, unlocked: unlocked,
                        needPct: nextLocked.length ? nextLocked[0].unlock.minPct : 0 };
      Store.save();
      return st.lastResult;
    }
  };
})();
