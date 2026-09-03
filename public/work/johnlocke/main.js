/* ===========================================================================
   John Locke — sistema de movimento

   Um sistema só, não uma coleção de efeitos. Todo movimento aqui responde a
   uma pergunta: o que ele explica? O que não explica nada foi cortado.

   Ordem: utilidades de texto → scroll → ponteiro → cenas → apresentação.
   ======================================================================== */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* cubic-bezier(0.16, 1, 0.3, 1) é, na prática, um expo.out */
  var EASE = "expo.out";
  var EASE_SOFT = "power2.out";

  /* durações do sistema, em segundos */
  var D = {
    micro:      0.2,
    transition: 0.45,
    reveal:     0.9,
    cinematic:  1.4
  };

  /* ====================================================================== */
  /* UTILIDADES DE TEXTO                                                    */
  /* ====================================================================== */

  /* Envolve cada palavra numa máscara, preservando a marcação inline: um
     <em> continua sendo um <em>, e o itálico sobrevive ao split. Devolve os
     interiores agrupados por linha, medidos depois da fonte carregar. */
  function splitWords(el) {
    if (el.dataset.split === "done") return el.__lines || [];

    var inners = [];

    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var text = child.textContent;
          if (!text.trim()) return;

          var frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach(function (token) {
            if (!token) return;
            if (/^\s+$/.test(token)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            var mask = document.createElement("span");
            mask.className = "w-mask";
            var inner = document.createElement("span");
            inner.className = "w-in";
            inner.textContent = token;
            mask.appendChild(inner);
            frag.appendChild(mask);
            inners.push(inner);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);

    /* agrupa por altura: é assim que descobrimos onde a linha quebrou */
    var lines = [];
    var top = null;
    inners.forEach(function (inner) {
      var y = inner.parentNode.offsetTop;
      if (top === null || Math.abs(y - top) > 4) { lines.push([]); top = y; }
      lines[lines.length - 1].push(inner);
    });

    el.dataset.split = "done";
    el.__lines = lines;
    return lines;
  }

  /* Divide em caracteres para o efeito de escrita. O espaço continua sendo
     texto solto: não precisa de span e não deve quebrar diferente. */
  function splitChars(el) {
    if (el.dataset.split === "done") return el.__chars || [];

    var chars = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split("").forEach(function (ch) {
            if (ch === " ") { frag.appendChild(document.createTextNode(" ")); return; }
            var s = document.createElement("span");
            s.className = "ch";
            s.textContent = ch;
            frag.appendChild(s);
            chars.push(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);

    el.dataset.split = "done";
    el.__chars = chars;
    return chars;
  }

  /* ====================================================================== */
  /* ROLAGEM                                                                */
  /* ====================================================================== */

  var lenis = null;

  function bootLenis() {
    if (reduced || typeof window.Lenis === "undefined") return;

    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });

    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function scrollTo(target) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }

  function bootAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        scrollTo(target);
      });
    });
  }

  /* ====================================================================== */
  /* PONTEIRO — um listener, um ticker, todos os elementos                  */
  /* ====================================================================== */

  /* Nada persegue o cursor. Cada elemento se desloca alguns pixels e volta;
     o movimento é amortecido para não parecer preso ao mouse. */
  function bootPointer() {
    if (!hasGsap || reduced || coarse) return;

    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-magnet]"));
    if (!nodes.length) return;

    var items = nodes.map(function (el) {
      return { el: el, max: parseFloat(el.dataset.magnet) || 8, x: 0, y: 0, tx: 0, ty: 0 };
    });

    var vw = window.innerWidth, vh = window.innerHeight;
    var px = 0.5, py = 0.5, active = false;

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      px = e.clientX / vw;
      py = e.clientY / vh;
      active = true;
    }, { passive: true });

    window.addEventListener("resize", function () {
      vw = window.innerWidth; vh = window.innerHeight;
    });

    gsap.ticker.add(function () {
      if (!active) return;
      items.forEach(function (it) {
        it.tx = (px - 0.5) * 2 * it.max;
        it.ty = (py - 0.5) * 2 * it.max;
        /* amortecimento: o elemento chega atrasado, e é isso que dá peso */
        it.x += (it.tx - it.x) * 0.06;
        it.y += (it.ty - it.y) * 0.06;
        gsap.set(it.el, { x: it.x, y: it.y });
      });
    });
  }

  /* ====================================================================== */
  /* REVELAÇÕES                                                             */
  /* ====================================================================== */

  function bootReveals() {
    var items = document.querySelectorAll("[data-reveal]");

    if (!hasGsap) {
      items.forEach(function (el) { el.style.opacity = 1; });
      return;
    }

    /* agrupa por cena para que a cadência seja da composição, não da página */
    document.querySelectorAll(".scene").forEach(function (scene) {
      var group = scene.querySelectorAll("[data-reveal]");
      if (!group.length) return;

      gsap.fromTo(
        group,
        { opacity: 0, y: reduced ? 0 : 22 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? D.micro : D.reveal,
          ease: EASE,
          stagger: 0.055,
          scrollTrigger: { trigger: scene, start: "top 78%" }
        }
      );
    });
  }

  function bootLines() {
    var blocks = document.querySelectorAll("[data-lines]");
    if (!blocks.length) return;

    if (!hasGsap) {
      blocks.forEach(function (el) { el.style.opacity = 1; });
      return;
    }

    blocks.forEach(function (el) {
      var lines = splitWords(el);
      el.style.opacity = 1;
      if (!lines.length) return;

      var delay = parseFloat(el.dataset.linesDelay) || 0;
      var flat = [];
      lines.forEach(function (line) { flat = flat.concat(line); });

      if (reduced) {
        gsap.fromTo(flat, { opacity: 0 }, {
          opacity: 1, duration: D.micro,
          scrollTrigger: { trigger: el, start: "top 88%" }
        });
        return;
      }

      /* a máscara é por palavra, mas a cadência é por linha: o olho lê linhas */
      lines.forEach(function (line, i) {
        gsap.fromTo(
          line,
          { yPercent: 108 },
          {
            yPercent: 0,
            duration: D.cinematic,
            ease: EASE,
            stagger: 0.028,
            delay: delay + i * 0.09,
            scrollTrigger: { trigger: el, start: "top 86%" }
          }
        );
      });
    });
  }

  /* Escrita: o texto aparece como quem digita. Usado só na abertura e nos
     rótulos de arquivo — se tudo fosse digitado, nada seria. */
  function bootStream() {
    var blocks = document.querySelectorAll("[data-stream]");
    if (!blocks.length) return;

    if (!hasGsap) {
      blocks.forEach(function (el) { el.style.opacity = 1; });
      return;
    }

    blocks.forEach(function (el) {
      var chars = splitChars(el);
      el.style.opacity = 1;
      if (!chars.length) return;

      var delay = parseFloat(el.dataset.streamDelay) || 0;
      var speed = parseFloat(el.dataset.streamSpeed) || 0.028;

      if (reduced) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: D.micro, delay: 0 });
        gsap.set(chars, { opacity: 1 });
        return;
      }

      gsap.set(chars, { opacity: 0 });

      /* variação mínima por caractere: uma máquina de escrever não é métrica */
      gsap.to(chars, {
        opacity: 1,
        duration: 0.01,
        delay: delay,
        ease: "none",
        stagger: { each: speed, from: "start" }
      });

      /* o cursor acompanha só enquanto a linha está sendo escrita */
      if (el.dataset.streamCaret === "true") {
        var caret = document.createElement("span");
        caret.className = "caret";
        caret.setAttribute("aria-hidden", "true");
        el.appendChild(caret);
        gsap.set(caret, { opacity: 0 });
        gsap.to(caret, { opacity: 1, duration: 0.01, delay: delay });
        gsap.to(caret, { opacity: 0, duration: 0.01, delay: delay + chars.length * speed + 1.2 });
      }
    });
  }

  /* ====================================================================== */
  /* IMAGENS                                                                */
  /* ====================================================================== */

  /* Revelação por recorte: a imagem não aparece, ela é descoberta. */
  function bootClip() {
    var media = document.querySelectorAll("[data-clip]");
    if (!media.length || !hasGsap) return;

    media.forEach(function (el) {
      if (reduced) return;
      gsap.fromTo(
        el,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: D.cinematic,
          ease: EASE,
          scrollTrigger: { trigger: el, start: "top 82%" }
        }
      );
    });
  }

  /* Deslocamento lento: a imagem anda menos que o texto, e por isso o texto
     parece mais firme. 14px no total, não uma viagem de parallax. */
  function bootDrift() {
    if (!hasGsap || reduced) return;

    document.querySelectorAll("[data-drift]").forEach(function (el) {
      var amt = parseFloat(el.dataset.drift) || 12;
      gsap.fromTo(
        el,
        { y: -amt },
        {
          y: amt,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("figure") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });
  }

  /* ====================================================================== */
  /* CENA 03 — AS IDEIAS                                                    */
  /* ====================================================================== */

  /* Cada ideia abre a própria explicação. No desktop, ao passar o cursor;
     no toque, ao tocar. A altura é animada, não trocada: nada salta. */
  function bootIdeas() {
    var ideas = document.querySelectorAll("[data-idea]");
    if (!ideas.length) return;

    if (!hasGsap || reduced) {
      ideas.forEach(function (idea) {
        var body = idea.querySelector(".idea-body");
        if (body) { body.style.height = "auto"; body.style.opacity = 1; }
      });
      return;
    }

    ideas.forEach(function (idea) {
      var body = idea.querySelector(".idea-body");
      if (!body) return;

      var word = idea.querySelector(".idea-word");
      var open = false;

      /* a linha vira um alvo de foco: quem navega por teclado abre igual */
      idea.setAttribute("tabindex", "0");
      idea.setAttribute("aria-expanded", "false");

      function set(state) {
        if (state === open) return;
        open = state;
        idea.classList.toggle("is-open", state);
        idea.setAttribute("aria-expanded", String(state));

        gsap.to(body, {
          height: state ? "auto" : 0,
          opacity: state ? 1 : 0,
          duration: D.transition,
          ease: EASE_SOFT
        });

        /* a palavra cede alguns pixels: o texto empurra, não o contrário */
        if (word) gsap.to(word, { x: state ? 10 : 0, duration: D.transition, ease: EASE_SOFT });
      }

      if (coarse) {
        idea.addEventListener("click", function () { set(!open); });
      } else {
        idea.addEventListener("pointerenter", function () { set(true); });
        idea.addEventListener("pointerleave", function () { set(false); });
        idea.addEventListener("focusin", function () { set(true); });
        idea.addEventListener("focusout", function () { set(false); });
      }

      /* Enter e espaço alternam, como num disclosure */
      idea.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        set(!open);
      });
    });
  }

  /* ====================================================================== */
  /* CENA 04 — LINHA DO TEMPO                                               */
  /* ====================================================================== */

  /* O ano ativo domina; os anteriores recuam sem sumir. A barra mede o
     percurso: é a única coisa contínua da página. */
  function bootTimeline() {
    var wrap = document.getElementById("timeline");
    if (!wrap) return;

    var items = wrap.querySelectorAll("[data-tl]");
    var progress = wrap.querySelector(".timeline-progress");

    if (!hasGsap) {
      items.forEach(function (el) { el.classList.add("is-active"); });
      if (progress) progress.style.transform = "scaleY(1)";
      return;
    }

    if (progress && !reduced) {
      gsap.fromTo(
        progress,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 60%",
            end: "bottom 70%",
            scrub: 0.4
          }
        }
      );
    } else if (progress) {
      gsap.set(progress, { scaleY: 1 });
    }

    items.forEach(function (item) {
      ScrollTrigger.create({
        trigger: item,
        start: "top 65%",
        end: "bottom 45%",
        onToggle: function (self) { item.classList.toggle("is-active", self.isActive); }
      });
    });
  }

  /* ====================================================================== */
  /* CENA 05 — ERRATA                                                       */
  /* ====================================================================== */

  /* A conferência do registro, encenada. Não há sistema nenhum rodando: é a
     metáfora de alguém checando fontes antes de corrigir o texto impresso. */
  function bootProbe() {
    var probe = document.getElementById("probe");
    if (!probe || !hasGsap) return;

    var lines = probe.querySelectorAll("[data-probe]");
    if (!lines.length) return;

    if (reduced) { gsap.set(lines, { opacity: 1 }); return; }

    gsap.fromTo(
      lines,
      { opacity: 0, x: -8 },
      {
        opacity: 1,
        x: 0,
        duration: D.transition,
        ease: EASE_SOFT,
        stagger: 0.42,
        scrollTrigger: { trigger: probe, start: "top 76%" }
      }
    );
  }

  /* A tarja: o texto é apagado enquanto o leitor o lê, e devolvido depois.
     É a única coisa da página que interrompe a leitura de propósito. */
  function bootRedaction() {
    var quote = document.getElementById("redacted");
    if (!quote) return;

    var target = quote.querySelector("[data-redact]");
    if (!target) return;

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

    /* sem pin: o scroll continua sendo do leitor. A tarja acompanha. */
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: quote,
        start: "top 72%",
        end: "bottom 28%",
        scrub: 0.5
      }
    });

    tl.to(bars, {
      scaleX: 1,
      duration: 0.6,
      ease: "none",
      stagger: { each: 0.05, from: "start" }
    })
      .to({}, { duration: 0.3 })
      .to(bars, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.5,
        ease: "none",
        stagger: { each: 0.04, from: "end" }
      });
  }

  /* ====================================================================== */
  /* CENA 06 — PRIVACIDADE                                                  */
  /* ====================================================================== */

  /* Propriedade → Dados → Privacidade. As três ocupam o mesmo lugar porque
     são a mesma ideia recebendo nomes diferentes em séculos diferentes. */
  function bootMorph() {
    var morph = document.getElementById("morph");
    if (!morph || !hasGsap) return;

    var words = morph.querySelectorAll("[data-morph]");
    if (words.length < 2) return;

    if (reduced) {
      /* sem movimento, as três precisam caber: viram lista legível */
      morph.classList.add("is-static");
      gsap.set(words, { opacity: 1, position: "relative" });
      return;
    }

    gsap.set(words, { opacity: 0, yPercent: 40 });
    gsap.set(words[0], { opacity: 1, yPercent: 0 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: morph,
        start: "top 62%",
        end: "+=120%",
        scrub: 0.6
      }
    });

    for (var i = 1; i < words.length; i++) {
      tl.to(words[i - 1], { opacity: 0, yPercent: -40, duration: 1, ease: "none" }, i - 1)
        .to(words[i], { opacity: 1, yPercent: 0, duration: 1, ease: "none" }, i - 1);
    }
  }

  /* O painel: barras que preenchem e perguntas que ficam sem resposta.
     Representação abstrata — nenhum dado real, nenhuma coleta de verdade. */
  function bootConsole() {
    var box = document.getElementById("console");
    if (!box) return;

    var bars = [];
    box.querySelectorAll(".console-bar").forEach(function (bar) {
      var fill = document.createElement("i");
      fill.className = "console-fill";
      bar.appendChild(fill);
      bars.push(fill);
    });

    var marks = box.querySelectorAll("[data-console-mark]");
    var state = box.querySelector("[data-console-state]");

    if (!hasGsap) return;

    if (reduced) {
      gsap.set(bars, { scaleX: 1 });
      gsap.set(marks, { opacity: 1 });
      return;
    }

    gsap.set(marks, { opacity: 0 });

    var tl = gsap.timeline({
      scrollTrigger: { trigger: box, start: "top 74%" }
    });

    tl.fromTo(bars,
      { scaleX: 0 },
      { scaleX: 1, duration: D.reveal, ease: EASE_SOFT, stagger: 0.11 }
    );

    if (state) {
      tl.call(function () { state.textContent = "sem resposta"; }, null, "+=0.15");
    }

    tl.to(marks, { opacity: 1, duration: D.transition, ease: EASE_SOFT, stagger: 0.16 }, "-=0.1");
  }

  /* ====================================================================== */
  /* CENA 07 — CONFRONTO                                                    */
  /* ====================================================================== */

  /* As linhas se desenham conforme o leitor desce: a correspondência entre
     os dois séculos é construída à vista, não afirmada de saída. */
  function bootBridges() {
    var items = document.querySelectorAll("[data-bridge]");
    if (!items.length) return;

    if (!hasGsap) return;

    items.forEach(function (item) {
      var line = item.querySelector(".bridge-line");
      var to = item.querySelector(".bridge-to");
      if (!line) return;

      if (reduced) { gsap.set(line, { scaleX: 1 }); return; }

      var tl = gsap.timeline({
        scrollTrigger: { trigger: item, start: "top 78%" }
      });

      tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: D.reveal, ease: EASE });
      if (to) tl.fromTo(to, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: D.reveal, ease: EASE }, "-=0.55");
    });
  }

  function bootScale() {
    var beam = document.getElementById("scale-beam");
    var svg = document.getElementById("scale");
    if (!beam || !svg) return;

    /* marcações do arco, desenhadas em vez de escritas à mão no HTML */
    var ticks = svg.querySelector(".scale-ticks");
    if (ticks && !ticks.childNodes.length) {
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
          trigger: svg,
          start: "top 78%",
          end: "center center",
          scrub: 0.6
        }
      }
    );
  }

  /* ====================================================================== */
  /* LÍRIO                                                                  */
  /* ====================================================================== */

  /* O traço se desenha com dasharray: parece tinta sendo aplicada, não um
     logotipo aparecendo. Com movimento reduzido, já está pronto e só surge. */
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
        duration: D.micro,
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
        ease: EASE_SOFT,
        duration: scrub ? 1 : D.reveal,
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

  /* ====================================================================== */
  /* GRAVURAS AUSENTES                                                      */
  /* ====================================================================== */

  /* a moldura vazia entra no lugar da gravura quando não há arquivo */
  function bootMissingArt() {
    [[".plate-img", ".artifact-plate"], [".specimen-img", ".specimen"]].forEach(function (pair) {
      var img = document.querySelector(pair[0]);
      if (!img) return;
      var mark = function () {
        var host = img.closest(pair[1]);
        if (host) host.classList.add("no-image");
      };
      if (img.complete && img.naturalWidth === 0) mark();
      img.addEventListener("error", mark);
    });
  }

  /* ====================================================================== */
  /* TOM E ÍNDICE                                                           */
  /* ====================================================================== */

  /* As cenas escuras pintam o próprio fundo no CSS — a legibilidade não
     depende de JS. Aqui só avisamos os elementos fixos (dock, ajuda) que
     tom está em cena, para que troquem de cor junto. */
  function bootTone() {
    if (!hasGsap) return;

    document.querySelectorAll(".scene").forEach(function (scene) {
      ScrollTrigger.create({
        trigger: scene,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: function (self) {
          if (!self.isActive) return;
          document.body.classList.toggle("is-dark", scene.dataset.tone === "dark");
        }
      });
    });
  }

  function bootRail() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".rail-list a, .dock a")
    );
    if (!links.length || !hasGsap) return;

    document.querySelectorAll("main > .scene").forEach(function (scene) {
      ScrollTrigger.create({
        trigger: scene,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: function (self) {
          if (!self.isActive) return;
          links.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + scene.id);
          });
        }
      });
    });
  }

  /* ====================================================================== */
  /* MODO APRESENTAÇÃO                                                      */
  /* ====================================================================== */

  /* Não vira PowerPoint. Some o que é periférico, o corpo cresce um pouco e
     as setas passam de cena em cena. O site continua sendo o mesmo site. */
  function bootPresent() {
    var btn = document.getElementById("present-toggle");
    var help = document.querySelector(".present-help");
    if (!btn) return;

    var scenes = Array.prototype.slice.call(document.querySelectorAll("main > .scene"));
    var on = false;

    function currentIndex() {
      var mid = window.scrollY + window.innerHeight * 0.4;
      var best = 0;
      scenes.forEach(function (s, i) {
        if (s.offsetTop <= mid) best = i;
      });
      return best;
    }

    function go(step) {
      var i = Math.min(scenes.length - 1, Math.max(0, currentIndex() + step));
      scrollTo(scenes[i]);
    }

    function set(state) {
      on = state;
      document.body.classList.toggle("is-presenting", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.querySelector(".btn-label").textContent = on ? "Sair" : "Apresentar";
      if (help) help.hidden = !on;
      if (hasGsap) ScrollTrigger.refresh();
    }

    btn.addEventListener("click", function () { set(!on); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && on) { set(false); return; }
      if (!on) return;

      /* não sequestra o teclado de quem está digitando num campo */
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault(); go(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault(); go(-1);
      }
    });
  }

  /* ====================================================================== */
  /* PARTIDA                                                                */
  /* ====================================================================== */

  function boot() {
    bootMissingArt();
    bootLenis();
    bootAnchors();

    bootStream();
    bootLines();
    bootReveals();

    bootClip();
    bootDrift();
    bootPointer();

    bootIdeas();
    bootTimeline();
    bootProbe();
    bootRedaction();
    bootMorph();
    bootConsole();
    bootBridges();
    bootScale();
    bootLily();

    bootTone();
    bootRail();
    bootPresent();

    if (hasGsap) ScrollTrigger.refresh();
  }

  /* as quebras de linha só podem ser medidas com a fonte final carregada */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(boot).catch(boot);
  } else {
    window.addEventListener("load", boot);
  }

  /* recalcula posições quando a largura muda de verdade (não na barra de
     endereço do celular, que só mexe na altura) */
  var lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (!hasGsap) return;
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    ScrollTrigger.refresh();
  });
})();
