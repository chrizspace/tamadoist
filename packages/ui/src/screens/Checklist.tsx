import { nextOpenItem, type ChecklistItem, type LocationId } from "@tamadoist/core";
import { HeaderBar } from "../components/HeaderBar";
import { Icon } from "../components/Icon";
import { RoundAction } from "../actions/RoundButton";
import { PetStage } from "../character/PetStage";
import type { DialKey } from "../character/Indicators";
import type { PetState } from "../character/Pet";
import { Phone, SAMPLE } from "./Screens";
import type { PeriodId } from "@tamadoist/core";

export const SAMPLE_TODAY: ChecklistItem[] = [
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

export const SAMPLE_HABIT_ITEMS: ChecklistItem[] = [
  { id: "h1", title: "Wypij cały cel wody", done: false },
  { id: "h2", title: "Połóż się spać na czas", done: false },
  { id: "h3", title: "Zrób wszystkie zadania na dziś", done: false },
];

export interface ChecklistActionScreenProps {
  /** "Zadania" or "Nawyki". */
  title: string;
  items?: ChecklistItem[];
  /** Overrides the counter computed from `items` (tasks count today's tasks, not steps). */
  progress?: { done: number; total: number };
  /** Overrides the "Teraz:" line, e.g. a task and its next step. */
  nextLabel?: string | null;
  name?: string;
  energyPercent?: number;
  location?: LocationId;
  period?: PeriodId;
  state?: PetState;
  /** Short "+1" pill shown on the counter after ticking something off. */
  gain?: string;
  onBack?: () => void;
  onDone?: () => void;
  onList?: () => void;
  onIndicator?: (key: DialKey) => void;
}

/**
 * Tasks / habits action: the scene stays free for the character, the interaction bar shows progress and what is next,
 * the dock has two round buttons: tick off the next item and open the whole list.
 */
export function ChecklistActionScreen({
  title, items = [], progress, nextLabel, name = SAMPLE.name, energyPercent = SAMPLE.energyPercent, location = "recreation.park", period = "noon",
  state = "awake", gain, onBack, onDone, onList, onIndicator,
}: ChecklistActionScreenProps) {
  const done = progress ? progress.done : items.filter((i) => i.done).length;
  const total = progress ? progress.total : items.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const next = nextLabel !== undefined ? nextLabel : nextOpenItem(items)?.title;
  return (
    <Phone location={location} period={period}>
      <HeaderBar left="back" title={title} percent={energyPercent} onBack={onBack} onIndicator={onIndicator} />
      <PetStage location={location} state={state} name={name} top={226} />
      <div className="td-counter td-counter--green" data-testid="checklist-counter">
        {gain && <span className="td-counter__gain" role="status">{gain}</span>}
        <b>{done} / {total}</b>
        <div className="td-counter__track" role="progressbar" aria-label={title} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="td-counter__fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="td-counter__next">{next ? <>Teraz: <b>{next}</b></> : "Wszystko zrobione. Brawo!"}</div>
      </div>
      <div className="td-actionbar td-actionbar--pair">
        <RoundAction tone="primary" icon="check" label="Zrobione" disabled={!next} onClick={onDone} />
        <RoundAction tone="plain" icon="list" label="Lista" onClick={onList} />
      </div>
    </Phone>
  );
}

export interface ChecklistPageProps {
  title: string;
  items: ChecklistItem[];
  /** Section color (tasks violet, habits orange). */
  color?: string;
  onToggle?: (id: string) => void;
  onClose?: () => void;
}

/** The whole list on its own full screen: tap a circle to tick an item off or back. */
export function ChecklistPage({ title, items, color = "#7C84D6", onToggle, onClose }: ChecklistPageProps) {
  const done = items.filter((i) => i.done).length;
  return (
    <div className="td-phone td-phone--plain">
      <div className="td-statusfull">
        <header className="td-status__head">
          <h3>{title}</h3>
          <button type="button" className="td-status__close" onClick={onClose} aria-label="Zamknij"><Icon name="close" /></button>
        </header>
        <div className="td-status">
          <section className="td-status__sec" style={{ ["--c" as string]: color }}>
            <header><h4>Na dziś</h4><span>{done}/{items.length}</span></header>
            <ul className="td-status__list">
              {items.map((i) => (
                <li key={i.id} className={i.done ? "is-done" : ""}>
                  <button type="button" role="checkbox" aria-checked={i.done} aria-label={i.title} className={`td-status__check${i.done ? " is-done" : ""}`} onClick={() => onToggle?.(i.id)}>
                    {i.done && <Icon name="check" />}
                  </button>
                  <span>{i.title}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
