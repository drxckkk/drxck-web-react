import { useEffect } from 'react'
import { motion, useAnimation, useViewportScroll, useTransform } from 'framer-motion'
import './Album.css'

export default function Album() {
  const controls = useAnimation()
  const { scrollY } = useViewportScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 1.2 } })
  }, [])

  const photos = [
    require('../assets/album/photo1.jpg'),
    require('../assets/album/photo2.jpg'),
    require('../assets/album/photo5.jpg'),
    require('../assets/album/photo6.jpg'),
    require('../assets/album/photo7.jpg'),
    require('../assets/album/photo11.jpg'),
    require('../assets/album/photo13.jpg'),
    require('../assets/album/photo12.jpg'),
    require('../assets/album/photo16.jpg'),
    require('../assets/album/photo15.png'),
    require('../assets/album/photo8.png'),
    require('../assets/album/photo13.jpg'),
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

  useEffect(() => {
    const particles = [];
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.body.appendChild(container);

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${5 + Math.random() * 10}s`;
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => container.remove();
  }, []);

  return (
    <div className="album-container">
      <section className="hero-section">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={controls} className="hero-title">
          Isadora Maria. O Meu Amor.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.5 }} className="hero-subtitle">
          A vida com você é mais leve, mais sorridente, mais amável.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} style={{ y: y1 }} className="hero-photos-stack">
          {photos.slice(0, 3).map((src, i) => (
            <motion.img
              key={i}
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