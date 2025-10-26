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
    'https://placehold.co/500x500',
    'https://placehold.co/500x500',
    'https://placehold.co/500x500',
    'https://placehold.co/500x500',
    'https://placehold.co/500x500',
    'https://placehold.co/500x500'
  ]

  const texts = [
    'There was a time when everything felt endless, yet fleeting.',
    'Each smile held a story that faded quietly into memory.',
    'Now, only stillness remains, framed in light and shadow.'
  ]

  return (
    <div className="album-container">
      <section className="hero-section">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={controls} className="hero-title">
          Isadora Maria. O Meu Amor.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 40  }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.5 }} className="hero-subtitle">
          A vida com você é mais leve, mais sorridente, mais amável.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 40  }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} style={{ y: y1 }} className="hero-photos-stack">
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
            {photos.slice(i * 2, i * 2 + 3).map((src, j) => (
              <motion.img
                key={j}
                src={src}
                className={`stacked-photo stacked-photo-${j}`}
                style={{ y: j % 2 === 0 ? y1 : y2 }}
                whileHover={{ scale: 1.05, rotate: 0 }}
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
        <h2 className="horizontal-title">Moments in Motion</h2>
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