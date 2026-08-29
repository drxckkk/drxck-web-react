import { useEffect } from "react";
import { motion } from "framer-motion";
import { ABERTURA, APELIDOS } from "./faby/content";
import PixelSprite from "./faby/PixelSprite";
import Cartinha from "./faby/Cartinha";
import Contador from "./faby/Contador";
import Final from "./faby/Final";
import Frasinhas from "./faby/Frasinhas";
import Motivos from "./faby/Motivos";
import Namoro from "./faby/Namoro";
import Perguntas from "./faby/Perguntas";
import "./Faby.css";

const FONTES =
  "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Quicksand:wght@400;500;600;700&display=swap";

/* enfeites que ficam flutuando no fundo da página */
const ENFEITES = [
  { nome: "cloud", tamanho: 46, classe: "faby-enfeite-1" },
  { nome: "heart", tamanho: 22, classe: "faby-enfeite-2" },
  { nome: "star", tamanho: 18, classe: "faby-enfeite-3" },
  { nome: "cloud", tamanho: 34, classe: "faby-enfeite-4" },
  { nome: "bow", tamanho: 26, classe: "faby-enfeite-5" },
  { nome: "heart", tamanho: 16, classe: "faby-enfeite-6" },
  { nome: "star", tamanho: 14, classe: "faby-enfeite-7" },
  { nome: "strawberry", tamanho: 20, classe: "faby-enfeite-8" },
];

function useAmbientePagina() {
  useEffect(() => {
    const html = document.documentElement;
    const idiomaAntes = html.lang;
    const tituloAntes = document.title;

    html.lang = "pt-BR";
    document.title = `${APELIDOS.fofo} 💗`;
    document.body.classList.add("faby-modo");

    const semRobos = document.createElement("meta");
    semRobos.name = "robots";
    semRobos.content = "noindex, nofollow";
    document.head.appendChild(semRobos);

    const preconexao = document.createElement("link");
    preconexao.rel = "preconnect";
    preconexao.href = "https://fonts.gstatic.com";
    preconexao.crossOrigin = "anonymous";

    const fontes = document.createElement("link");
    fontes.rel = "stylesheet";
    fontes.href = FONTES;

    document.head.appendChild(preconexao);
    document.head.appendChild(fontes);

    return () => {
      html.lang = idiomaAntes;
      document.title = tituloAntes;
      document.body.classList.remove("faby-modo");
      semRobos.remove();
      preconexao.remove();
      fontes.remove();
    };
  }, []);
}

function Abertura() {
  const descer = () => {
    document.getElementById("faby-cartinha")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="faby-abertura">
      <motion.div
        className="faby-abertura-bicho"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PixelSprite name="myMelody" size={148} alt="My Melody" />
        </motion.div>
      </motion.div>

      <motion.h1
        className="faby-abertura-ola"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {ABERTURA.ola}
        <PixelSprite name="heart" size={26} className="faby-inline-sprite" />
      </motion.h1>

      <motion.p
        className="faby-abertura-frase"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {ABERTURA.frase}
      </motion.p>

      <motion.button
        type="button"
        className="faby-botao faby-botao-grande"
        onClick={descer}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {ABERTURA.botao}
      </motion.button>
    </header>
  );
}

function Faby() {
  useAmbientePagina();

  return (
    <div className="faby">
      <div className="faby-fundo" aria-hidden="true">
        {ENFEITES.map((e, i) => (
          <span key={`${e.classe}-${i}`} className={`faby-enfeite ${e.classe}`}>
            <PixelSprite name={e.nome} size={e.tamanho} />
          </span>
        ))}
      </div>

      <main className="faby-shell">
        <Abertura />
        <div id="faby-cartinha" />
        <Cartinha />
        <Perguntas />
        <Motivos />
        <Frasinhas />
        <Final />

        <footer className="faby-rodape">
          <PixelSprite name="heart" size={18} />
          <span>feito com muito amor pra minha byby nenemzuda</span>
        </footer>
      </main>
    </div>
  );
}

export default Faby;
