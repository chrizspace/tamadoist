import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Icon } from "../components/Icon";
import { Sheet } from "../components/Sheet";
import { Phone, SAMPLE, type ScreenData } from "./Screens";
import { PetStage } from "../character/PetStage";
import { energyColor, INDICATOR_COLORS, type DialKey } from "../character/Indicators";
import type { SceneProps } from "../scene/Scene";

export interface StatusTask { id: string; title: string; done: boolean }
export interface StatusHabit { id: string; title: string; detail: string; done: boolean }

export interface StatusData {
  energyPercent: number;
  /** e.g. "10:48" — when the energy runs out. */
  energyUntil: string;
  sleepStart: string;
  sleepEnd: string;
  sleeping?: boolean;
  tasks: StatusTask[];
  habits: StatusHabit[];
  streakDays: number;
}

export interface StatusSheetProps extends StatusData {
  /** Which indicator was tapped: its section is highlighted and scrolled into view. */
  focus?: DialKey;
  onClose?: () => void;
}

/** Placeholder content until tasks and habits are real. */
export const SAMPLE_TASKS: StatusTask[] = [
  { id: "t1", title: "Poranna rozgrzewka", done: true },
  { id: "t2", title: "Odpisać na maile", done: true },
  { id: "t3", title: "Przygotować prezentację", done: true },
  { id: "t4", title: "Spotkanie zespołu 11:00", done: false },
  { id: "t5", title: "Zrobić zakupy", done: false },
  { id: "t6", title: "Zadzwonić do mamy", done: false },
  { id: "t7", title: "Przeczytać 20 stron", done: false },
  { id: "t8", title: "Spacer 30 minut", done: false },
  { id: "t9", title: "Przejrzeć budżet", done: false },
  { id: "t10", title: "Zaplanować jutro", done: false },
];

export const SAMPLE_HABITS: StatusHabit[] = [
  { id: "h1", title: "Wypij cały cel wody", detail: "1700 / 2450 ml", done: false },
  { id: "h2", title: "Połóż się spać na czas", detail: "do 22:00", done: false },
  { id: "h3", title: "Zrób wszystkie zadania na dziś", detail: "3 / 10", done: false },
];

const Check = ({ done, color }: { done: boolean; color: string }) => (
  <span className={`td-status__check${done ? " is-done" : ""}`} style={{ ["--c" as string]: color }} aria-hidden="true">
    {done && <Icon name="check" />}
  </span>
);

function Section({ id, title, summary, color, focus, children }: { id: DialKey; title: string; summary: string; color: string; focus?: DialKey; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const focused = focus === id;
  useEffect(() => { if (focused) ref.current?.scrollIntoView({ block: "nearest" }); }, [focused]);
  return (
    <section ref={ref} className={`td-status__sec${focused ? " is-focus" : ""}`} style={{ ["--c" as string]: color }} aria-labelledby={`st-${id}`}>
      <header><h4 id={`st-${id}`}>{title}</h4><span>{summary}</span></header>
      {children}
    </section>
  );
}

/** Status card: exact energy and when it runs out, today's tasks, and the habits that keep the streak alive. */
export function StatusSheet({ energyPercent, energyUntil, sleepStart, sleepEnd, sleeping, tasks, habits, streakDays, focus, onClose }: StatusSheetProps) {
  const p = Math.max(0, Math.min(100, Math.round(energyPercent)));
  const done = tasks.filter((t) => t.done).length;
  const habitsDone = habits.filter((h) => h.done).length;
  return (
    <Sheet>
      <div className="td-status">
        <header className="td-status__head">
          <h3>Status</h3>
          <button type="button" className="td-status__close" onClick={onClose} aria-label="Zamknij"><Icon name="close" /></button>
        </header>
        <Section id="energy" title="Energia" summary={`${p}%`} color={energyColor(p)} focus={focus}>
          <div className="td-status__bar" role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} aria-label="Energia"><div style={{ width: `${p}%` }} /></div>
          <ul className="td-status__facts">
            <li><Icon name="clock" /><span>{sleeping ? <>Śpi do <b>{sleepEnd}</b>, energia się ładuje</> : <>Energii starczy do <b>{energyUntil}</b></>}</span></li>
            <li><Icon name="moon" /><span>Spać pójdziesz o <b>{sleepStart}</b> (pobudka {sleepEnd})</span></li>
          </ul>
        </Section>
        <Section id="tasks" title="Zadania na dziś" summary={`${done}/${tasks.length}`} color={INDICATOR_COLORS.tasks} focus={focus}>
          <ul className="td-status__list">
            {tasks.map((t) => (
              <li key={t.id} className={t.done ? "is-done" : ""}><Check done={t.done} color={INDICATOR_COLORS.tasks} />{t.title}</li>
            ))}
          </ul>
        </Section>
        <Section id="streak" title={`Seria: ${streakDays} dni`} summary={`${habitsDone}/${habits.length} nawyków`} color={INDICATOR_COLORS.streak} focus={focus}>
          <p className="td-status__hint">Ukończ nawyki, żeby dziś podtrzymać serię.</p>
          <ul className="td-status__list">
            {habits.map((h) => (
              <li key={h.id} className={h.done ? "is-done" : ""}><Check done={h.done} color={INDICATOR_COLORS.streak} /><span>{h.title}<small>{h.detail}</small></span></li>
            ))}
          </ul>
        </Section>
      </div>
    </Sheet>
  );
}

export interface StatusScreenProps extends Partial<StatusData>, SceneProps {
  name?: string;
  focus?: DialKey;
  onClose?: () => void;
}

/** The status card over the dimmed scene. */
export function StatusScreen({ name = SAMPLE.name, location = "recreation.park", period = "noon", focus, onClose, ...data }: StatusScreenProps) {
  const base: StatusData = {
    energyPercent: 58, energyUntil: "10:48", sleepStart: SAMPLE.sleepStart, sleepEnd: SAMPLE.sleepEnd,
    tasks: SAMPLE_TASKS, habits: SAMPLE_HABITS, streakDays: 12, ...data,
  };
  return (
    <Phone location={location} period={period}>
      <PetStage location={location} name={name} top={226} still />
      <div className="td-scrim" onClick={onClose} />
      <StatusSheet {...base} focus={focus} onClose={onClose} />
    </Phone>
  );
}

export type { ScreenData };
