import { useEffect } from 'react'
import { motion, useAnimation, useViewportScroll, useTransform } from 'framer-motion'
import './isa.css'

export default function Isa() {
  const controls = useAnimation()
  const { scrollY } = useViewportScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 1.2 } })
  }, [])

  const sections = [
    { type: 'photo', src: 'https://placehold.co/600x600', alt: 'Photo 1' },
    { type: 'text', content: 'There was a time when everything felt endless, yet fleeting.' },
    { type: 'photo', src: 'https://placehold.co/600x600', alt: 'Photo 2' },
    { type: 'text', content: 'Each smile held a story that faded quietly into memory.' },
    { type: 'photo', src: 'https://placehold.co/600x600', alt: 'Photo 3' },
    { type: 'text', content: 'Now, only stillness remains, framed in light and shadow.' }
  ]

  return (
    <div className="album-container">
      <section className="hero-section">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={controls} className="hero-title">
          Jane Doe
        </motion.h1>
        <motion.div style={{ y: y1 }} className="hero-photos">
          <motion.img whileHover={{ scale: 1.05 }} src="https://placehold.co/300x300" className="hero-img" />
          <motion.img whileHover={{ scale: 1.05 }} src="https://placehold.co/300x300" className="hero-img" />
          <motion.img whileHover={{ scale: 1.05 }} src="https://placehold.co/300x300" className="hero-img" />
        </motion.div>
      </section>

      {sections.map((s, i) => (
        <motion.section
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="content-section"
        >
          {s.type === 'photo' ? (
            <motion.img
              src={s.src}
              alt={s.alt}
              className="content-photo"
              style={{ y: i % 2 === 0 ? y1 : y2 }}
            />
          ) : (
            <p className="content-text">{s.content}</p>
          )}
        </motion.section>
      ))}

      <footer className="footer">© 2025 Memories of Jane</footer>
    </div>
  )
}