import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AMIGUINHOS, SECOES } from "./content";
import PixelSprite from "./PixelSprite";
import Secao from "./Secao";

function Amiguinhos() {
  const [escolhido, setEscolhido] = useState(0);
  const amigo = AMIGUINHOS[escolhido];

  return (
    <Secao titulo={SECOES.amiguinhos} className="faby-amiguinhos">
      <div className="faby-amiguinhos-fila">
        {AMIGUINHOS.map((a, i) => (
          <motion.button
            key={a.sprite}
            type="button"
            className={`faby-amiguinho ${i === escolhido ? "faby-amiguinho-ativo" : ""}`}
            onClick={() => setEscolhido(i)}
            whileTap={{ scale: 0.92 }}
            animate={i === escolhido ? { y: [0, -10, 0] } : { y: 0 }}
            transition={
              i === escolhido
                ? { duration: 0.9, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }
                : { duration: 0.3 }
            }
            aria-pressed={i === escolhido}
          >
            <PixelSprite name={a.sprite} size={72} alt={a.nome} />
            <span className="faby-amiguinho-nome">{a.nome}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={amigo.sprite}
          className="faby-balao faby-balao-amigo"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {amigo.fala}
        </motion.p>
      </AnimatePresence>
    </Secao>
  );
}

export default Amiguinhos;
