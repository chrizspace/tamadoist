import { useState } from "react";
import {
  goalProgress, isTaskDone, subtaskProgress, tasksBySection, tasksOfGoal, todayProgress, todayTasks,
  type Backlog, type Goal, type Task,
} from "@tamadoist/core";
import { Icon } from "../components/Icon";
import { INDICATOR_COLORS } from "../character/Indicators";

export type TasksTab = "today" | "backlog" | "goals";

export interface TasksPageProps {
  backlog: Backlog;
  tab?: TasksTab;
  /** Open a goal's task list right away. */
  goalId?: string;
  /** Task ids that start expanded (showing their subtasks). */
  expanded?: string[];
  onToggleTask?: (id: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onToggleToday?: (id: string) => void;
  onClose?: () => void;
}

const TABS: { id: TasksTab; label: string }[] = [
  { id: "today", label: "Dziś" },
  { id: "backlog", label: "Backlog" },
  { id: "goals", label: "Cele" },
];

function Check({ done, color, label, onClick }: { done: boolean; color: string; label: string; onClick?: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={done} aria-label={label} className={`td-status__check${done ? " is-done" : ""}`} style={{ ["--c" as string]: color }} onClick={onClick}>
      {done && <Icon name="check" />}
    </button>
  );
}

interface RowProps {
  task: Task;
  goal?: Goal;
  open: boolean;
  /** Show the "plan for today" star (backlog and goal views). */
  starrable: boolean;
  onOpen: () => void;
  onToggleTask?: (id: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onToggleToday?: (id: string) => void;
}

function TaskRow({ task, goal, open, starrable, onOpen, onToggleTask, onToggleSubtask, onToggleToday }: RowProps) {
  const done = isTaskDone(task);
  const steps = subtaskProgress(task);
  const color = goal?.color ?? INDICATOR_COLORS.tasks;
  return (
    <li className={`td-trow${done ? " is-done" : ""}`}>
      <div className="td-trow__main">
        <Check done={done} color={color} label={task.title} onClick={() => onToggleTask?.(task.id)} />
        <button type="button" className="td-trow__title" onClick={onOpen} aria-expanded={steps.total > 0 ? open : undefined} disabled={steps.total === 0}>
          <span>{task.title}</span>
          {goal && <small className="td-trow__goal" style={{ color: goal.color }}>◆ {goal.title}</small>}
        </button>
        {steps.total > 0 && (
          <button type="button" className="td-trow__steps" onClick={onOpen} aria-label={`Podzadania ${steps.done} z ${steps.total}`} tabIndex={-1}>
            {steps.done}/{steps.total}<Icon name="chevronDown" />
          </button>
        )}
        {starrable && (
          <button type="button" className={`td-trow__today${task.today ? " is-on" : ""}`} aria-pressed={task.today} aria-label={task.today ? "Usuń z dzisiaj" : "Zaplanuj na dziś"} onClick={() => onToggleToday?.(task.id)}>
            <Icon name="sun" />
          </button>
        )}
      </div>
      {open && steps.total > 0 && (
        <ul className="td-trow__subs">
          {task.subtasks.map((s) => (
            <li key={s.id} className={s.done ? "is-done" : ""}>
              <Check done={s.done} color={color} label={s.title} onClick={() => onToggleSubtask?.(task.id, s.id)} />
              <span>{s.title}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Tasks on their own full screen. "Dziś" is the list of tasks planned for today; "Backlog" holds everything,
 * split into sections; "Cele" shows goals with their progress and the tasks that feed them.
 * Every task can have subtasks (tap the row to unfold them); a task can be linked to a goal.
 */
export function TasksPage({ backlog, tab: tab0 = "today", goalId: goal0, expanded: expanded0 = [], onToggleTask, onToggleSubtask, onToggleToday, onClose }: TasksPageProps) {
  const [tab, setTab] = useState<TasksTab>(goal0 ? "goals" : tab0);
  const [goalId, setGoalId] = useState<string | undefined>(goal0);
  const [expanded, setExpanded] = useState<string[]>(expanded0);
  const toggleOpen = (id: string) => setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
  const goalOf = (t: Task) => backlog.goals.find((g) => g.id === t.goalId);
  const row = (t: Task, starrable: boolean) => (
    <TaskRow key={t.id} task={t} goal={goalOf(t)} open={expanded.includes(t.id)} starrable={starrable}
      onOpen={() => toggleOpen(t.id)} onToggleTask={onToggleTask} onToggleSubtask={onToggleSubtask} onToggleToday={onToggleToday} />
  );
  const today = todayProgress(backlog);
  const openGoal = backlog.goals.find((g) => g.id === goalId);

  return (
    <div className="td-phone td-phone--plain">
      <div className="td-statusfull">
        <header className="td-status__head">
          <h3>Zadania</h3>
          <button type="button" className="td-status__close" onClick={onClose} aria-label="Zamknij"><Icon name="close" /></button>
        </header>
        <div className="td-seg" role="tablist" aria-label="Widok zadań">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? "is-on" : ""} onClick={() => { setTab(t.id); setGoalId(undefined); }}>{t.label}</button>
          ))}
        </div>
        <div className="td-status">
          {tab === "today" && (
            <section className="td-status__sec" style={{ ["--c" as string]: INDICATOR_COLORS.tasks }}>
              <header><h4>Na dziś</h4><span>{today.done}/{today.total}</span></header>
              <ul className="td-trows">{todayTasks(backlog).map((t) => row(t, false))}</ul>
            </section>
          )}
          {tab === "backlog" && tasksBySection(backlog).map(({ section, tasks }) => (
            <section key={section.id} className="td-status__sec" style={{ ["--c" as string]: INDICATOR_COLORS.tasks }}>
              <header><h4>{section.title}</h4><span>{tasks.filter(isTaskDone).length}/{tasks.length}</span></header>
              <ul className="td-trows">{tasks.map((t) => row(t, true))}</ul>
            </section>
          ))}
          {tab === "goals" && !openGoal && backlog.goals.map((g) => {
            const p = goalProgress(backlog, g.id);
            return (
              <button key={g.id} type="button" className="td-goalcard" style={{ ["--c" as string]: g.color ?? INDICATOR_COLORS.tasks }} onClick={() => setGoalId(g.id)}>
                <span className="td-goalcard__top"><b>{g.title}</b><span>{p.done}/{p.total}</span></span>
                <span className="td-goalcard__bar" role="progressbar" aria-label={g.title} aria-valuenow={p.percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${p.percent}%` }} /></span>
                <small>{p.total} zadań połączonych z celem</small>
              </button>
            );
          })}
          {tab === "goals" && openGoal && (
            <section className="td-status__sec" style={{ ["--c" as string]: openGoal.color ?? INDICATOR_COLORS.tasks }}>
              <header>
                <h4><button type="button" className="td-linkback" onClick={() => setGoalId(undefined)} aria-label="Wszystkie cele"><Icon name="back" /></button>{openGoal.title}</h4>
                <span>{goalProgress(backlog, openGoal.id).done}/{goalProgress(backlog, openGoal.id).total}</span>
              </header>
              <ul className="td-trows">{tasksOfGoal(backlog, openGoal.id).map((t) => row(t, true))}</ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
