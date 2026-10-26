/* Bộ biểu tượng nét đường đồng nhất, vẽ tay bằng SVG (không dùng emoji hay ảnh sinh tự động) */
(function () {
  var P = {
    map: '<path d="M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7 9 4Z"/><path d="M9 4v13M15 7v13"/>',
    medal: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13 7 21l5-3 5 3-1.5-8"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
    nav: '<path d="M4 12 20 4l-8 16-2-6-6-2Z"/>',
    locate: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
    flag: '<path d="M6 21V4M6 4h11l-2 4 2 4H6"/>',
    gate: '<path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6M9 21v-5a3 3 0 0 1 6 0v5"/>',
    crown: '<path d="M4 18h16M4 18 3 8l5 4 4-7 4 7 5-4-1 10"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
    book: '<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    play: '<path d="M7 4.5v15l12-7.5-12-7.5Z"/>'
  };
  HHG.icon = function (name, size, cls) {
    return '<svg class="ic ' + (cls || '') + '" width="' + (size || 20) + '" height="' + (size || 20) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (P[name] || '') + '</svg>';
  };
  var BADGE_ICON = { explorer: 'flag', adv: 'gate', master: 'crown' };
  HHG.badgeEmblem = function (id, earned, size) {
    return '<span class="emblem ' + (earned ? 'is-on' : 'is-off') + '"><span class="emblem__in">' +
      HHG.icon(BADGE_ICON[id] || 'star', size || 28) + '</span></span>';
  };
})();
