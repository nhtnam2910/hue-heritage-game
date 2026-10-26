/* Cấu hình: chỉ cần sửa file này để đổi nguồn nội dung hoặc nhà cung cấp ô bản đồ. */
window.HHG_CONFIG = {
  // Web App của Google Apps Script (đường dẫn kết thúc bằng /exec)
  CONTENT_URL: 'https://script.google.com/macros/s/AKfycbx0Of_Y4M8GoscSJBqwRGrCjv_FrMughbJalY-bxFoxkBgXU6zm-CD_9YmQw8aoUeVb/exec',
  FETCH_TIMEOUT: 6000,
  // Bản dự phòng nằm cùng website
  FALLBACK: {
    locations: 'data/locations.json',
    questions: 'data/questions.json',
    badges: 'data/badges.json'
  },
  UI_URL: 'data/ui.json',
  // Ô bản đồ
  TILE_URL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  TILE_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  // Các ô bản đồ dự phòng không cần khóa API, thử lần lượt khi ô chính không tải được
  TILE_FALLBACKS: [
    {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors'
    },
    {
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, tiles by <a href="https://www.openstreetmap.fr/">OSM France</a>',
      options: { subdomains: 'abc' }
    }
  ],
  MAP_CENTER: [16.4637, 107.5909],
  MAP_BOUNDS: [[16.15, 107.35], [16.75, 107.85]],
  // Liên kết Google Forms (để trống nếu chưa có)
  PRETEST_URL: '',
  POSTTEST_URL: '',
  SURVEY_URL: ''
};
