// Light Java/PHP highlighting, copy buttons, theme toggle and mobile navigation.
(function () {
  var KW = /^(import|public|private|protected|static|final|class|extends|implements|new|void|int|boolean|return|if|else|for|while|this|super|null|true|false|throws|try|catch|abstract|interface|function|echo|print|foreach|as|elseif|endwhile|do|switch|case|break|continue|default|global|const|array|and|or|xor|instanceof|NULL|TRUE|FALSE)$/;
  var TYPE = /^[A-Z]\w*[a-z]\w*$/; // capitalised and not ALL_CAPS constants

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function highlight(src) {
    // Split out comments and strings first so keywords inside them are left alone.
    var out = "", last = 0, m;
    var re = /(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
    while ((m = re.exec(src))) {
      out += plain(src.slice(last, m.index));
      var q = m[0][0];
      out += '<span class="' + (q === '"' || q === "'" ? "tok-str" : "tok-com") + '">' + esc(m[0]) + "</span>";
      last = re.lastIndex;
    }
    return out + plain(src.slice(last));
  }
  function plain(s) {
    return esc(s).replace(/\$[A-Za-z_]\w*|\b[A-Za-z_]\w*\b/g, function (w) {
      if (w[0] === "$") return '<span class="tok-var">' + w + "</span>";
      if (KW.test(w)) return '<span class="tok-kw">' + w + "</span>";
      if (TYPE.test(w)) return '<span class="tok-type">' + w + "</span>";
      return w;
    });
  }

  // Code may be written raw inside <script type="text/plain"> so it needs no HTML escaping.
  document.querySelectorAll('.code > script[type="text/plain"]').forEach(function (s) {
    var pre = document.createElement("pre");
    pre.textContent = s.textContent;
    s.parentNode.replaceChild(pre, s);
  });

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
