import { useState, type FormEvent } from "react";
import { Reorder, useDragControls } from "framer-motion";
import {
  goalProgress, isTaskDone, subtaskProgress, tasksBySection, tasksOfGoal, todayProgress, todayTasks, tomorrowTasks,
  type Backlog, type Goal, type Task,
} from "@tamadoist/core";
import { Icon } from "../components/Icon";
import { INDICATOR_COLORS } from "../character/Indicators";

export type TasksTab = "now" | "all" | "goals";

/** Everything the page can change. All callbacks are optional, so stories can show it read-only. */
export interface TasksEditing {
  onToggleTask?: (id: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onToggleToday?: (id: string) => void;
  /** Drag and drop: the new order of today's task ids. */
  onReorderToday?: (ids: string[]) => void;
  onSetTime?: (id: string, time: string | undefined) => void;
  onSortByTime?: () => void;
  /** Push one task from today to tomorrow. */
  onDeferTask?: (id: string) => void;
  /** Push everything not done yet from today to tomorrow (the button at the very bottom of "Teraz"). */
  onDeferAll?: () => void;
  onBringBack?: (id: string) => void;
  onAddTask?: (input: { title: string; sectionId: string; goalId?: string; today?: boolean }) => void;
  onRemoveTask?: (id: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  onRemoveSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSection?: (title: string) => void;
  onRemoveSection?: (id: string) => void;
  onAddGoal?: (title: string, description: string) => void;
  onUpdateGoal?: (id: string, patch: { title: string; description: string }) => void;
  onRemoveGoal?: (id: string) => void;
  onSetTaskGoal?: (taskId: string, goalId: string | undefined) => void;
}

export interface TasksPageProps extends TasksEditing {
  backlog: Backlog;
  tab?: TasksTab;
  /** Open a goal's task list right away. */
  goalId?: string;
  /** Task ids that start expanded (showing their details). */
  expanded?: string[];
  onClose?: () => void;
}

const TABS: { id: TasksTab; label: string }[] = [
  { id: "now", label: "Teraz" },
  { id: "all", label: "Wszystko" },
  { id: "goals", label: "Cele" },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);

function Check({ done, color, label, onClick }: { done: boolean; color: string; label: string; onClick?: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={done} aria-label={label} className={`td-status__check${done ? " is-done" : ""}`} style={{ ["--c" as string]: color }} onClick={onClick}>
      {done && <Icon name="check" />}
    </button>
  );
}

/** One text field with an add button; Enter adds too. Clears itself after adding. */
function AddInput({ placeholder, label, onSubmit, children }: { placeholder: string; label: string; onSubmit?: (value: string) => void; children?: React.ReactNode }) {
  const [value, setValue] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit?.(value);
    setValue("");
  };
  return (
    <form className="td-addrow" onSubmit={submit}>
      {children}
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} aria-label={label} />
      <button type="submit" aria-label={`${label}: dodaj`} disabled={!value.trim()}><Icon name="plus" /></button>
    </form>
  );
}

interface RowProps extends TasksEditing {
  task: Task;
  backlog: Backlog;
  mode: "today" | "edit";
  open: boolean;
  onOpen: () => void;
}

function TaskBody({ task, backlog, mode, open, onOpen, ...ed }: RowProps) {
  const goal = backlog.goals.find((g) => g.id === task.goalId);
  const done = isTaskDone(task);
  const steps = subtaskProgress(task);
  const color = goal?.color ?? INDICATOR_COLORS.tasks;
  return (
    <>
      <div className="td-trow__main">
        <Check done={done} color={color} label={task.title} onClick={() => ed.onToggleTask?.(task.id)} />
        <div className="td-trow__col">
          <button type="button" className="td-trow__title" onClick={onOpen} aria-expanded={open}><span>{task.title}</span></button>
          {(goal || mode === "today" || task.tomorrow) && (
            <div className="td-trow__meta">
              {mode === "today" && (
                <label className={`td-trow__time${task.time ? " is-set" : ""}`}>
                  <Icon name="clock" />
                  <select value={task.time ?? ""} aria-label={`Godzina: ${task.title}`} onChange={(e) => ed.onSetTime?.(task.id, e.target.value || undefined)}>
                    <option value="">Czas</option>
                    {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
              )}
              {task.tomorrow && !task.today && <small className="td-trow__tomorrow">Jutro</small>}
              {goal && <small className="td-trow__goal" style={{ color: goal.color }}>◆ {goal.title}</small>}
            </div>
          )}
        </div>
        {steps.total > 0 && (
          <button type="button" className="td-trow__steps" onClick={onOpen} aria-label={`Podzadania ${steps.done} z ${steps.total}`} tabIndex={-1}>
            {steps.done}/{steps.total}<Icon name="chevronDown" />
          </button>
        )}
        {mode === "edit" && (
          <button type="button" className={`td-trow__today${task.today ? " is-on" : ""}`} aria-pressed={task.today} aria-label={task.today ? `Usuń z dzisiaj: ${task.title}` : `Zaplanuj na dziś: ${task.title}`} onClick={() => ed.onToggleToday?.(task.id)}>
            <Icon name="sun" />
          </button>
        )}
      </div>
      {open && (
        <div className="td-trow__panel" style={{ ["--c" as string]: color }}>
          {task.subtasks.length > 0 && (
            <ul className="td-trow__subs">
              {task.subtasks.map((s) => (
                <li key={s.id} className={s.done ? "is-done" : ""}>
                  <Check done={s.done} color={color} label={s.title} onClick={() => ed.onToggleSubtask?.(task.id, s.id)} />
                  <span>{s.title}</span>
                  <button type="button" className="td-iconlink" aria-label={`Usuń podzadanie: ${s.title}`} onClick={() => ed.onRemoveSubtask?.(task.id, s.id)}><Icon name="close" /></button>
                </li>
              ))}
            </ul>
          )}
          <AddInput placeholder="Dodaj podzadanie" label={`Podzadanie dla: ${task.title}`} onSubmit={(v) => ed.onAddSubtask?.(task.id, v)} />
          {backlog.goals.length > 0 && (
            <label className="td-panelrow">
              <span>Cel</span>
              <select value={task.goalId ?? ""} aria-label={`Cel zadania: ${task.title}`} onChange={(e) => ed.onSetTaskGoal?.(task.id, e.target.value || undefined)}>
                <option value="">Brak</option>
                {backlog.goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </label>
          )}
          <div className="td-panelactions">
            {mode === "today" && <button type="button" onClick={() => ed.onDeferTask?.(task.id)}><Icon name="chevron" />Na jutro</button>}
            {mode === "today" && <button type="button" onClick={() => ed.onToggleToday?.(task.id)}>Zdejmij z dzisiaj</button>}
            <button type="button" className="is-danger" onClick={() => ed.onRemoveTask?.(task.id)}><Icon name="trash" />Usuń zadanie</button>
          </div>
        </div>
      )}
    </>
  );
}

/** A row of today's list: can be dragged by its handle. */
function DraggableRow(props: RowProps) {
  const controls = useDragControls();
  return (
    <Reorder.Item as="li" value={props.task.id} dragListener={false} dragControls={controls} className={`td-trow${isTaskDone(props.task) ? " is-done" : ""}`} whileDrag={{ scale: 1.02, boxShadow: "0 8px 20px rgba(15,40,34,.18)", zIndex: 5 }}>
      <div className="td-trow__wrap">
        <button type="button" className="td-trow__grip" aria-label={`Przeciągnij, aby zmienić kolejność: ${props.task.title}`} onPointerDown={(e) => controls.start(e)}>
          <Icon name="grip" />
        </button>
        <div className="td-trow__rest"><TaskBody {...props} /></div>
      </div>
    </Reorder.Item>
  );
}

function GoalForm({ goal, onSubmit, onCancel }: { goal?: Goal; onSubmit?: (title: string, description: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(goal?.title ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit?.(title, description);
    onCancel();
  };
  return (
    <form className="td-goalform" onSubmit={submit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nazwa celu, np. Korona Gór Polski" aria-label="Nazwa celu" autoFocus />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opisz cel: po co go chcesz osiągnąć, jak poznasz, że jest zrobiony?" aria-label="Opis celu" rows={3} />
      <div className="td-panelactions">
        <button type="button" onClick={onCancel}>Anuluj</button>
        <button type="submit" className="is-primary" disabled={!title.trim()}>{goal ? "Zapisz" : "Utwórz cel"}</button>
      </div>
    </form>
  );
}

/**
 * Tasks on their own full screen.
 * "Dziś": today's tasks; drag the handle to set the order, pick a time for each one.
 * "Backlog": every task in sections; add and remove tasks, choose which ones are for today, create new sections.
 * "Cele": parent goals you describe yourself; link tasks to them (from the task, or from the goal).
 * Every task can have subtasks (tap the title to open the details).
 */
export function TasksPage({ backlog, tab: tab0 = "now", goalId: goal0, expanded: expanded0 = [], onClose, ...ed }: TasksPageProps) {
  const [tab, setTab] = useState<TasksTab>(goal0 ? "goals" : tab0);
  const [goalId, setGoalId] = useState<string | undefined>(goal0);
  const [expanded, setExpanded] = useState<string[]>(expanded0);
  const [newGoal, setNewGoal] = useState(false);
  const [editGoal, setEditGoal] = useState(false);
  const [sectionDraft, setSectionDraft] = useState(false);
  const [todaySection, setTodaySection] = useState(backlog.sections[0]?.id ?? "");
  const toggleOpen = (id: string) => setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
  const row = (t: Task, mode: "today" | "edit") => (
    <TaskBody key={t.id} task={t} backlog={backlog} mode={mode} open={expanded.includes(t.id)} onOpen={() => toggleOpen(t.id)} {...ed} />
  );
  const rowItem = (t: Task, mode: "today" | "edit") => <li key={t.id} className={`td-trow${isTaskDone(t) ? " is-done" : ""}`}>{row(t, mode)}</li>;
  const today = todayProgress(backlog);
  const todayList = todayTasks(backlog);
  const tomorrowList = tomorrowTasks(backlog);
  const openToday = todayList.filter((t) => !isTaskDone(t)).length;
  const openGoal = backlog.goals.find((g) => g.id === goalId);
  const goalTasks = openGoal ? tasksOfGoal(backlog, openGoal.id) : [];
  const fallbackSection = (openGoal && goalTasks.at(-1)?.sectionId) || backlog.sections[0]?.id || "";
  const unlinked = backlog.tasks.filter((t) => !t.goalId);

  return (
    <div className="td-phone td-phone--plain">
      <div className="td-statusfull td-tasks">
        <header className="td-status__head">
          <h3>Zadania</h3>
          <button type="button" className="td-status__close" onClick={onClose} aria-label="Zamknij"><Icon name="close" /></button>
        </header>
        <div className="td-seg" role="tablist" aria-label="Widok zadań">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? "is-on" : ""} onClick={() => { setTab(t.id); setGoalId(undefined); setNewGoal(false); setEditGoal(false); }}>{t.label}</button>
          ))}
        </div>
        <div className="td-status">
          {tab === "now" && (
            <section className="td-status__sec" style={{ ["--c" as string]: INDICATOR_COLORS.tasks }}>
              <header>
                <h4>Na dziś</h4>
                <span>{today.done}/{today.total}</span>
              </header>
              {backlog.todayOrder && (
                <div className="td-todaybar">
                  <small>Własna kolejność.</small>
                  <button type="button" onClick={ed.onSortByTime}>Wg godziny</button>
                </div>
              )}
              <Reorder.Group as="ul" axis="y" values={todayList.map((t) => t.id)} onReorder={(ids) => ed.onReorderToday?.(ids)} className="td-trows" data-testid="today-list">
                {todayList.map((t) => <DraggableRow key={t.id} task={t} backlog={backlog} mode="today" open={expanded.includes(t.id)} onOpen={() => toggleOpen(t.id)} {...ed} />)}
              </Reorder.Group>
              <AddInput placeholder="Dodaj zadanie na dziś" label="Nowe zadanie na dziś" onSubmit={(title) => ed.onAddTask?.({ title, sectionId: todaySection, today: true })}>
                <select className="td-addrow__sec" value={todaySection} onChange={(e) => setTodaySection(e.target.value)} aria-label="Sekcja nowego zadania">
                  {backlog.sections.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </AddInput>
              <div className="td-tomorrow">
                <header><h4>Jutro</h4><span>{tomorrowList.length}</span></header>
                {tomorrowList.length === 0 ? (
                  <p className="td-tomorrow__empty">Nic nie czeka na jutro. Przesuń zadanie przyciskiem „Na jutro” albo zepchnij wszystko poniżej.</p>
                ) : (
                  <ul className="td-trows">
                    {tomorrowList.map((t) => {
                      const g = backlog.goals.find((x) => x.id === t.goalId);
                      return (
                        <li key={t.id} className="td-trow td-trow--tomorrow">
                          <div className="td-trow__main">
                            <div className="td-trow__col"><span className="td-trow__title"><span>{t.title}</span></span>{g && <small className="td-trow__goal" style={{ color: g.color }}>◆ {g.title}</small>}</div>
                            <button type="button" className="td-tomorrow__back" aria-label={`Wróć na dziś: ${t.title}`} onClick={() => ed.onBringBack?.(t.id)}>Na dziś</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <button type="button" className="td-dashed td-tomorrow__push" disabled={openToday === 0} onClick={ed.onDeferAll}>
                  <Icon name="chevron" />Przenieś niezrobione na jutro{openToday > 0 ? ` (${openToday})` : ""}
                </button>
              </div>
            </section>
          )}
          {tab === "all" && (
            <>
              {tasksBySection(backlog).map(({ section, tasks }) => (
                <section key={section.id} className="td-status__sec" style={{ ["--c" as string]: INDICATOR_COLORS.tasks }}>
                  <header>
                    <h4>{section.title}</h4>
                    <span>
                      {tasks.length === 0 && (
                        <button type="button" className="td-iconlink" aria-label={`Usuń sekcję: ${section.title}`} onClick={() => ed.onRemoveSection?.(section.id)}><Icon name="trash" /></button>
                      )}
                      {tasks.filter(isTaskDone).length}/{tasks.length}
                    </span>
                  </header>
                  <ul className="td-trows">{tasks.map((t) => rowItem(t, "edit"))}</ul>
                  <AddInput placeholder="Dodaj zadanie" label={`Nowe zadanie w sekcji ${section.title}`} onSubmit={(title) => ed.onAddTask?.({ title, sectionId: section.id })} />
                </section>
              ))}
              {sectionDraft ? (
                <section className="td-status__sec" style={{ ["--c" as string]: INDICATOR_COLORS.tasks }}>
                  <header><h4>Nowa sekcja</h4></header>
                  <AddInput placeholder="Nazwa sekcji, np. Hobby" label="Nazwa nowej sekcji" onSubmit={(title) => { ed.onAddSection?.(title); setSectionDraft(false); }} />
                </section>
              ) : (
                <button type="button" className="td-dashed" onClick={() => setSectionDraft(true)}><Icon name="plus" />Nowa sekcja</button>
              )}
            </>
          )}
          {tab === "goals" && !openGoal && (
            <>
              {backlog.goals.map((g) => {
                const p = goalProgress(backlog, g.id);
                return (
                  <button key={g.id} type="button" className="td-goalcard" style={{ ["--c" as string]: g.color ?? INDICATOR_COLORS.tasks }} onClick={() => setGoalId(g.id)}>
                    <span className="td-goalcard__top"><b>{g.title}</b><span>{p.done}/{p.total}</span></span>
                    {g.description && <span className="td-goalcard__desc">{g.description}</span>}
                    <span className="td-goalcard__bar" role="progressbar" aria-label={g.title} aria-valuenow={p.percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${p.percent}%` }} /></span>
                    <small>{p.total} {p.total === 1 ? "zadanie" : "zadań"} połączonych z celem</small>
                  </button>
                );
              })}
              {newGoal ? (
                <section className="td-status__sec" style={{ ["--c" as string]: INDICATOR_COLORS.tasks }}>
                  <header><h4>Nowy cel</h4></header>
                  <GoalForm onSubmit={ed.onAddGoal} onCancel={() => setNewGoal(false)} />
                </section>
              ) : (
                <button type="button" className="td-dashed" onClick={() => setNewGoal(true)}><Icon name="plus" />Nowy cel</button>
              )}
            </>
          )}
          {tab === "goals" && openGoal && (
            <section className="td-status__sec" style={{ ["--c" as string]: openGoal.color ?? INDICATOR_COLORS.tasks }}>
              <header>
                <h4><button type="button" className="td-linkback" onClick={() => { setGoalId(undefined); setEditGoal(false); }} aria-label="Wszystkie cele"><Icon name="back" /></button>{openGoal.title}</h4>
                <span>{goalProgress(backlog, openGoal.id).done}/{goalProgress(backlog, openGoal.id).total}</span>
              </header>
              {editGoal ? (
                <GoalForm goal={openGoal} onSubmit={(title, description) => ed.onUpdateGoal?.(openGoal.id, { title, description })} onCancel={() => setEditGoal(false)} />
              ) : (
                <>
                  {openGoal.description ? <p className="td-goaldesc">{openGoal.description}</p> : <p className="td-goaldesc is-empty">Brak opisu. Dotknij „Edytuj”, aby opisać cel.</p>}
                  <div className="td-panelactions">
                    <button type="button" onClick={() => setEditGoal(true)}><Icon name="edit" />Edytuj</button>
                    <button type="button" className="is-danger" onClick={() => { ed.onRemoveGoal?.(openGoal.id); setGoalId(undefined); }}><Icon name="trash" />Usuń cel</button>
                  </div>
                </>
              )}
              <ul className="td-trows">{goalTasks.map((t) => rowItem(t, "edit"))}</ul>
              <AddInput placeholder="Dodaj zadanie do celu" label={`Nowe zadanie dla celu ${openGoal.title}`} onSubmit={(title) => ed.onAddTask?.({ title, sectionId: fallbackSection, goalId: openGoal.id })} />
              {unlinked.length > 0 && (
                <label className="td-panelrow">
                  <span>Połącz istniejące</span>
                  <select value="" aria-label="Połącz istniejące zadanie z celem" onChange={(e) => e.target.value && ed.onSetTaskGoal?.(e.target.value, openGoal.id)}>
                    <option value="">Wybierz zadanie…</option>
                    {unlinked.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </label>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
