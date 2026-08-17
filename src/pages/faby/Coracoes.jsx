import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import PixelSprite from "./PixelSprite";

/* Chuvinha de corações: `soltar()` joga alguns pra cima a partir do centro do
   elemento que os guarda. Cada coração se limpa sozinho quando termina. */

const VIDA_MS = 1700;

export function useCoracoes() {
  const [coracoes, setCoracoes] = useState([]);
  const proximo = useRef(0);

  const soltar = useCallback((quantidade = 6) => {
    const novos = Array.from({ length: quantidade }, () => {
      proximo.current += 1;
      return {
        id: proximo.current,
        x: Math.round((Math.random() - 0.5) * 180),
        subida: 120 + Math.random() * 120,
        giro: Math.round((Math.random() - 0.5) * 60),
        atraso: Math.random() * 0.25,
        tamanho: 18 + Math.round(Math.random() * 16),
      };
    });

    setCoracoes((atuais) => [...atuais, ...novos]);

    const ids = new Set(novos.map((c) => c.id));
    setTimeout(
      () => setCoracoes((atuais) => atuais.filter((c) => !ids.has(c.id))),
      VIDA_MS + 400
    );
  }, []);

  return { coracoes, soltar };
}

export function ChuvaDeCoracoes({ coracoes }) {
  const semMovimento = useReducedMotion();

  return (
    <div className="faby-coracoes" aria-hidden="true">
      <AnimatePresence>
        {coracoes.map((c) => (
          <motion.span
            key={c.id}
            className="faby-coracao"
            initial={{ opacity: 0, x: c.x, y: 0, scale: 0.4, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: semMovimento ? -20 : -c.subida,
              scale: 1,
              rotate: semMovimento ? 0 : c.giro,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: VIDA_MS / 1000,
              delay: c.atraso,
              ease: "easeOut",
            }}
          >
            <PixelSprite name="heart" size={c.tamanho} />
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
