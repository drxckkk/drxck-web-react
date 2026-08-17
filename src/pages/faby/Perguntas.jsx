import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FUGAS, PERGUNTAS, SECOES } from "./content";
import { ChuvaDeCoracoes, useCoracoes } from "./Coracoes";
import PixelSprite from "./PixelSprite";
import Secao from "./Secao";

const EASE = [0.16, 1, 0.3, 1];

/* O "não" da primeira pergunta foge do dedo dela. Nas outras os dois botões
   valem — as duas respostas são fofas do mesmo jeito. */
function BotaoQueFoge({ onDesistir }) {
  const areaRef = useRef(null);
  const botaoRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [fugas, setFugas] = useState(0);

  const sumiu = fugas >= FUGAS.length;

  const fugir = (e) => {
    /* impede que o toque vire clique — esse botão nunca é apertado de verdade */
    e.preventDefault();
    if (sumiu) return;

    const area = areaRef.current?.getBoundingClientRect();
    const botao = botaoRef.current?.getBoundingClientRect();

    if (area && botao) {
      const maxX = Math.max(0, (area.width - botao.width) / 2 - 6);
      const maxY = Math.max(0, (area.height - botao.height) / 2 - 6);
      const sorteioX = Math.random() * maxX;
      const sorteioY = (Math.random() * 2 - 1) * maxY;
      /* sempre pula pro outro lado, senão ele fugiria pra onde o dedo já está */
      setPos({ x: pos.x >= 0 ? -sorteioX : sorteioX, y: sorteioY });
    }

    const proximo = fugas + 1;
    setFugas(proximo);
    if (proximo >= FUGAS.length) onDesistir?.();
  };

  return (
    <span className="faby-fuga-area" ref={areaRef}>
      <AnimatePresence>
        {!sumiu && (
          <motion.button
            ref={botaoRef}
            type="button"
            className="faby-botao faby-botao-fantasma faby-fuga"
            animate={{ x: pos.x, y: pos.y }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            onPointerDown={fugir}
            onMouseEnter={fugir}
            onFocus={fugir}
            aria-label="Esse botão foge"
          >
            {FUGAS[Math.min(fugas, FUGAS.length - 1)]}
          </motion.button>
        )}
      </AnimatePresence>
    </span>
  );
}

function Perguntas() {
  const [indice, setIndice] = useState(0);
  const [respondida, setRespondida] = useState(false);
  const [fim, setFim] = useState(false);
  const [fugiu, setFugiu] = useState(false);
  const { coracoes, soltar } = useCoracoes();

  const pergunta = PERGUNTAS[indice];
  const ultima = indice === PERGUNTAS.length - 1;

  const responder = () => {
    setRespondida(true);
    soltar(8);
  };

  const avancar = () => {
    if (ultima) {
      setFim(true);
      soltar(14);
      return;
    }
    setIndice((i) => i + 1);
    setRespondida(false);
    setFugiu(false);
  };

  const recomecar = () => {
    setIndice(0);
    setRespondida(false);
    setFim(false);
    setFugiu(false);
  };

  return (
    <Secao titulo={SECOES.perguntas} className="faby-perguntas">
      <div className="faby-cartao faby-cartao-perguntas">
        <ChuvaDeCoracoes coracoes={coracoes} />

        <div className="faby-progresso" aria-hidden="true">
          {PERGUNTAS.map((p, i) => (
            <PixelSprite
              key={p.pergunta}
              name="heart"
              size={14}
              className={i <= indice || fim ? "faby-progresso-cheio" : "faby-progresso-vazio"}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {fim ? (
            <motion.div
              key="fim"
              className="faby-pergunta-bloco"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <PixelSprite name="keroppi" size={74} alt="My Melody" />
              <p className="faby-pergunta-resposta">
                acabaram as perguntas, mas o meu amor por vc não acaba nunca 🤍
              </p>
              <button type="button" className="faby-botao faby-botao-suave" onClick={recomecar}>
                {SECOES.refazer}
              </button>
            </motion.div>
          ) : respondida ? (
            <motion.div
              key={`resposta-${indice}`}
              className="faby-pergunta-bloco"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <PixelSprite name="myMelody" size={64} alt="My Melody" />
              <p className="faby-pergunta-resposta">{pergunta.resposta}</p>
              <button type="button" className="faby-botao" onClick={avancar}>
                {ultima ? "terminar 💗" : "próxima 💌"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`pergunta-${indice}`}
              className="faby-pergunta-bloco"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <h3 className="faby-pergunta-texto">{pergunta.pergunta}</h3>

              <div className="faby-pergunta-botoes">
                <button type="button" className="faby-botao" onClick={responder}>
                  {pergunta.sim}
                </button>

                {indice === 0 ? (
                  <BotaoQueFoge onDesistir={() => setFugiu(true)} />
                ) : (
                  <button
                    type="button"
                    className="faby-botao faby-botao-fantasma"
                    onClick={responder}
                  >
                    {pergunta.nao}
                  </button>
                )}
              </div>

              {fugiu && (
                <motion.p
                  className="faby-pergunta-dica"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  acho que esse botão fugiu de vez 🥺 aperta o outro, vai
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Secao>
  );
}

export default Perguntas;
