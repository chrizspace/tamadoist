import { useMemo, useState } from "react";
import { LOCATIONS, PERIODS, PET_STATES, periodWindows, validateName, type LocationId, type PetState } from "@tamadoist/core";
import {
  IndicatorsProvider, EnergyExplainScreen, EnergyIndicatorScreen, HomeScreen, LocationPermissionScreen, LoginScreen, MenuScreen, NameScreen,
  PlacesScreen, RenameDialogScreen, ScenePickerScreen, ScheduleScreen, SchedulePromptScreen, SettingsScreen,
  SleepScreen, WaterScreen, WeightScreen,
} from "@tamadoist/ui";
import { Fit, Timeline } from "./chrome";
import { useActions } from "./modules/actions";
import { useCharacter } from "./modules/character";
import { useScene, type SimPosition } from "./modules/scene";
import { CITIES, SEASONS, deriveWorld, fmt, isoDate, parseIso, type Env, DEFAULT_ENV } from "./world";

type ScreenId = "login" | "name" | "energy" | "indicator" | "sleep" | "weight" | "home" | "menu" | "water" | "settings" | "rename" | "scenes" | "places" | "locperm" | "schedule" | "prompt";

const CRUMBS: [ScreenId, string][] = [
  ["login", "Login"], ["name", "Imię"], ["energy", "Energia"], ["indicator", "Wskaźnik"], ["sleep", "Sen"], ["weight", "Waga"],
  ["home", "Home"], ["menu", "Menu"], ["water", "Woda"], ["scenes", "Wybór sceny"], ["places", "Miejsca"], ["locperm", "Lokalizacja"],
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
  const [threeIndicators, setThree] = useState(false);
  const [zones, setZones] = useState(false);
  const [cityId, setCityId] = useState(DEFAULT_ENV.city.id);
  const [date, setDate] = useState(DEFAULT_ENV.date);
  const env: Env = useMemo(() => ({ city: CITIES.find((c) => c.id === cityId)!, date }), [cityId, date]);

  const w = useMemo(() => deriveWorld(ch, sc, ac, clock, forced || undefined, env), [ch, sc, ac, clock, forced, env]);
  const d = {
    name: w.name, sleepStart: ch.profile.sleepStart, sleepEnd: w.sleepEnd, weightKg: ch.profile.weightKg, goalMl: ch.goalMl,
    drunkMl: ac.drunkMl, energyPercent: w.energy.percent, energyUntil: w.energy.energyUntil,
  };
  const scene = { location: w.scene.location, period: w.scene.period.id };
  const xp = 640 + Math.floor(ac.drunkMl / 250) * 10; // demo: +10 EXP per glass of water
  const go = (s: ScreenId) => setScreen(s);
  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(""), 1400); };

  const render = () => {
    switch (screen) {
      case "login": return <LoginScreen onGoogle={() => go("name")} />;
      case "name": return <NameScreen name={ch.profile.name} onName={ch.setName} error={nameError} onNext={() => { const e = validateName(ch.profile.name); setNameError(e ?? undefined); if (!e) go("energy"); }} />;
      case "energy": return <EnergyExplainScreen name={w.name} onNext={() => go("indicator")} />;
      case "indicator": return <EnergyIndicatorScreen name={w.name} energyPercent={d.energyPercent} onNext={() => go("sleep")} />;
      case "sleep": return <SleepScreen name={w.name} sleepStart={d.sleepStart} sleepEnd={d.sleepEnd} onSleepStart={ch.setSleepStart} onNext={() => go("weight")} />;
      case "weight": return <WeightScreen name={w.name} weightKg={d.weightKg} goalMl={d.goalMl} onWeight={ch.setWeight} onNext={() => go("home")} />;
      case "home": return <HomeScreen {...d} {...scene} state={w.petState} toast={toast} onMenu={() => go("menu")} onTitle={() => go("scenes")} onEnergy={() => flash(`Energia ${d.energyPercent}% · ${w.energy.state === "sleeping" ? "śpi, ładuje się" : `starczy do ${w.energy.energyUntil}`}`)} onAction={(id) => id === "water" && go("water")} />;
      case "menu": return <MenuScreen name={w.name} energyPercent={d.energyPercent} onClose={() => go("home")} onSettings={() => go("settings")} onPlaces={() => go("places")} onSchedule={() => go("schedule")} onLogout={() => { ch.reset(); ac.reset(); sc.setManual(undefined); sc.setPos("none"); go("login"); }} />;
      case "water": return <WaterScreen {...d} {...scene} drinking={ac.justDrank} toast={toast} onBack={() => go("home")} onPlus={() => { ac.add(); flash("+250 ml wody"); }} onMinus={() => { ac.remove(); flash("−250 ml wody"); }} />;
      case "settings": return <SettingsScreen {...d} onBack={() => go("home")} onEditName={() => { setDraft(ch.profile.name); go("rename"); }} />;
      case "rename": return <RenameDialogScreen {...d} draft={draft} onDraft={setDraft} onCancel={() => go("settings")} onSave={() => { if (!validateName(draft)) { ch.saveName(draft); go("settings"); } }} />;
      case "scenes": return <ScenePickerScreen name={w.name} energyPercent={d.energyPercent} {...scene} auto={!sc.manual} onPick={(l) => { sc.setManual(l); go("home"); }} onAuto={(on) => { if (on) sc.setManual(undefined); go("home"); }} onClose={() => go("home")} />;
      case "places": return <PlacesScreen energyPercent={d.energyPercent} onBack={() => go("home")} onUseLocation={() => go("locperm")} />;
      case "locperm": return <LocationPermissionScreen name={w.name} onAllow={() => { sc.setPos("home"); go("places"); }} onLater={() => go("places")} />;
      case "schedule": return <ScheduleScreen energyPercent={d.energyPercent} onBack={() => go("home")} />;
      case "prompt": return <SchedulePromptScreen name={w.name} energyPercent={d.energyPercent} onYes={() => go("home")} onChange={() => go("schedule")} />;
    }
  };

  const rows: [string, string][] = [
    ["Imię", ch.profile.name || "—"],
    ["Sen", `${ch.profile.sleepStart} → ${w.sleepEnd}`],
    ["Waga / cel", `${ch.profile.weightKg} kg / ${ch.goalMl} ml`],
    ["Stan postaci", w.petState],
    ["Energia", w.energy.state === "sleeping" ? `${w.energy.percent}% (śpi, ładuje się)` : `${w.energy.percent}% do ${w.energy.energyUntil}`],
    ["Pora dnia", w.scene.period.label],
    ["Scena", `${w.scene.label} (${w.scene.source})`],
    ["Woda", `${ac.drunkMl} ml`],
  ];

  return (
    <div className="proto">
      <div className="protoframe"><Fit><div className={`phoneroot${zones ? " show-zones" : ""}`}><IndicatorsProvider value={threeIndicators ? { exp: { level: Math.floor(xp / 100), progress: (xp % 100) / 100 }, streak: { days: 12, progress: Math.min(1, ac.drunkMl / ch.goalMl) } } : {}}>{render()}</IndicatorsProvider></div></Fit></div>
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
          <div className="ctl"><label htmlFor="ind3">Trzy wskaźniki</label><input id="ind3" type="checkbox" checked={threeIndicators} onChange={(e) => setThree(e.target.checked)} /><span className="note">energia + EXP + seria (EXP rośnie z wypitą wodą)</span></div>
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
