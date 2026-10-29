// Light Java highlighting, copy buttons, theme toggle and mobile navigation.
(function () {
  var KW = /^(import|public|private|protected|static|final|class|extends|implements|new|void|int|boolean|return|if|else|for|while|this|super|null|true|false|throws|try|catch)$/;
  var TYPE = /^[A-Z]\w*[a-z]\w*$/; // capitalised and not ALL_CAPS constants

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function highlight(src) {
    // Split out comments and strings first so keywords inside them are left alone.
    var out = "", re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*")/g, last = 0, m;
    while ((m = re.exec(src))) {
      out += plain(src.slice(last, m.index));
      out += '<span class="' + (m[0][0] === '"' ? "tok-str" : "tok-com") + '">' + esc(m[0]) + "</span>";
      last = re.lastIndex;
    }
    return out + plain(src.slice(last));
  }
  function plain(s) {
    return esc(s).replace(/\b[A-Za-z_]\w*\b/g, function (w) {
      if (KW.test(w)) return '<span class="tok-kw">' + w + "</span>";
      if (TYPE.test(w)) return '<span class="tok-type">' + w + "</span>";
      return w;
    });
  }

  document.querySelectorAll(".code pre").forEach(function (pre) {
    var raw = pre.textContent.replace(/^\n/, "");
    pre.innerHTML = highlight(raw);
    var btn = document.createElement("button");
    btn.className = "copy";
    btn.textContent = "Copy";
    btn.onclick = function () {
      navigator.clipboard.writeText(raw).then(function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1200);
      });
    };
    pre.parentNode.appendChild(btn);
  });

  var root = document.documentElement;
  try { var saved = localStorage.getItem("ajp-theme"); if (saved) root.dataset.theme = saved; } catch (e) {}
  var tb = document.querySelector(".theme-btn");
  if (tb) tb.onclick = function () {
    var dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("ajp-theme", root.dataset.theme); } catch (e) {}
  };

  // Mobile: "Contents" button that opens the topic list, closing it after a jump.
  var nav = document.querySelector("nav.side");
  var list = nav && nav.querySelector("ol");
  if (list) {
    var toc = document.createElement("button");
    toc.className = "toc-btn";
    toc.textContent = "Contents";
    toc.setAttribute("aria-expanded", "false");
    toc.onclick = function () {
      var open = nav.classList.toggle("open");
      toc.setAttribute("aria-expanded", open);
      toc.textContent = open ? "Close" : "Contents";
    };
    nav.insertBefore(toc, nav.querySelector(".pages"));
    list.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toc.setAttribute("aria-expanded", "false");
        toc.textContent = "Contents";
      });
    });
  }

  // Keep the current page's pill in view when the pill row scrolls sideways.
  var on = document.querySelector(".pages a.on");
  if (on) on.parentNode.scrollLeft = on.offsetLeft - on.parentNode.clientWidth / 2 + on.clientWidth / 2;

  var up = document.createElement("button");
  up.className = "top-btn";
  up.textContent = "↑";
  up.setAttribute("aria-label", "Back to top");
  up.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };
  document.body.appendChild(up);
  window.addEventListener("scroll", function () {
    up.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
})();
