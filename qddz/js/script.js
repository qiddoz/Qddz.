/* ==========================================================
   Qddz | script.js  | Author: Aqid | IMD318 Individual Project
   Features: live clock, greeting, notification toast, typing text,
   skill bars, scroll reveal, accessibility tools, site search,
   gallery lightbox, form validation, visit counter, back-to-top.
   ========================================================== */
(function () {
  "use strict";

  /* Small safe wrapper around localStorage (it can throw in private mode) */
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ---------- 1. Live clock (Malaysia time, UTC+8) ---------- */
  var clockTime = document.getElementById("clockTime");
  var clockDate = document.getElementById("clockDate");
  function tick() {
    var now = new Date();
    if (clockTime) clockTime.textContent = now.toLocaleTimeString("en-MY", { hour12: false, timeZone: "Asia/Kuala_Lumpur" });
    if (clockDate) clockDate.textContent = now.toLocaleDateString("en-MY", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kuala_Lumpur"
    });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- 2. Time-based greeting ---------- */
  var greet = document.getElementById("greeting");
  if (greet) {
    var h = Number(new Date().toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kuala_Lumpur" }));
    greet.textContent = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }

  /* ---------- 3. Typing effect ---------- */
  var typer = document.getElementById("typer");
  if (typer) {
    var words = ["a Web Designer in training.", "an IMD318 student at UiTM.", "a lifelong learner.", "the person behind Qddz."];
    var w = 0, c = 0, del = false;
    (function type() {
      var word = words[w];
      typer.textContent = word.slice(0, c);
      if (!del && c < word.length) { c++; setTimeout(type, 70); }
      else if (!del) { del = true; setTimeout(type, 1400); }
      else if (c > 0) { c--; setTimeout(type, 35); }
      else { del = false; w = (w + 1) % words.length; setTimeout(type, 300); }
    })();
  }

  /* ---------- 4. Toast notification + optional chime ---------- */
  var toast = document.getElementById("toast");
  function showToast(msg) {
    if (!toast) return;
    toast.querySelector(".msg").textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 6000);
  }
  if (toast) {
    toast.querySelector("button").addEventListener("click", function () { toast.classList.remove("show"); });
    var visits = Number(store("qddzVisits") || 0) + 1;
    store("qddzVisits", String(visits));
    var vc = document.getElementById("visitCount");
    if (vc) vc.textContent = visits;
    setTimeout(function () {
      showToast(visits === 1 ? "Welcome to Qddz! Take a look around." : "Welcome back! This is your visit #" + visits + ".");
    }, 1200);
  }
  var chimeBtn = document.getElementById("chimeBtn");
  if (chimeBtn) chimeBtn.addEventListener("click", function () {
    var a = new Audio("media/chime.mp3");
    a.play().catch(function () {});
    showToast("Ding! Sound is working.");
  });

  /* ---------- 5. Skill bars + scroll reveal ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.querySelectorAll(".fill").forEach(function (f) { f.style.width = f.dataset.v + "%"; });
      io.unobserve(en.target);
    });
  }, { threshold: .15 }) : null;
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (io) io.observe(el);
    else { el.classList.add("in"); el.querySelectorAll(".fill").forEach(function (f) { f.style.width = f.dataset.v + "%"; }); }
  });

  /* ---------- 6. Accessibility tools ---------- */
  var body = document.body;
  var size = Number(store("qddzFont") || 16);
  function applySize() { document.documentElement.style.setProperty("--fs", size + "px"); store("qddzFont", String(size)); }
  applySize();
  if (store("qddzHC") === "1") body.classList.add("hc");
  if (store("qddzText") === "1") body.classList.add("textonly");
  function on(id, fn) { var el = document.getElementById(id); if (el) el.addEventListener("click", fn); }
  on("fontUp", function () { size = Math.min(24, size + 2); applySize(); });
  on("fontDown", function () { size = Math.max(12, size - 2); applySize(); });
  on("hcBtn", function () { store("qddzHC", body.classList.toggle("hc") ? "1" : "0"); });
  on("textBtn", function () { store("qddzText", body.classList.toggle("textonly") ? "1" : "0"); });

  /* ---------- 7. Back to top ---------- */
  var topBtn = document.getElementById("topBtn");
  if (topBtn) {
    window.addEventListener("scroll", function () { topBtn.classList.toggle("show", window.scrollY > 400); });
    topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- 8. Site search (client-side) ---------- */
  var pages = [
    ["Home", "index.html", "welcome qddz aqid portfolio clock"],
    ["Biodata", "biodata.html", "profile name age hobbies about me personal details"],
    ["Experience", "experience.html", "work internship job volunteer timeline"],
    ["Education", "education.html", "school uitm diploma spm results subjects"],
    ["Skills", "skills.html", "html css javascript tools languages"],
    ["Family", "family.html", "parents siblings family tree"],
    ["Gallery", "gallery.html", "photos pictures video audio media"],
    ["Contact", "contact.html", "email phone message form social"],
    ["Site Map", "sitemap.html", "map pages navigation links search"],
    ["Reflection", "reflection.html", "design choices challenges lessons learned"]
  ];
  var sIn = document.getElementById("siteSearch"), sOut = document.getElementById("searchResults");
  if (sIn && sOut) sIn.addEventListener("input", function () {
    var q = sIn.value.trim().toLowerCase();
    sOut.innerHTML = "";
    if (!q) return;
    var hits = pages.filter(function (p) { return (p[0] + " " + p[2]).toLowerCase().indexOf(q) > -1; });
    if (!hits.length) { sOut.innerHTML = "<li class='muted'>No pages match \"" + q.replace(/[<>&]/g, "") + "\".</li>"; return; }
    hits.forEach(function (p) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = p[1]; a.textContent = p[0]; li.appendChild(a); sOut.appendChild(li);
    });
  });

  /* ---------- 9. Gallery lightbox ---------- */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    document.querySelectorAll(".gallery img").forEach(function (img) {
      img.addEventListener("click", function () { lbImg.src = img.dataset.full || img.src; lbImg.alt = img.alt; lb.classList.add("open"); });
    });
    lb.addEventListener("click", function () { lb.classList.remove("open"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("open"); });
  }

  /* ---------- 10. Contact form validation ---------- */
  var form = document.getElementById("contactForm");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    function check(id, test, msg) {
      var el = document.getElementById(id), err = document.getElementById(id + "Err");
      var good = test(el.value.trim());
      err.textContent = good ? "" : msg;
      if (!good) ok = false;
    }
    check("cName", function (v) { return v.length >= 2; }, "Please enter your name.");
    check("cEmail", function (v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }, "Enter a valid email address.");
    check("cMsg", function (v) { return v.length >= 10; }, "Message must be at least 10 characters.");
    if (ok) { showToast("Thanks! Your message is ready to send (demo form)."); form.reset(); }
  });

  /* ---------- 11. Days-since counter (used on Education page) ---------- */
  var days = document.getElementById("daysCounter");
  if (days) {
    var start = new Date(days.dataset.start);
    days.textContent = Math.floor((Date.now() - start.getTime()) / 86400000).toLocaleString();
  }

  /* ---------- 12. Keep the image map accurate when the picture is resized ---------- */
  var mapImg = document.getElementById("mapImg");
  if (mapImg) {
    var areas = document.querySelectorAll("#homeMapEl area");
    var orig = Array.prototype.map.call(areas, function (a) { return a.getAttribute("coords").split(",").map(Number); });
    function scaleMap() {
      var k = mapImg.clientWidth / 800;
      areas.forEach(function (a, i) { a.coords = orig[i].map(function (n) { return Math.round(n * k); }).join(","); });
    }
    mapImg.addEventListener("load", scaleMap); window.addEventListener("resize", scaleMap); scaleMap();
  }
})();
