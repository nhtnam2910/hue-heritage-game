/* Tính điểm, tỷ lệ điểm địa điểm, điều kiện mở khóa (mục 4.9) */
(function () {
  var S = HHG.Scoring = {
    FULL: 10, HINT: 5,
    scoreQuestion: function (correct, usedHint) { return correct ? (usedHint ? S.HINT : S.FULL) : 0; },
    max: function (loc) { return loc.questionIds.length * S.FULL; },
    progress: function (loc) { return HHG.Store.state.progress[loc.id] || null; },
    best: function (loc) { var p = S.progress(loc); return p ? p.score : 0; },
    pct: function (loc) {
      var m = S.max(loc);
      return m ? Math.min(100, Math.round(S.best(loc) / m * 100)) : 0;
    },
    isCompleted: function (loc) { var p = S.progress(loc); return !!p && p.status === 'completed'; },
    isUnlocked: function (loc) {
      var req = loc.unlock && loc.unlock.requires;
      if (!req) return true;
      var r = HHG.Content.locById[req];
      if (!r) return true;
      return S.isCompleted(r) && S.pct(r) >= (loc.unlock.minPct || 0);
    },
    stateOf: function (loc) {
      if (!S.isUnlocked(loc)) return 'locked';
      return S.isCompleted(loc) ? 'done' : 'open';
    },
    total: function () {
      return HHG.Content.locations.reduce(function (a, l) { return a + S.best(l); }, 0);
    },
    totalMax: function () {
      return HHG.Content.locations.reduce(function (a, l) { return a + S.max(l); }, 0);
    },
    doneCount: function () {
      return HHG.Content.locations.filter(S.isCompleted).length;
    }
  };
})();
