import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MOTIVOS, SECOES } from "./content";
import PixelSprite from "./PixelSprite";
import Secao from "./Secao";

function Motivos() {
  const [quantos, setQuantos] = useState(1);
  const acabaram = quantos >= MOTIVOS.length;

  return (
    <Secao titulo={SECOES.motivos} className="faby-motivos">
      <ul className="faby-motivos-lista">
        <AnimatePresence initial={false}>
          {MOTIVOS.slice(0, quantos).map((motivo, i) => (
            <motion.li
              key={motivo}
              className="faby-motivo"
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="faby-motivo-numero">{String(i + 1).padStart(2, "0")}</span>
              <span className="faby-motivo-texto">{motivo}</span>
              <PixelSprite name="heart" size={14} className="faby-motivo-coracao" />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {acabaram ? (
        <p className="faby-motivos-fim">
          tem mais tantos.. e a lista inteira não cabe aqui...
        </p>
      ) : (
        <button
          type="button"
          className="faby-botao faby-botao-suave"
          onClick={() => setQuantos((q) => q + 1)}
        >
          {SECOES.maisMotivos}
        </button>
      )}
    </Secao>
  );
}

export default Motivos;
