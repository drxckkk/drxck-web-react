import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FRASINHAS, SECOES } from "./content";
import PixelSprite from "./PixelSprite";
import Secao from "./Secao";

function Frasinhas() {
  const [indice, setIndice] = useState(0);

  /* sorteia sempre uma frase diferente da que está na tela */
  const sortear = () => {
    if (FRASINHAS.length < 2) return;
    let proximo = indice;
    while (proximo === indice) {
      proximo = Math.floor(Math.random() * FRASINHAS.length);
    }
    setIndice(proximo);
  };

  return (
    <Secao titulo={SECOES.frasinhas} className="faby-frasinhas">
      <div className="faby-balao-area">
        <AnimatePresence mode="wait">
          <motion.p
            key={FRASINHAS[indice]}
            className="faby-balao"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {FRASINHAS[indice]}
          </motion.p>
        </AnimatePresence>

        <motion.div
          className="faby-balao-bicho"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <PixelSprite name="cinnamoroll" size={86} alt="My Melody" />
        </motion.div>
      </div>

      <button type="button" className="faby-botao" onClick={sortear}>
        {SECOES.maisFrases}
      </button>
    </Secao>
  );
}

export default Frasinhas;
