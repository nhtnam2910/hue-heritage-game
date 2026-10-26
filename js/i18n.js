/* Đa ngôn ngữ: t(key) cho giao diện, pick(obj) cho nội dung có trường vi/en */
(function () {
  var I18n = HHG.I18n = { ui: {} };

  I18n.init = function () {
    return HHG.fetchJson(HHG_CONFIG.UI_URL, 8000).then(function (d) { I18n.ui = d; });
  };
  I18n.lang = function () { return HHG.Store.state.lang || 'vi'; };
  I18n.setLang = function (l) {
    HHG.Store.state.lang = l;
    HHG.Store.state.langSet = true;
    HHG.Store.save();
    document.documentElement.lang = l;
    HHG.renderChrome();
    HHG.Router.refresh();
  };
  HHG.t = function (key, vars) {
    var e = I18n.ui[key];
    var s = e ? (e[I18n.lang()] || e.vi) : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  };
  HHG.pick = function (obj) {
    if (!obj) return '';
    return obj[I18n.lang()] || obj.vi || '';
  };
})();
