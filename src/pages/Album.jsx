import { useEffect, useRef } from 'react'
import { delay, motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import './Album.css'

export default function Album() {
  const parallaxRefs = useRef([]);
  const canvasRef = useRef(null);
  const heartsRef = useRef([]);
  const audioRef = useRef(null);
  const controls = useAnimation()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -100])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      parallaxRefs.current.forEach((el, i) => {
        const speed = 0.2 + i * 0.1;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
    }));

    const hearts = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 24 + 10,
      speed: Math.random() * 0.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.5,
      angle: Math.random() * Math.PI * 2,
      swing: Math.random() * 1.5 + 0.5,
    }));
    heartsRef.current = hearts;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      particles.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += dx / dist * 0.1;
          p.y += dy / dist * 0.1;
        }
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      heartsRef.current.forEach((h) => {
        h.y += h.speed;
        h.x += Math.sin(h.angle) * h.swing;
        h.angle += 0.01;
        if (h.y > canvas.height + 50) {
          h.y = -50;
          h.x = Math.random() * canvas.width;
          h.size = Math.random() * 24 + 10;
          h.opacity = Math.random() * 0.5 + 0.5;
        }
        ctx.font = `${h.size}px serif`;
        ctx.globalAlpha = h.opacity;
        ctx.fillText('❤️', h.x, h.y);
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    draw();

    const playMusic = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.4;
        audio.play();
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            if (audio.volume > 0.01) audio.volume -= 0.001;
            else {
              clearInterval(fadeOut);
              audio.pause();
            }
          }, 1000);
        }, 240000);
      }
      window.removeEventListener('click', playMusic);
    };
    window.addEventListener('click', playMusic);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', playMusic);
    };
  }, []);

  const photos = [
    require('../assets/album/photo1.jpg'),
    require('../assets/album/photo2.jpg'),
    require('../assets/album/photo5.jpg'),
    require('../assets/album/photo6.jpg'),
    require('../assets/album/photo7.jpg'),
    require('../assets/album/photo8.png'),
    require('../assets/album/photo13.jpg'),
    require('../assets/album/photo12.jpg'),
    require('../assets/album/photo16.jpg'),
    require('../assets/album/photo15.png'),
    require('../assets/album/photo17.jpg'),
    require('../assets/album/photo16.jpg'),
  ]

  const texts = [
    'Seu olhar, seu jeito de ser e o seu lindo sorriso preenchem cada canto do meu mundo. Você é a melodia que embala meus dias e a pessoa que me transformou. Cada eu te amo é uma promessa de um amanhã mais radiante. Na qual você é a mulher da minha vida e quem eu quero amar para sempre, com quem eu sempre sonhei em ver no altar.',
    'Agora, com você, meu amor, cada momento é uma nova página em branco, pronta pra ser preenchida com amor e alegria.',
    'Com você, aprendi que o amor verdadeiro é aquele que cresce a cada dia, mesmo nas pequenas coisas.',
    'Você é minha maior alegria, meu maior desejo, quem eu quero acordar e ver ao meu lado todos os dias, a razão do meu sorriso e a luz que ilumina meus olhos. Eu irei sempre continuar amando essa mulher perfeita que você é. Eu quero você pra sempre, desde a nossa primeira conversa minha mente esteve tão vidrado em você que tentava evitar meus pensamentos com você. Mas meu coração prevalece e fala mais alto. Você é a mais bela e perfeita como sempre achei e sempre foi verdade, e como sua perfeição beira as barreiras dos portões do paraíso, amor.'
  ]

  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_3a7b75f3e4.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    const playMusic = () => {
      audio.play().catch(() => { });
      window.removeEventListener('click', playMusic);
    };
    window.addEventListener('click', playMusic);
    return () => audio.pause();
  }, []);

  return (
    <div className="album-container">
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      <section className="hero-section">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.5 }} className="hero-title">
          Isadora Maria. O Meu Amor.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.5 }} className="hero-subtitle">
          A vida com você é mais leve, mais sorridente, mais amável.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} style={{ y: y1 }} className="hero-photos-stack">
          {photos.slice(0, 3).map((src, i) => (
            <motion.img
              key={i}
              ref={(el) => (parallaxRefs.current[i] = el)}
              src={src}
              className={`stacked-photo stacked-photo-${i}`}
              whileHover={{ scale: 1.07, rotate: 0 }}
            />
          ))}
        </motion.div>
      </section>

      {texts.map((t, i) => (
        <section key={i} className="content-section">
          <motion.div
            className="photo-stack"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {photos.slice(i * 2 + 3, i * 2 + 6).map((src, j) => (
              <motion.img
                key={j}
                src={src}
                className={`stacked-photo stacked-photo-${j}`}
                whileHover={{ scale: 1.07, rotate: 15 }}
              />
            ))}
          </motion.div>
          <motion.p
            className="content-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {t}
          </motion.p>
        </section>
      ))}

      <section className="horizontal-section">
        <h2 className="content-text">Nós. Você</h2>
        <h1 initial={{ opacity: 0, y: 40 }} animate={controls} className="content-text">
          Eu amo você mais do que tudo. E não há palavras suficientes pra descrever o amor que sinto por você neném. Eu amo, elogio, idolatro e quero sentir tudo em você AMOR! Seu rosto, seus olhos, seu cabelo, sua beleza surreal e seu jeito de ser são tão incríveis! Eu te quero demais e para todo o sempre minha princesa linda!
        </h1>
        <div className="horizontal-scroll">
          {photos.concat(photos).map((src, i) => (
            <motion.img
              key={i}
              src={src}
              className="horizontal-photo"
              whileHover={{ scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}