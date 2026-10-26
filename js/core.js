/* Không gian tên chung và các hàm tiện ích */
window.HHG = {
  views: {},
  Content: { locations: [], questions: [], badges: [], locById: {}, qById: {}, version: 0, source: '' }
};

HHG.esc = function (s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};

HHG.dirUrl = function (loc) {
  return 'https://www.google.com/maps/dir/?api=1&destination=' + loc.position.lat + ',' + loc.position.lng;
};

HHG.setContent = function (d) {
  var C = HHG.Content;
  C.locations = (d.locations || []).slice().sort(function (a, b) { return a.order - b.order; });
  C.questions = d.questions || [];
  C.badges = d.badges || [];
  C.version = d.contentVersion || 1;
  C.locById = {}; C.qById = {};
  C.locations.forEach(function (l) { C.locById[l.id] = l; });
  C.questions.forEach(function (q) { C.qById[q.id] = q; });
};

HHG.fetchJson = function (url, timeout) {
  var ctl = new AbortController();
  var timer = setTimeout(function () { ctl.abort(); }, timeout || 8000);
  return fetch(url, { signal: ctl.signal, cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .finally(function () { clearTimeout(timer); });
};
