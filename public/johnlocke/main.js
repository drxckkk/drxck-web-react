/* ===========================================================================
   Locke nos dias atuais — coreografia de scroll
   Uma sequência por seção. Se um efeito não serve ao argumento, ele não existe.
   ======================================================================== */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  var EASE = "expo.out";

  /* -------------------------------------------------- gravura opcional -- */
  /* a moldura vazia entra no lugar da gravura quando não há arquivo */
  [[".plate-img", ".plate"], [".specimen-img", ".specimen"]].forEach(function (pair) {
    var img = document.querySelector(pair[0]);
    if (!img) return;
    var markMissing = function () { img.closest(pair[1]).classList.add("no-image"); };
    if (img.complete && img.naturalWidth === 0) markMissing();
    img.addEventListener("error", markMissing);
  });

  /* ------------------------------------------------------------ Lenis -- */

  var lenis = null;

  if (!reduced && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1, smoothWheel: true });

    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* âncoras: uma única página, nada recarrega */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0 });
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  });

  /* ------------------------------------------- manchete: linha por linha -- */

  function splitHeadline(el) {
    var text = el.textContent.trim().replace(/\s+/g, " ");
    el.textContent = "";

    var probes = text.split(" ").map(function (word, i, all) {
      var s = document.createElement("span");
      s.textContent = word + (i < all.length - 1 ? " " : "");
      s.style.display = "inline-block";
      el.appendChild(s);
      return s;
    });

    /* agrupa as palavras por altura: é assim que descobrimos onde a linha quebra */
    var lines = [];
    var currentTop = null;
    probes.forEach(function (span) {
      var top = span.offsetTop;
      if (currentTop === null || Math.abs(top - currentTop) > 4) {
        lines.push([]);
        currentTop = top;
      }
      lines[lines.length - 1].push(span.textContent);
    });

    el.textContent = "";
    var inners = lines.map(function (words) {
      var line = document.createElement("span");
      line.className = "line";
      var inner = document.createElement("span");
      inner.textContent = words.join("");
      line.appendChild(inner);
      el.appendChild(line);
      return inner;
    });

    el.classList.add("is-split");
    return inners;
  }

  function bootHeadline() {
    var headline = document.querySelector("[data-split]");
    if (!headline) return;

    var inners = splitHeadline(headline);

    if (!hasGsap || reduced) {
      inners.forEach(function (inner) { inner.style.transform = "none"; });
      return;
    }

    gsap.to(inners, {
      y: 0,
      duration: 1.1,
      ease: EASE,
      stagger: 0.08,
      delay: 0.1
    });
  }

  /* ---------------------------------------------------------- revelações -- */

  function bootReveals() {
    if (!hasGsap) {
      document.querySelectorAll(".reveal").forEach(function (el) { el.style.opacity = 1; });
      return;
    }

    document.querySelectorAll(".section").forEach(function (section) {
      /* a faixa de datas tem cadência própria — ver bootDatastrip */
      var items = section.querySelectorAll(".reveal:not(.datastrip-item)");
      if (!items.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: reduced ? 0 : 24 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0.4 : 0.9,
          ease: EASE,
          stagger: 0.06,
          scrollTrigger: { trigger: section, start: "top 80%" }
        }
      );
    });
  }

  /* ------------------------------------------------------ faixa de datas -- */

  /* marcos legais entram em sequência. Sem contador crescente: os números são
     datas, não métricas — animá-los como placar seria mentir sobre o que são. */
  function bootDatastrip() {
    var items = document.querySelectorAll(".datastrip-item");
    if (!items.length) return;

    if (!hasGsap) {
      Array.prototype.forEach.call(items, function (el) { el.style.opacity = 1; });
      return;
    }

    gsap.fromTo(
      items,
      { opacity: 0, y: reduced ? 0 : 18 },
      {
        opacity: 1,
        y: 0,
        duration: reduced ? 0.4 : 0.8,
        ease: EASE,
        stagger: 0.08,
        delay: reduced ? 0 : 0.5,
        scrollTrigger: { trigger: ".datastrip", start: "top 92%" }
      }
    );
  }

  /* ------------------------------------------------------------ parallax -- */

  function bootParallax() {
    if (!hasGsap || reduced) return;

    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      gsap.fromTo(
        el,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
        }
      );
    });
  }

  /* --------------------------------------------- virada: papel -> tinta -- */

  function bootEra() {
    var section = document.getElementById("transicao");
    var ink = document.querySelector(".backdrop-ink");
    var grid = document.querySelector(".backdrop-grid");
    var lines = document.querySelectorAll(".transition-line");
    if (!section || !ink) return;

    if (!hasGsap) {
      ink.style.opacity = 1;
      grid.style.opacity = 1;
      document.body.classList.add("is-modern");
      return;
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom 55%",
        scrub: reduced ? false : 0.4,
        onUpdate: function (self) {
          document.body.classList.toggle("is-modern", self.progress > 0.5);
        },
        onLeaveBack: function () { document.body.classList.remove("is-modern"); }
      }
    });

    tl.to(ink, { opacity: 1, ease: "none" }, 0)
      .to(grid, { opacity: 1, ease: "none" }, 0.35)
      .fromTo(lines, { opacity: 0, color: "#1B2430" },
              { opacity: 0.85, color: "#E6E2D6", ease: "none", stagger: 0.1 }, 0.15);
  }

  /* --------------------------------------- assinatura: o texto redigido -- */

  function bootRedaction() {
    var quote = document.getElementById("redacted");
    if (!quote) return;

    var target = quote.querySelector("[data-redact]");
    var bars = [];

    /* envolve cada palavra; o trecho marcado como data-keep nunca recebe tarja */
    (function wrap(node, keep) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (token) {
            if (!token) return;
            if (/^\s+$/.test(token)) { frag.appendChild(document.createTextNode(token)); return; }
            var word = document.createElement("span");
            word.className = "w";
            word.textContent = token;
            if (!keep) {
              var bar = document.createElement("span");
              bar.className = "bar";
              word.appendChild(bar);
              bars.push(bar);
            }
            frag.appendChild(word);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          wrap(child, keep || child.hasAttribute("data-keep"));
        }
      });
    })(target, false);

    if (!hasGsap || reduced || !bars.length) return;

    /* pin só onde há altura para isso — em telas curtas o scrub sozinho basta */
    var canPin = window.innerHeight >= 760;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: quote,
        start: canPin ? "center center" : "top 80%",
        end: canPin ? "+=120%" : "bottom 30%",
        scrub: 0.5,
        pin: canPin,
        pinSpacing: canPin,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    tl.to(bars, {
      scaleX: 1,
      duration: 0.6,
      ease: "none",
      stagger: { each: 0.06, from: "start" }
    })
      .to({}, { duration: 0.25 })
      .to(bars, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.5,
        ease: "none",
        stagger: { each: 0.045, from: "end" }
      });
  }

  /* ------------------------------------------------------------- balança -- */

  function bootScale() {
    var beam = document.getElementById("scale-beam");
    var section = document.getElementById("estado");
    if (!beam || !section) return;

    /* marcações do arco, desenhadas em vez de escritas à mão no HTML */
    var ticks = section.querySelector(".scale-ticks");
    if (ticks) {
      for (var i = 0; i <= 20; i++) {
        var a = Math.PI * (i / 20);
        var x1 = 260 - Math.cos(a) * 150, y1 = 150 - Math.sin(a) * 150;
        var len = i % 5 === 0 ? 10 : 5;
        var x2 = 260 - Math.cos(a) * (150 - len), y2 = 150 - Math.sin(a) * (150 - len);
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1.toFixed(1)); line.setAttribute("y1", y1.toFixed(1));
        line.setAttribute("x2", x2.toFixed(1)); line.setAttribute("y2", y2.toFixed(1));
        line.setAttribute("stroke", "currentColor");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("opacity", i % 5 === 0 ? "0.5" : "0.25");
        ticks.appendChild(line);
      }
    }

    if (!hasGsap) return;

    if (reduced) { gsap.set(beam, { rotation: 0 }); return; }

    gsap.fromTo(
      beam,
      { rotation: -9 },
      {
        rotation: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "center center",
          scrub: 0.6
        }
      }
    );
  }

  /* --------------------------------------------------- lírio: o traçado -- */

  /* O lírio se desenha com dasharray: parece tinta sendo aplicada, não um logo
     aparecendo. Com movimento reduzido, o traço já está pronto e só surge. */
  function drawLily(svg, trigger, scrub) {
    var paths = Array.prototype.slice.call(svg.querySelectorAll("path"));
    if (!paths.length) return;

    if (!hasGsap) {
      paths.forEach(function (p) { p.style.opacity = 1; });
      return;
    }

    if (reduced) {
      gsap.fromTo(paths, { opacity: 0 }, {
        opacity: 1,
        duration: 0.2,
        scrollTrigger: { trigger: trigger, start: "top 85%" }
      });
      return;
    }

    /* o comprimento é medido por traçado; as hastes com duas subcurvas
       (estame + antera) contam as duas, e por isso se desenham juntas */
    var lengths = paths.map(function (p) {
      var len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 0; }
      len = len || 200;
      p.style.strokeDasharray = len;
      return len;
    });

    gsap.fromTo(
      paths,
      { strokeDashoffset: function (i) { return lengths[i]; }, opacity: 1 },
      {
        strokeDashoffset: 0,
        opacity: 1,
        ease: "power2.out",
        duration: scrub ? 1 : 0.9,
        stagger: 0.09,
        scrollTrigger: scrub
          ? { trigger: trigger, start: "top 85%", end: "bottom 45%", scrub: 0.5 }
          : { trigger: trigger, start: "top 88%" }
      }
    );
  }

  function bootLily() {
    document.querySelectorAll(".tailpiece .lily").forEach(function (svg) {
      drawLily(svg, svg.closest(".tailpiece"), false);
    });

    var scrubbed = document.querySelector(".lily-scrub");
    if (scrubbed) drawLily(scrubbed, scrubbed.closest(".specimen"), true);
  }

  /* ------------------------------------------------------ índice ativo -- */

  function bootRail() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".rail-list a, .dock a")
    );
    if (!links.length || !hasGsap) return;

    document.querySelectorAll("main > section, main > footer").forEach(function (section) {
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: function (self) {
          if (!self.isActive) return;
          links.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + section.id
            );
          });
        }
      });
    });
  }

  /* ---------------------------------------------------------------- boot -- */

  function boot() {
    bootHeadline();
    bootReveals();
    bootDatastrip();
    bootParallax();
    bootEra();
    bootRedaction();
    bootScale();
    bootLily();
    bootRail();
    if (hasGsap) ScrollTrigger.refresh();
  }

  /* as linhas da manchete só podem ser medidas com a fonte final carregada */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(boot);
  } else {
    window.addEventListener("load", boot);
  }

  /* recalcula pin e scrub quando a altura da janela muda de verdade */
  var lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (!hasGsap) return;
    if (window.innerWidth !== lastW) { lastW = window.innerWidth; }
    ScrollTrigger.refresh();
  });
})();
