// Theme toggle — works in both extension popup and standalone file:// context
(function(){
  function getTheme(cb) {
    if (globalThis.chrome?.storage?.local) {
      chrome.storage.local.get(['sting-theme'], function(r) { cb(r['sting-theme'] || 'dark'); });
    } else {
      cb(localStorage.getItem('sting-theme') || 'dark');
    }
  }
  function saveTheme(theme) {
    if (globalThis.chrome?.storage?.local) {
      chrome.storage.local.set({ 'sting-theme': theme });
    }
    try { localStorage.setItem('sting-theme', theme); } catch(_) {}
  }
  var btn = document.getElementById('theme-toggle');
  var sun = document.getElementById('icon-sun');
  var moon = document.getElementById('icon-moon');
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    sun.style.display = theme === 'dark' ? 'block' : 'none';
    moon.style.display = theme === 'light' ? 'block' : 'none';
  }
  getTheme(applyTheme);
  btn.addEventListener('click', function(){
    var next = document.body.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
    saveTheme(next);
  });
})();
