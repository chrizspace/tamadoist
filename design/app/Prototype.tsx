import { useMemo, useRef, useState } from "react";
import { MEALS_GOAL, predictNeed, completeNext, toggleItem, completeNextStep, isTaskDone, nextStep, nextTask, toggleSubtask, toggleTask, toggleToday, todayProgress, todayTasks, bringBackToToday, deferOpenToTomorrow, deferToTomorrow, addGoal, addSection, addSubtask, addTask, moveToday, removeGoal, removeSection, removeSubtask, removeTask, reorderToday, setTaskGoal, setTaskTime, sortTodayByTime, updateGoal, LOCATIONS, PERIODS, PET_STATES, periodWindows, validateName, type LocationId, type PetState } from "@tamadoist/core";
import {
  IndicatorsProvider, IndicatorsLayoutContext, StatusScreen, ChecklistActionScreen, ChecklistPage, SAMPLE_BACKLOG, TasksPage, SAMPLE_HABIT_ITEMS, type DialKey, type IndicatorsLayout, EnergyExplainScreen, EnergyIndicatorScreen, HomeScreen, LocationPermissionScreen, LoginScreen, MenuScreen, NameScreen,
  PlacesScreen, RenameDialogScreen, ScenePickerScreen, ScheduleScreen, SchedulePromptScreen, SettingsScreen,
  SleepScreen, NutritionScreen, SleepPage, WeightScreen,
} from "@tamadoist/ui";
import { Fit, Timeline } from "./chrome";
import { useActions } from "./modules/actions";
import { useCharacter } from "./modules/character";
import { useScene, type SimPosition } from "./modules/scene";
import { CITIES, SEASONS, deriveWorld, fmt, isoDate, parseIso, type Env, DEFAULT_ENV } from "./world";

type ScreenId = "login" | "name" | "energy" | "indicator" | "sleep" | "weight" | "home" | "menu" | "nutrition" | "sleep-edit" | "settings" | "rename" | "scenes" | "places" | "locperm" | "schedule" | "prompt" | "status" | "tasks" | "tasks-list" | "habits" | "habits-list";

const CRUMBS: [ScreenId, string][] = [
  ["login", "Login"], ["name", "Imię"], ["energy", "Energia"], ["indicator", "Wskaźnik"], ["sleep", "Sen"], ["weight", "Waga"],
  ["home", "Home"], ["menu", "Menu"], ["nutrition", "Zadbaj"], ["tasks", "Zadania"], ["habits", "Nawyki"], ["status", "Status"], ["scenes", "Wybór sceny"], ["places", "Miejsca"], ["locperm", "Lokalizacja"],
  ["schedule", "Plan dnia"], ["prompt", "Pytanie o plan"], ["settings", "Ustawienia"], ["rename", "Zmiana imienia"],
];

export function Prototype() {
  const ch = useCharacter();
  const sc = useScene();
  const ac = useActions();
  const [clock, setClock] = useState(480);
  const [screen, setScreen] = useState<ScreenId>("login");
  const [draft, setDraft] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [toast, setToast] = useState("");
  const [forced, setForced] = useState<PetState | "">("");
  const [threeIndicators, setThree] = useState(true);
  const [zones, setZones] = useState(false);
  const [backlog, setBacklog] = useState(SAMPLE_BACKLOG);
  const nextId = useRef(1);
  const uid = (prefix: string) => `${prefix}-n${nextId.current++}`;
  const [habitManual, setHabitManual] = useState<Record<string, boolean>>({});
  const [statusFocus, setStatusFocus] = useState<DialKey>("energy");
  const [statusBack, setStatusBack] = useState<ScreenId>("home");
  const [layout, setLayout] = useState<IndicatorsLayout>("dial");
  const [cityId, setCityId] = useState(DEFAULT_ENV.city.id);
  const [date, setDate] = useState(DEFAULT_ENV.date);
  const env: Env = useMemo(() => ({ city: CITIES.find((c) => c.id === cityId)!, date }), [cityId, date]);

  const w = useMemo(() => deriveWorld(ch, sc, ac, clock, forced || undefined, env), [ch, sc, ac, clock, forced, env]);
  const d = {
    name: w.name, sleepStart: ch.profile.sleepStart, sleepEnd: w.sleepEnd, weightKg: ch.profile.weightKg, goalMl: ch.goalMl,
    drunkMl: ac.drunkMl, energyPercent: w.energy.percent, energyUntil: w.energy.energyUntil,
  };
  const scene = { location: w.scene.location, period: w.scene.period.id };
  const todayP = todayProgress(backlog);
  const tasksDone = todayP.done;
  const next = nextTask(backlog);
  const nextStepTitle = next ? (nextStep(next) ? `${next.title} · ${nextStep(next)!.title}` : next.title) : null;
  const need = predictNeed({ minutes: clock, sleepStart: ch.profile.sleepStart, sleepEnd: w.sleepEnd, sleeping: w.energy.state === "sleeping", drunkMl: ac.drunkMl, goalMl: ch.goalMl, meals: ac.meals, mealsGoal: MEALS_GOAL });
  const go = (s: ScreenId) => setScreen(s);
  const openStatus = (from: ScreenId) => (key: DialKey) => { setStatusFocus(key); setStatusBack(from); go("status"); };
  // Habits: ticked by hand, or automatic when the underlying goal is met (water goal, all tasks).
  const habitItems = SAMPLE_HABIT_ITEMS.map((h) => ({
    ...h,
    done: Boolean(habitManual[h.id]) || (h.id === "h1" && ac.drunkMl >= ch.goalMl) || (h.id === "h3" && tasksDone >= todayP.total),
  }));
  const habitDetail: Record<string, string> = { h1: `${ac.drunkMl} / ${ch.goalMl} ml`, h2: `do ${ch.profile.sleepStart}`, h3: `${tasksDone} / ${todayP.total}` };
  const habits = habitItems.map((h) => ({ ...h, detail: habitDetail[h.id] ?? "" }));
  const completeNextHabit = () => { const n = habitItems.find((h) => !h.done); if (n) setHabitManual((m) => ({ ...m, [n.id]: true })); };
  const toggleHabit = (id: string) => setHabitManual((m) => ({ ...m, [id]: !habitItems.find((h) => h.id === id)?.done }));
  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(""), 1400); };

  const render = () => {
    switch (screen) {
      case "login": return <LoginScreen onGoogle={() => go("name")} />;
      case "name": return <NameScreen name={ch.profile.name} onName={ch.setName} error={nameError} onNext={() => { const e = validateName(ch.profile.name); setNameError(e ?? undefined); if (!e) go("energy"); }} />;
      case "energy": return <EnergyExplainScreen name={w.name} onNext={() => go("indicator")} />;
      case "indicator": return <EnergyIndicatorScreen name={w.name} energyPercent={d.energyPercent} onNext={() => go("sleep")} />;
      case "sleep": return <SleepScreen name={w.name} sleepStart={d.sleepStart} sleepEnd={d.sleepEnd} onSleepStart={ch.setSleepStart} onNext={() => go("weight")} />;
      case "weight": return <WeightScreen name={w.name} weightKg={d.weightKg} goalMl={d.goalMl} onWeight={ch.setWeight} onNext={() => go("home")} />;
      case "home": return <HomeScreen {...d} {...scene} need={need.need} state={w.petState} toast={toast} onMenu={() => go("menu")} onTitle={() => go("scenes")} onIndicator={openStatus("home")} onAction={(id) => id === "nutrition" ? go("nutrition") : id === "tasks" ? go("tasks") : id === "habits" && go("habits")} />;
      case "menu": return <MenuScreen name={w.name} energyPercent={d.energyPercent} onClose={() => go("home")} onSettings={() => go("settings")} onPlaces={() => go("places")} onSchedule={() => go("schedule")} onLogout={() => { ch.reset(); ac.reset(); sc.setManual(undefined); sc.setPos("none"); go("login"); }} />;
      case "nutrition": return <NutritionScreen {...scene} name={w.name} energyPercent={d.energyPercent} state={ac.justDrank ? "drinking" : ac.justAte && w.petState !== "sleeping" ? "happy" : w.petState} drunkMl={ac.drunkMl} goalMl={ch.goalMl} meals={ac.meals} sleepStart={ch.profile.sleepStart} sleepEnd={w.sleepEnd} gain={toast} onBack={() => go("home")} onWater={() => { ac.add(); flash("+250 ml"); }} onMeal={() => { ac.eat(); flash("+1 posiłek"); }} onSleep={() => go("sleep-edit")} onIndicator={openStatus("nutrition")} />;
      case "sleep-edit": return <SleepPage sleepStart={ch.profile.sleepStart} sleepEnd={w.sleepEnd} onSleepStart={ch.setSleepStart} onClose={() => go("nutrition")} />;
      case "settings": return <SettingsScreen {...d} onBack={() => go("home")} onEditName={() => { setDraft(ch.profile.name); go("rename"); }} />;
      case "rename": return <RenameDialogScreen {...d} draft={draft} onDraft={setDraft} onCancel={() => go("settings")} onSave={() => { if (!validateName(draft)) { ch.saveName(draft); go("settings"); } }} />;
      case "scenes": return <ScenePickerScreen name={w.name} energyPercent={d.energyPercent} {...scene} auto={!sc.manual} onPick={(l) => { sc.setManual(l); go("home"); }} onAuto={(on) => { if (on) sc.setManual(undefined); go("home"); }} onClose={() => go("home")} />;
      case "places": return <PlacesScreen energyPercent={d.energyPercent} onBack={() => go("home")} onUseLocation={() => go("locperm")} />;
      case "locperm": return <LocationPermissionScreen name={w.name} onAllow={() => { sc.setPos("home"); go("places"); }} onLater={() => go("places")} />;
      case "schedule": return <ScheduleScreen energyPercent={d.energyPercent} onBack={() => go("home")} />;
      case "status": return <StatusScreen {...scene} name={w.name} focus={statusFocus} energyPercent={d.energyPercent} energyUntil={d.energyUntil} sleepStart={d.sleepStart} sleepEnd={d.sleepEnd} sleeping={w.energy.state === "sleeping"} tasks={todayTasks(backlog).map((t) => ({ id: t.id, title: t.title, done: isTaskDone(t) }))} habits={habits} streakDays={12} onClose={() => go(statusBack)} />;
      case "tasks": return <ChecklistActionScreen {...scene} title="Zadania" name={w.name} energyPercent={d.energyPercent} state={w.petState} progress={todayP} nextLabel={nextStepTitle} gain={toast} onBack={() => go("home")} onDone={() => { setBacklog(completeNextStep); flash("+1"); }} onList={() => go("tasks-list")} onIndicator={openStatus("tasks")} />;
      case "tasks-list": return (
        <TasksPage
          backlog={backlog}
          onToggleTask={(id) => setBacklog((b) => toggleTask(b, id))}
          onToggleSubtask={(t, sId) => setBacklog((b) => toggleSubtask(b, t, sId))}
          onToggleToday={(id) => setBacklog((b) => toggleToday(b, id))}
          onReorderToday={(ids) => setBacklog((b) => reorderToday(b, ids))}
          onSetTime={(id, time) => setBacklog((b) => setTaskTime(b, id, time))}
          onSortByTime={() => setBacklog((b) => sortTodayByTime(b))}
          onAddTask={(input) => setBacklog((b) => addTask(b, { id: uid("t"), ...input }))}
          onRemoveTask={(id) => setBacklog((b) => removeTask(b, id))}
          onAddSubtask={(t, title) => setBacklog((b) => addSubtask(b, t, uid("s"), title))}
          onRemoveSubtask={(t, sId) => setBacklog((b) => removeSubtask(b, t, sId))}
          onDeferTask={(id) => setBacklog((b) => deferToTomorrow(b, id))}
          onDeferAll={() => setBacklog((b) => deferOpenToTomorrow(b))}
          onBringBack={(id) => setBacklog((b) => bringBackToToday(b, id))}
          onAddSection={(title) => setBacklog((b) => addSection(b, uid("sec"), title))}
          onRemoveSection={(id) => setBacklog((b) => removeSection(b, id))}
          onAddGoal={(title, description) => setBacklog((b) => addGoal(b, uid("g"), title, description))}
          onUpdateGoal={(id, patch) => setBacklog((b) => updateGoal(b, id, patch))}
          onRemoveGoal={(id) => setBacklog((b) => removeGoal(b, id))}
          onSetTaskGoal={(t, g) => setBacklog((b) => setTaskGoal(b, t, g))}
          onClose={() => go("tasks")}
        />
      );
      case "habits": return <ChecklistActionScreen {...scene} title="Nawyki" name={w.name} energyPercent={d.energyPercent} state={w.petState} items={habitItems} gain={toast} onBack={() => go("home")} onDone={() => { completeNextHabit(); flash("+1"); }} onList={() => go("habits-list")} onIndicator={openStatus("habits")} />;
      case "habits-list": return <ChecklistPage title="Nawyki" color="#FF8A3D" items={habitItems} onToggle={toggleHabit} onClose={() => go("habits")} />;
      case "prompt": return <SchedulePromptScreen name={w.name} energyPercent={d.energyPercent} onYes={() => go("home")} onChange={() => go("schedule")} />;
    }
  };

  const rows: [string, string][] = [
    ["Imię", ch.profile.name || "—"],
    ["Sen", `${ch.profile.sleepStart} → ${w.sleepEnd}`],
    ["Waga / cel", `${ch.profile.weightKg} kg / ${ch.goalMl} ml`],
    ["Stan postaci", w.petState],
    ["Najbliższa potrzeba", `${{ drink: "picie", eat: "jedzenie", sleep: "sen" }[need.need]} (pilność ${Math.round(need.urgency * 100)}%)`],
    ["Energia", w.energy.state === "sleeping" ? `${w.energy.percent}% (śpi, ładuje się)` : `${w.energy.percent}% do ${w.energy.energyUntil}`],
    ["Pora dnia", w.scene.period.label],
    ["Scena", `${w.scene.label} (${w.scene.source})`],
    ["Woda", `${ac.drunkMl} ml`],
  ];

  return (
    <div className="proto">
      <div className="protoframe"><Fit><div className={`phoneroot${zones ? " show-zones" : ""}`}><IndicatorsProvider value={threeIndicators ? { tasks: { done: tasksDone, total: todayP.total }, streak: { days: 12, progress: Math.min(1, ac.drunkMl / ch.goalMl) } } : {}}><IndicatorsLayoutContext.Provider value={layout}>{render()}</IndicatorsLayoutContext.Provider></IndicatorsProvider></div></Fit></div>
      <div className="protoctl">
        <details open className="box mod"><summary><b>Ekran</b></summary>
          <div className="crumbs">
            {CRUMBS.map(([id, l]) => <button key={id} aria-current={screen === id} onClick={() => { if (!ch.profile.name) ch.setName("Tama"); go(id); }}>{l}</button>)}
          </div>
        </details>

        <details open className="box mod"><summary><b>Środowisko</b> · czas i miejsce</summary>
          <div className="ctl"><label htmlFor="clock">Godzina</label><input id="clock" type="range" min={0} max={1435} step={5} value={clock} onChange={(e) => setClock(+e.target.value)} /><b className="mono">{fmt(clock)}</b></div>
          <div className="ctl"><label htmlFor="e-city">Miasto</label>
            <select id="e-city" value={cityId} onChange={(e) => setCityId(e.target.value)}>{CITIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          <div className="ctl"><label htmlFor="e-date">Data</label><input id="e-date" type="date" value={isoDate(date)} onChange={(e) => e.target.value && setDate(parseIso(e.target.value))} /></div>
          <div className="crumbs">{SEASONS.map((x) => <button key={x.id} aria-current={isoDate(x.date) === isoDate(date)} onClick={() => setDate(x.date)}>{x.label}</button>)}</div>
          <p className="note">Wschód {w.sun.polar ? "—" : fmt(w.sun.sunrise)}, zachód {w.sun.polar ? "—" : fmt(w.sun.sunset)}{w.sun.polar ? ` (${w.sun.polar === "day" ? "dzień polarny" : "noc polarna"})` : ""}. Zegar, miasto i data zmieniają porę dnia (światło), energię i plan dnia.</p>
          <Timeline windows={periodWindows(w.sun)} sunrise={w.sun.polar ? undefined : w.sun.sunrise} sunset={w.sun.polar ? undefined : w.sun.sunset} />
        </details>

        <details open className="box mod"><summary><b>1 · Postać</b></summary>
          <div className="ctl"><label htmlFor="p-sleep">Sen od</label>
            <select id="p-sleep" value={ch.profile.sleepStart} onChange={(e) => ch.setSleepStart(e.target.value)}>
              {Array.from({ length: 48 }, (_, i) => fmt(i * 30)).map((t) => <option key={t}>{t}</option>)}
            </select></div>
          <div className="ctl"><label htmlFor="p-weight">Waga</label><input id="p-weight" type="number" value={ch.profile.weightKg} onChange={(e) => ch.setWeight(e.target.value)} /><span className="note">kg → {ch.goalMl} ml</span></div>
          <div className="ctl"><label htmlFor="p-state">Wymuś stan</label>
            <select id="p-state" value={forced} onChange={(e) => setForced(e.target.value as PetState | "")}><option value="">(wyliczony)</option>{PET_STATES.map((s) => <option key={s}>{s}</option>)}</select></div>
        </details>

        <details open className="box mod"><summary><b>2 · Scena</b></summary>
          <div className="ctl"><label htmlFor="s-pos">Lokalizacja</label>
            <select id="s-pos" value={sc.pos} onChange={(e) => sc.setPos(e.target.value as SimPosition)}><option value="none">Nieznane miejsce</option><option value="home">Dom</option><option value="work">Praca</option><option value="gym">Siłownia</option></select></div>
          <div className="ctl"><label htmlFor="s-man">Ręcznie</label>
            <select id="s-man" value={sc.manual ?? ""} onChange={(e) => sc.setManual((e.target.value || undefined) as LocationId | undefined)}><option value="">(automatycznie)</option>{LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}</select></div>
          <p className="note">Pory dziś: {periodWindows(w.sun).map((x, i) => `${PERIODS[i]!.label} ${fmt(x.start)}–${fmt(x.end)}`).join(" · ")}</p>
        </details>

        <details open className="box mod"><summary><b>Wskaźniki</b> · nagłówek</summary>
          <div className="ctl"><label htmlFor="ind3">Trzy wskaźniki</label><input id="ind3" type="checkbox" checked={threeIndicators} onChange={(e) => setThree(e.target.checked)} /><span className="note">energia + zadania + seria (placeholdery; zadania rosną z wypitą wodą)</span></div>
          <div className="ctl"><label htmlFor="ilayout">Układ wskaźników</label><select id="ilayout" value={layout} onChange={(e) => setLayout(e.target.value as IndicatorsLayout)}><option value="dial">okrągły z kropkami</option><option value="bar">poziomo (kapsuła)</option><option value="rail">pionowo (szyna)</option></select></div>
          <div className="ctl"><label htmlFor="zones">Strefy ekranu</label><input id="zones" type="checkbox" checked={zones} onChange={(e) => setZones(e.target.checked)} /><span className="note">żółta ramka = scena zarezerwowana na postać i animacje</span></div>
        </details>

        <details open className="box mod"><summary><b>3 · Akcje</b> · woda</summary>
          <div className="ctl"><button className="mini" onClick={ac.remove}>−250 ml</button><button className="mini" onClick={ac.add}>+250 ml</button><b className="mono">{ac.drunkMl} ml</b></div>
        </details>

        <details open className="box mod"><summary><b>Stan</b></summary>
          <table className="tbl"><tbody>{rows.map(([a, b]) => <tr key={a}><th>{a}</th><td>{b}</td></tr>)}</tbody></table>
        </details>
      </div>
    </div>
  );
}
