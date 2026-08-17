import { motion } from "framer-motion";

/* Bloco padrão da página: aparece com um pulinho suave quando entra na tela. */

const SOBE = {
  oculto: { opacity: 0, y: 28 },
  visivel: { opacity: 1, y: 0 },
};

function Secao({ titulo, children, className = "", id }) {
  return (
    <motion.section
      id={id}
      className={`faby-secao ${className}`}
      variants={SOBE}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {titulo && <h2 className="faby-secao-titulo">{titulo}</h2>}
      {children}
    </motion.section>
  );
}

export default Secao;
