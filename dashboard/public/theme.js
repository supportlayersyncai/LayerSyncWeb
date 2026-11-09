// Applied before first paint so there's no light/dark flash. A file, not an
// inline script, so the Content-Security-Policy can forbid inline scripts.
(function () {
  try {
    var saved = localStorage.getItem("syncsite-theme");
    var dark = saved ? saved === "dark" : true;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
