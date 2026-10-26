/* Đọc/ghi trạng thái người chơi (localStorage) và bản nội dung lưu gần nhất */
(function () {
  var KEY = 'hhg_state_v1', CKEY = 'hhg_content_v1', VER = 1;
  var Store = HHG.Store = { state: null, ok: true, notice: false };

  function get(k) { try { return localStorage.getItem(k); } catch (e) { Store.ok = false; return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { Store.ok = false; return false; } }
  function del(k) { try { localStorage.removeItem(k); } catch (e) { Store.ok = false; } }

  function code() {
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '';
    var arr = new Uint8Array(4);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    for (var i = 0; i < 4; i++) out += abc[arr[i] % abc.length];
    return 'HH-' + out;
  }
  function fresh() {
    return { v: VER, pcode: code(), lang: 'vi', langSet: false, cv: 0,
             progress: {}, sessions: {}, badges: [], lastResult: null, updatedAt: new Date().toISOString() };
  }

  Store.load = function () {
    try { localStorage.setItem('hhg_probe', '1'); localStorage.removeItem('hhg_probe'); } catch (e) { Store.ok = false; }
    var raw = get(KEY), st = null;
    if (raw) {
      try { st = JSON.parse(raw); } catch (e) { st = null; }
      if (!st || st.v !== VER) { st = null; Store.notice = true; }
    }
    if (st && !st.langSet) st.lang = 'vi';
    Store.state = st || fresh();
    if (!st) Store.save();
    return Store.state;
  };
  Store.save = function () {
    Store.state.updatedAt = new Date().toISOString();
    return set(KEY, JSON.stringify(Store.state));
  };
  Store.reset = function () {
    var lang = Store.state.lang;
    del(KEY);
    Store.state = fresh();
    Store.state.lang = lang;
    Store.save();
  };
  Store.getCachedContent = function () {
    var raw = get(CKEY);
    if (!raw) return null;
    try { var d = JSON.parse(raw); return d && d.locations ? d : null; } catch (e) { return null; }
  };
  Store.setCachedContent = function (d) { set(CKEY, JSON.stringify(d)); };
})();
