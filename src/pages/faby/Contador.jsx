import { CONTADOR, INICIO, PARADA } from "./content";
import PixelSprite from "./PixelSprite";
import Secao from "./Secao";

const DIA = 24 * 60 * 60 * 1000;

/* Este contador não corre mais: ele mostra quantos dias couberam entre o
   começo de tudo e o dia em que o namoro começou. O número sai das datas em
   content.js, então continua certo mesmo se as datas mudarem. */
const DIAS_PARADO = Math.max(
  0,
  Math.floor((new Date(PARADA).getTime() - new Date(INICIO).getTime()) / DIA)
);

function Contador() {
  return (
    <Secao className="faby-contador">
      <p className="faby-contador-titulo">{CONTADOR.titulo}</p>

      <p className="faby-contador-dias">
        <span className="faby-contador-numero">{DIAS_PARADO}</span>
        <span className="faby-contador-unidade">{CONTADOR.unidades.dias}</span>
      </p>

      <p className="faby-contador-parado">
        <PixelSprite name="heart" size={14} className="faby-inline-sprite" />
        {CONTADOR.parado}
      </p>

      <p className="faby-contador-desde">
        <PixelSprite name="strawberry" size={16} className="faby-inline-sprite" />
        {CONTADOR.desde}
      </p>
      <p className="faby-contador-rodape">{CONTADOR.rodape}</p>
    </Secao>
  );
}

export default Contador;
