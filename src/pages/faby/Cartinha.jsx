import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CARTINHA, SECOES } from "./content";
import PixelSprite from "./PixelSprite";
import Secao from "./Secao";

const EASE = [0.16, 1, 0.3, 1];

function Cartinha() {
  const [aberta, setAberta] = useState(false);

  return (
    <Secao titulo={SECOES.cartinha} className="faby-cartinha">
      <AnimatePresence mode="wait" initial={false}>
        {!aberta ? (
          <motion.button
            key="envelope"
            type="button"
            className="faby-envelope"
            onClick={() => setAberta(true)}
            aria-label="Abrir a cartinha"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <span className="faby-envelope-aba" aria-hidden="true" />
            <span className="faby-envelope-selo">
              <PixelSprite name="heart" size={26} />
            </span>
            <span className="faby-envelope-aviso">{CARTINHA.aviso}</span>
          </motion.button>
        ) : (
          <motion.article
            key="carta"
            className="faby-carta"
            initial={{ opacity: 0, y: 24, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="faby-carta-topo">
              <PixelSprite name="myMelody" size={54} alt="My Melody" />
              <h3 className="faby-carta-titulo">{CARTINHA.titulo}</h3>
            </div>

            {CARTINHA.paragrafos.map((paragrafo, i) => (
              <motion.p
                key={paragrafo}
                className="faby-carta-texto"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.18, ease: EASE }}
              >
                {paragrafo}
              </motion.p>
            ))}

            <motion.p
              className="faby-carta-assinatura"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 + CARTINHA.paragrafos.length * 0.18 }}
            >
              {CARTINHA.assinatura}
            </motion.p>
          </motion.article>
        )}
      </AnimatePresence>
    </Secao>
  );
}

export default Cartinha;
