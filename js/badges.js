/* Điều kiện cấp huy hiệu. Mã huy hiệu lấy từ trang HUY_HIEU; quy tắc đặt tại đây. */
(function () {
  var S = HHG.Scoring;
  var RULES = {
    explorer: function () { return S.doneCount() >= 1; },
    adv: function () {
      var l = HHG.Content.locById['dai-noi'] || HHG.Content.locations[0];
      return !!l && S.isCompleted(l) && S.pct(l) >= 80;
    },
    master: function () {
      var ls = HHG.Content.locations;
      return ls.length > 0 && ls.every(S.isCompleted);
    }
  };
  HHG.Badges = {
    evaluate: function () {
      var st = HHG.Store.state, fresh = [];
      HHG.Content.badges.forEach(function (b) {
        var rule = RULES[b.id];
        if (rule && rule() && st.badges.indexOf(b.id) < 0) { st.badges.push(b.id); fresh.push(b.id); }
      });
      return fresh;
    },
    has: function (id) { return HHG.Store.state.badges.indexOf(id) >= 0; }
  };
})();
