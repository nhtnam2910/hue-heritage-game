HHG.views.map = (function () {
  var map = null;

  function unlockText(loc) {
    var req = HHG.Content.locById[loc.unlock.requires];
    return HHG.t('unlock_hint', { name: req ? HHG.pick(req.name) : '', pct: loc.unlock.minPct });
  }
  function statusLabel(s) { return HHG.t(s === 'done' ? 'status_done' : s === 'locked' ? 'status_locked' : 'status_open'); }

  function pin(state, n) {
    var fill = { open: '#D9A441', done: '#2E9E5B', locked: '#8E8A99' }[state];
    var inner = state === 'done'
      ? '<path d="M14.5 19.5l3.7 3.7 7.3-7.6" fill="none" stroke="#1E7F46" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
      : state === 'locked'
        ? '<rect x="14.5" y="19" width="11" height="8" rx="1.8" fill="#6F6A7A"/><path d="M16.8 19v-2.4a3.2 3.2 0 0 1 6.4 0V19" fill="none" stroke="#6F6A7A" stroke-width="2"/>'
        : '<text x="20" y="25" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-weight="700" font-size="14" fill="#4A1F70">' + n + '</text>';
    return L.divIcon({
      className: 'pin-wrap', iconSize: [40, 52], iconAnchor: [20, 50], popupAnchor: [0, -44],
      html: '<svg class="pin" viewBox="0 0 40 52" width="40" height="52" aria-hidden="true"><path d="M20 50S4 32 4 19a16 16 0 0 1 32 0c0 13-16 31-16 31Z" fill="' + fill + '" stroke="#fff" stroke-width="3"/><circle cx="20" cy="21" r="10.5" fill="#fff"/>' + inner + '</svg>'
    });
  }

  function popup(loc, s) {
    var esc = HHG.esc, t = HHG.t;
    return '<div class="pop"><span class="chip chip--' + s + '">' + esc(statusLabel(s)) + '</span>' +
      '<h3 class="pop__t">' + esc(HHG.pick(loc.name)) + '</h3>' +
      (s === 'locked' ? '<p class="pop__p">' + esc(unlockText(loc)) + '</p>' : '') +
      '<div class="pop__acts">' +
        (s !== 'locked' ? '<a class="btn btn--primary btn--sm" href="#/location/' + esc(loc.id) + '">' + esc(t('view_location')) + '</a>' : '') +
        '<a class="btn btn--ghost btn--sm" target="_blank" rel="noopener" href="' + esc(HHG.dirUrl(loc)) + '">' + HHG.icon('nav', 16) + esc(t('directions')) + '</a>' +
      '</div></div>';
  }

  function initMap(box, failEl) {
    if (typeof L === 'undefined') { failEl.hidden = false; return; }
    var cfg = HHG_CONFIG, locs = HHG.Content.locations;
    map = L.map(box, { minZoom: 11, maxZoom: 18, maxBounds: cfg.MAP_BOUNDS, maxBoundsViscosity: .8, scrollWheelZoom: false, tap: false });
    var sources = [{ url: cfg.TILE_URL, attribution: cfg.TILE_ATTRIBUTION }].concat(cfg.TILE_FALLBACKS || []);
    var tiles = null;
    function useSource(i) {
      if (tiles) map.removeLayer(tiles);
      var s = sources[i], errs = 0, ok = 0;
      tiles = L.tileLayer(s.url, L.extend({ attribution: s.attribution, maxZoom: 19 }, s.options || {})).addTo(map);
      tiles.on('tileload', function () { ok++; failEl.hidden = true; });
      tiles.on('tileerror', function () {
        errs++;
        if (errs > 2 && !ok) {
          if (i + 1 < sources.length) useSource(i + 1); else failEl.hidden = false;
        }
      });
    }
    useSource(0);
    var pts = [];
    locs.forEach(function (loc) {
      var s = HHG.Scoring.stateOf(loc), p = [loc.position.lat, loc.position.lng];
      pts.push(p);
      L.marker(p, { icon: pin(s, loc.order), title: HHG.pick(loc.name), keyboard: true, alt: HHG.pick(loc.name) })
        .addTo(map).bindPopup(popup(loc, s), { minWidth: 210, maxWidth: 260 });
    });
    if (pts.length > 1) map.fitBounds(pts, { padding: [48, 48], maxZoom: 16 });
    else map.setView(pts[0] || cfg.MAP_CENTER, 15);
    setTimeout(function () { if (map) map.invalidateSize(); }, 150);
  }

  function locate(btn) {
    if (!navigator.geolocation || !map) return;
    btn.disabled = true;
    navigator.geolocation.getCurrentPosition(function (pos) {
      btn.disabled = false;
      var p = [pos.coords.latitude, pos.coords.longitude];
      L.circleMarker(p, { radius: 8, color: '#fff', weight: 3, fillColor: '#2B6CB0', fillOpacity: 1 }).addTo(map);
      map.setView(p, Math.max(map.getZoom(), 15));
    }, function () { btn.disabled = false; HHG.toast(HHG.t('loc_denied')); }, { timeout: 10000 });
  }

  return {
    title: function () { return HHG.t('map_title'); },
    destroy: function () { if (map) { map.remove(); map = null; } },
    render: function (c) {
      var esc = HHG.esc, t = HHG.t, S = HHG.Scoring, C = HHG.Content;
      var total = S.total(), tmax = S.totalMax() || 1, done = S.doneCount();
      var items = C.locations.map(function (loc) {
        var s = S.stateOf(loc);
        var meta = s === 'done' ? t('best_score', { s: S.best(loc), m: S.max(loc) }) : s === 'locked' ? unlockText(loc) :
          (HHG.Quiz.session(loc.id) ? t('in_progress') : t('not_played'));
        var tag = s === 'locked' ? 'button type="button" data-locked="' + esc(loc.id) + '"' : 'a href="#/location/' + esc(loc.id) + '"';
        var end = s === 'locked' ? 'button' : 'a';
        return '<li><' + tag + ' class="loc loc--' + s + '">' +
          '<span class="loc__n">' + (s === 'done' ? HHG.icon('check', 20) : s === 'locked' ? HHG.icon('lock', 18) : loc.order) + '</span>' +
          '<span class="loc__b"><b>' + esc(HHG.pick(loc.name)) + '</b><small>' + esc(meta) + '</small></span>' +
          '<span class="chip chip--' + s + '">' + esc(statusLabel(s)) + '</span></' + end + '></li>';
      }).join('');

      c.innerHTML =
        '<div class="page page--wide">' +
          '<div class="summary">' +
            '<div class="summary__score"><span class="eyebrow">' + esc(t('total_score')) + '</span><b>' + total + '<small> / ' + tmax + '</small></b></div>' +
            '<div class="summary__bar"><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + tmax + '" aria-valuenow="' + total + '"><i style="width:' + Math.round(total / tmax * 100) + '%"></i></div>' +
            '<p>' + esc(t('places_done', { n: done, m: C.locations.length })) + '</p></div>' +
          '</div>' +
          '<div class="maplay">' +
            '<div class="mapwrap"><div id="map" class="map" aria-label="' + esc(t('map_title')) + '"></div>' +
              '<button type="button" class="map__locate" id="locate">' + HHG.icon('locate', 18) + '<span>' + esc(t('my_location')) + '</span></button>' +
              '<p class="map__fail" id="mapfail" hidden>' + esc(t('map_fail')) + '</p></div>' +
            '<div class="maplay__list"><h1 class="h2">' + esc(t('list_title')) + '</h1><ul class="loclist">' + items + '</ul></div>' +
          '</div>' +
        '</div>';

      initMap(document.getElementById('map'), document.getElementById('mapfail'));
      document.getElementById('locate').addEventListener('click', function () { locate(this); });
      c.querySelectorAll('[data-locked]').forEach(function (b) {
        b.addEventListener('click', function () {
          var loc = C.locById[b.getAttribute('data-locked')];
          HHG.dialog({ title: t('locked_title'), msg: unlockText(loc) });
        });
      });
    }
  };
})();
