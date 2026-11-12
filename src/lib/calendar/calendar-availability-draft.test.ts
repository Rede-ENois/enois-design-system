import { describe, expect, it } from "vitest";

import {
  draftProblems,
  draftsToWindows,
  emptyDraft,
  windowsToDrafts,
} from "./calendar-availability-draft.js";

const ZONE = "America/Sao_Paulo";

const window = (day: number, startsAt: string, endsAt: string) => ({ day, startsAt, endsAt });

describe("draftProblems", () => {
  it("uma semana válida não tem problema", () => {
    expect(draftProblems([window(1, "09:00", "12:00"), window(3, "14:00", "18:00")])).toEqual([]);
  });

  it("dia fora de 1–7 é recusado", () => {
    expect(draftProblems([window(0, "09:00", "12:00")])).toContain("day");
    expect(draftProblems([window(8, "09:00", "12:00")])).toContain("day");
  });

  it("relógio incompleto é recusado", () => {
    expect(draftProblems([window(1, "9:00", "12:00")])).toContain("clock");
    expect(draftProblems([window(1, "09:00", "24:00")])).toContain("clock");
    expect(draftProblems([window(1, "", "12:00")])).toContain("clock");
  });

  it("fim igual ou antes do começo é recusado (não atravessa a meia-noite)", () => {
    expect(draftProblems([window(1, "12:00", "12:00")])).toContain("endBeforeStart");
    expect(draftProblems([window(1, "22:00", "02:00")])).toContain("endBeforeStart");
  });

  it("janelas sobrepostas no mesmo dia são recusadas", () => {
    expect(draftProblems([window(1, "09:00", "12:00"), window(1, "11:00", "13:00")])).toContain(
      "overlaps",
    );
  });

  it("encostar no fim da outra não é sobreposição (meio-aberto)", () => {
    expect(draftProblems([window(1, "09:00", "12:00"), window(1, "12:00", "13:00")])).not.toContain(
      "overlaps",
    );
  });

  it("mesmo horário em dias diferentes não é sobreposição", () => {
    expect(draftProblems([window(1, "09:00", "12:00"), window(2, "09:00", "12:00")])).not.toContain(
      "overlaps",
    );
  });

  it("a sobreposição olha só as linhas com relógio válido", () => {
    expect(draftProblems([window(1, "11:00", "13:00"), window(1, "9:00", "12:00")])).not.toContain(
      "overlaps",
    );
  });

  it("mais de 50 janelas é recusado", () => {
    const many = Array.from({ length: 51 }, (_, index) =>
      window((index % 7) + 1, "00:00", "00:01"),
    );
    expect(draftProblems(many)).toContain("tooMany");
  });

  it("semana vazia não tem problema", () => {
    expect(draftProblems([])).toEqual([]);
  });
});

describe("draftsToWindows", () => {
  it("converte para a forma da API no fuso declarado", () => {
    expect(draftsToWindows([window(2, "08:30", "10:00")], ZONE)).toEqual([
      { dayOfWeek: 2, startsAt: "08:30", endsAt: "10:00", timezone: ZONE },
    ]);
  });

  it("devolve null quando a semana tem problema", () => {
    expect(draftsToWindows([window(1, "12:00", "09:00")], ZONE)).toBeNull();
  });
});

describe("windowsToDrafts", () => {
  it("descarta o id do servidor", () => {
    expect(
      windowsToDrafts([{ id: "ava_1", dayOfWeek: 4, startsAt: "07:00", endsAt: "09:00" }]),
    ).toEqual([{ day: 4, startsAt: "07:00", endsAt: "09:00" }]);
  });
});

describe("emptyDraft", () => {
  it("começa numa segunda em horário comercial", () => {
    expect(emptyDraft()).toEqual({ day: 1, startsAt: "09:00", endsAt: "12:00" });
  });
});
