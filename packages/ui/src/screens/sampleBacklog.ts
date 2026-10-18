import type { Backlog, Subtask, Task } from "@tamadoist/core";

const KGP_COLOR = "#3C8F5A";

/** The 26 trips of the "Korona Gór Polski" example goal (placeholder data). */
const KGP_PEAKS = [
  "Rysy", "Babia Góra", "Śnieżka", "Śnieżnik", "Tarnica", "Turbacz", "Radziejowa", "Lackowa", "Mogielica", "Skrzyczne",
  "Wysoka", "Łysica", "Jagodna", "Kowadło", "Rudawiec", "Chełmiec", "Wielka Sowa", "Ślęża", "Szczeliniec Wielki", "Waligóra",
  "Orlica", "Skopiec", "Biskupia Kopa", "Lubomir", "Czupel", "Kłodzka Góra",
];

const tripSteps = (id: string): Subtask[] =>
  ["Zaplanować trasę", "Sprawdzić pogodę", "Zorganizować dojazd i nocleg", "Spakować się", "Wejść na szczyt"].map((title, i) => ({
    id: `${id}-s${i + 1}`, title, done: false,
  }));

const trips: Task[] = KGP_PEAKS.map((peak, i) => {
  const id = `kgp-${i + 1}`;
  return { id, title: `Wyjazd: ${peak}`, done: false, sectionId: "kgp", goalId: "kgp", today: peak === "Babia Góra", subtasks: tripSteps(id) };
});

const plain = (id: string, title: string, sectionId: string, today: boolean, done = false): Task => ({ id, title, done, sectionId, today, subtasks: [] });

/** Example backlog: sections, one goal with 26 linked trips (each with steps) and a few plain tasks. */
export const SAMPLE_BACKLOG: Backlog = {
  sections: [
    { id: "work", title: "Praca" },
    { id: "home", title: "Dom" },
    { id: "health", title: "Zdrowie" },
    { id: "kgp", title: "Korona Gór Polski" },
  ],
  goals: [{ id: "kgp", title: "Korona Gór Polski", color: KGP_COLOR }],
  tasks: [
    plain("w1", "Odpisać na maile", "work", true, true),
    plain("w2", "Przygotować prezentację", "work", true, true),
    {
      ...plain("w3", "Spotkanie zespołu 11:00", "work", true),
      subtasks: [
        { id: "w3-s1", title: "Przejrzeć agendę", done: false },
        { id: "w3-s2", title: "Przygotować aktualizację", done: false },
      ],
    },
    plain("w4", "Przejrzeć budżet", "work", false),
    plain("h1", "Zrobić zakupy", "home", true),
    plain("h2", "Zadzwonić do mamy", "home", true),
    plain("h3", "Przeczytać 20 stron", "home", true),
    plain("h4", "Zaplanować jutro", "home", true),
    plain("h5", "Naprawić rower", "home", false),
    plain("f1", "Poranna rozgrzewka", "health", true, true),
    plain("f2", "Spacer 30 minut", "health", true),
    plain("f3", "Umówić wizytę u dentysty", "health", false),
    ...trips,
  ],
};
