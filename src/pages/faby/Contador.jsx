import { useEffect, useState } from "react";
import { CONTADOR, INICIO } from "./content";
import PixelSprite from "./PixelSprite";
import Secao from "./Secao";

const SEGUNDO = 1000;
const MINUTO = 60 * SEGUNDO;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

function juntosDesde(inicio, agora) {
  const passou = Math.max(0, agora - inicio);
  return {
    dias: Math.floor(passou / DIA),
    horas: Math.floor((passou % DIA) / HORA),
    minutos: Math.floor((passou % HORA) / MINUTO),
    segundos: Math.floor((passou % MINUTO) / SEGUNDO),
  };
}

function Contador() {
  const inicio = new Date(INICIO).getTime();
  const [tempo, setTempo] = useState(() => juntosDesde(inicio, Date.now()));

  useEffect(() => {
    const id = setInterval(() => setTempo(juntosDesde(inicio, Date.now())), SEGUNDO);
    return () => clearInterval(id);
  }, [inicio]);

  const miudos = [
    { valor: tempo.horas, rotulo: CONTADOR.unidades.horas },
    { valor: tempo.minutos, rotulo: CONTADOR.unidades.minutos },
    { valor: tempo.segundos, rotulo: CONTADOR.unidades.segundos },
  ];

  return (
    <Secao className="faby-contador">
      <p className="faby-contador-titulo">{CONTADOR.titulo}</p>

      <p className="faby-contador-dias">
        <span className="faby-contador-numero">{tempo.dias}</span>
        <span className="faby-contador-unidade">{CONTADOR.unidades.dias}</span>
      </p>

      <div className="faby-contador-miudos">
        {miudos.map((m) => (
          <div className="faby-contador-caixa" key={m.rotulo}>
            <span className="faby-contador-caixa-valor">
              {String(m.valor).padStart(2, "0")}
            </span>
            <span className="faby-contador-caixa-rotulo">{m.rotulo}</span>
          </div>
        ))}
      </div>

      <p className="faby-contador-desde">
        <PixelSprite name="strawberry" size={16} className="faby-inline-sprite" />
        {CONTADOR.desde}
      </p>
      <p className="faby-contador-rodape">{CONTADOR.rodape}</p>
    </Secao>
  );
}

export default Contador;
