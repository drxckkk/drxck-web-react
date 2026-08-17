import { useState } from "react";
import { motion } from "framer-motion";
import { FINAL, SECOES } from "./content";
import { ChuvaDeCoracoes, useCoracoes } from "./Coracoes";
import PixelSprite from "./PixelSprite";
import Secao from "./Secao";

function Final() {
  const [mandados, setMandados] = useState(0);
  const { coracoes, soltar } = useCoracoes();

  const mandarAmor = () => {
    soltar(10);
    setMandados((m) => m + 10);
  };

  return (
    <Secao titulo={SECOES.fim} className="faby-final">
      <div className="faby-cartao faby-cartao-final">
        <ChuvaDeCoracoes coracoes={coracoes} />

        <h3 className="faby-final-titulo">{FINAL.titulo}</h3>
        <p className="faby-final-frase">{FINAL.frase}</p>

        <motion.button
          type="button"
          className="faby-botao faby-botao-grande"
          onClick={mandarAmor}
          whileTap={{ scale: 0.94 }}
        >
          <PixelSprite name="heart" size={20} className="faby-inline-sprite" />
          {FINAL.botao}
        </motion.button>

        {mandados > 0 && (
          <motion.p
            className="faby-final-contagem"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={mandados}
          >
            {mandados} {FINAL.contadorSufixo}
          </motion.p>
        )}
      </div>
    </Secao>
  );
}

export default Final;
