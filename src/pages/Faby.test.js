import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Cartinha from "./faby/Cartinha";
import Contador from "./faby/Contador";
import Frasinhas from "./faby/Frasinhas";
import Motivos from "./faby/Motivos";
import Perguntas from "./faby/Perguntas";
import { CARTINHA, FRASINHAS, FUGAS, MOTIVOS, PERGUNTAS } from "./faby/content";

/* framer-motion usa IntersectionObserver pro whileInView e jsdom não tem;
   sem ele os blocos ficam no estado inicial, mas continuam no documento. */
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test("a cartinha abre no toque e mostra o texto", async () => {
  render(<Cartinha />);

  expect(screen.getByText(CARTINHA.aviso)).toBeInTheDocument();
  expect(screen.queryByText(CARTINHA.paragrafos[0])).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /abrir a cartinha/i }));

  expect(await screen.findByText(CARTINHA.paragrafos[0], {}, { timeout: 3000 }))
    .toBeInTheDocument();
  expect(screen.getByText(CARTINHA.assinatura)).toBeInTheDocument();
});

test("responder sim mostra a resposta e leva pra próxima pergunta", async () => {
  render(<Perguntas />);

  expect(screen.getByText(PERGUNTAS[0].pergunta)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: PERGUNTAS[0].sim }));

  expect(await screen.findByText(PERGUNTAS[0].resposta, {}, { timeout: 3000 }))
    .toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /próxima/i }));

  expect(await screen.findByText(PERGUNTAS[1].pergunta, {}, { timeout: 3000 }))
    .toBeInTheDocument();
});

test('o botão "não" da primeira pergunta foge em vez de responder', () => {
  render(<Perguntas />);

  const fujao = screen.getByRole("button", { name: /esse botão foge/i });
  expect(fujao).toHaveTextContent(FUGAS[0]);

  fireEvent.pointerDown(fujao);

  /* mudou de texto, continua na mesma pergunta e não respondeu nada */
  expect(screen.getByRole("button", { name: /esse botão foge/i }))
    .toHaveTextContent(FUGAS[1]);
  expect(screen.getByText(PERGUNTAS[0].pergunta)).toBeInTheDocument();
  expect(screen.queryByText(PERGUNTAS[0].resposta)).not.toBeInTheDocument();
});

test("o botão que foge some depois de tentarem demais", () => {
  render(<Perguntas />);

  for (let i = 0; i < FUGAS.length; i += 1) {
    fireEvent.pointerDown(screen.getByRole("button", { name: /esse botão foge/i }));
  }

  expect(screen.getByText(/esse botão fugiu de vez/i)).toBeInTheDocument();
  expect(screen.queryByText(PERGUNTAS[0].resposta)).not.toBeInTheDocument();
});

test("as outras perguntas aceitam as duas respostas", async () => {
  render(<Perguntas />);

  fireEvent.click(screen.getByRole("button", { name: PERGUNTAS[0].sim }));
  fireEvent.click(await screen.findByRole("button", { name: /próxima/i }, { timeout: 3000 }));

  const naoFofo = await screen.findByRole(
    "button",
    { name: PERGUNTAS[1].nao },
    { timeout: 3000 }
  );
  fireEvent.click(naoFofo);

  expect(await screen.findByText(PERGUNTAS[1].resposta, {}, { timeout: 3000 }))
    .toBeInTheDocument();
});

test("os motivos vão aparecendo um a um até acabarem", () => {
  render(<Motivos />);

  const lista = screen.getByRole("list");
  expect(within(lista).getAllByRole("listitem")).toHaveLength(1);

  fireEvent.click(screen.getByRole("button", { name: /quero mais um motivo/i }));
  expect(within(lista).getAllByRole("listitem")).toHaveLength(2);

  for (let i = 2; i < MOTIVOS.length; i += 1) {
    fireEvent.click(screen.getByRole("button", { name: /quero mais um motivo/i }));
  }

  expect(within(lista).getAllByRole("listitem")).toHaveLength(MOTIVOS.length);
  expect(screen.queryByRole("button", { name: /quero mais um motivo/i })).not.toBeInTheDocument();
});

test("a frasinha muda quando ela pede outra", async () => {
  render(<Frasinhas />);

  const primeira = FRASINHAS[0];
  expect(screen.getByText(primeira)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /me diz algo fofo/i }));

  const outra = await screen.findByText(
    (texto) => FRASINHAS.includes(texto) && texto !== primeira,
    {},
    { timeout: 3000 }
  );
  expect(outra).toBeInTheDocument();
});

test("o contador mostra os dias desde 18 de junho de 2026", () => {
  jest.useFakeTimers().setSystemTime(new Date("2026-08-15T12:00:00"));
  try {
    render(<Contador />);
    /* 12 dias em junho + 31 em julho + 15 em agosto */
    expect(screen.getByText("58")).toBeInTheDocument();
    expect(screen.getByText(/18 de junho de 2026/)).toBeInTheDocument();
  } finally {
    jest.useRealTimers();
  }
});
