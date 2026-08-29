import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CONTADOR, NAMORO, NAMORO_CONTADOR } from "./content";
import PixelSprite from "./PixelSprite";
import Secao from "./Secao";

const SEGUNDO = 1000;
const MINUTO = 60 * SEGUNDO;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

/* Este é o contador que continua andando — o de cima parou de propósito. */
function namorandoHa(inicio, agora) {
  const passou = Math.max(0, agora - inicio);
  return {
    dias: Math.floor(passou / DIA),
    horas: Math.floor((passou % DIA) / HORA),
    minutos: Math.floor((passou % HORA) / MINUTO),
    segundos: Math.floor((passou % MINUTO) / SEGUNDO),
  };
}

function Namoro() {
  const inicio = new Date(NAMORO).getTime();
  const [tempo, setTempo] = useState(() => namorandoHa(inicio, Date.now()));

  useEffect(() => {
    const id = setInterval(() => setTempo(namorandoHa(inicio, Date.now())), SEGUNDO);
    return () => clearInterval(id);
  }, [inicio]);

  const miudos = [
    { valor: tempo.horas, rotulo: CONTADOR.unidades.horas },
    { valor: tempo.minutos, rotulo: CONTADOR.unidades.minutos },
    { valor: tempo.segundos, rotulo: CONTADOR.unidades.segundos },
  ];

  return (
    <Secao className="faby-namoro">

    </Secao>
  );
}

export default Namoro;
