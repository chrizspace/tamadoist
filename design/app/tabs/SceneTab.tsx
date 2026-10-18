import { useState } from "react";
import { LOCATIONS, LOCATION_GROUPS, PERIODS, getGroup, locationsOf, resolveScene, type LocationId, type PeriodId } from "@tamadoist/core";
import {
  LocationPermissionScreen, PlacesScreen, SAMPLE, Scene, SceneCard, ScenePickerScreen, SchedulePromptScreen, ScheduleScreen,
} from "@tamadoist/ui";
import { Gallery, PhoneThumb, Section, Spec, SpecGrid } from "../chrome";
import { PLACES, SCHEDULE } from "../modules/scene";
import { dateAt, fmt } from "../world";

const Frame = ({ location, period, scale = 0.42 }: { location: LocationId; period: PeriodId; scale?: number }) => (
  <div className="frame" style={{ width: 390 * scale, height: 844 * scale }}>
    <div style={{ width: 390, height: 844, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative" }}><Scene location={location} period={period} /></div>
  </div>
);

export function SceneTab() {
  const [loc, setLoc] = useState<LocationId>("home.office");
  const [period, setPeriod] = useState<PeriodId>("noon");
  const [clock, setClock] = useState(780);
  const [pos, setPos] = useState("none");
  const [manual, setManual] = useState("");
  const place = PLACES.find((p) => p.id === pos);
  const r = resolveScene({
    now: dateAt(clock), schedule: SCHEDULE, places: PLACES, position: place && { lat: place.lat, lng: place.lng },
    manual: manual ? { location: manual as LocationId } : undefined, sleepStart: "22:00",
  });
  const d = SAMPLE;
  return (
    <>
      <Section title="Pory dnia" lead="Pora dnia zmienia światło w każdej scenie. Wieczorem i w nocy zapalają się lampy i światła sufitowe, a za oknem robi się ciemno.">
        <div className="ctl pick"><label htmlFor="t-loc">Pokaż w scenie</label>
          <select id="t-loc" value={loc} onChange={(e) => setLoc(e.target.value as LocationId)}>{LOCATIONS.map((l) => <option key={l.id} value={l.id}>{getGroup(l.group).label} · {l.label}</option>)}</select></div>
        <div className="periods">
          {PERIODS.map((p) => (
            <div key={p.id} className="period">
              <Frame location={loc} period={p.id} />
              <b>{p.label}</b>
              <span className="mono">{p.start}–{p.end}</span>
              <span className="note">{p.artificialLight ? "światło włączone" : `światło dzienne ${Math.round(p.daylight * 100)}%`}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Lokalizacje" lead="Trzy grupy z pomieszczeniami. Wybierz porę dnia, żeby zobaczyć je w innym świetle.">
        <div className="ctl pick"><label htmlFor="t-per">Pora dnia</label>
          <select id="t-per" value={period} onChange={(e) => setPeriod(e.target.value as PeriodId)}>{PERIODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div>
        {LOCATION_GROUPS.map((g) => (
          <div key={g.id}>
            <div className="group">{g.label}</div>
            <div className="periods">
              {locationsOf(g.id).map((l) => (
                <div key={l.id} className="period"><Frame location={l.id} period={period} scale={0.46} /><b>{l.label}</b><span className="note">{l.hint}</span><span className="mono">{l.id}</span></div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Wybór sceny" lead="Lokalizację wybiera pierwsza pasująca reguła. Porę dnia wyznacza zegar i nie wpływa na wybór.">
        <SpecGrid>
          <Spec title="Priorytet reguł" note="resolveScene w packages/core/src/scene/resolve.ts.">
            <ol className="prio">
              <li><b>Ręczny wybór</b> — trzyma się do włączenia trybu automatycznego.</li>
              <li><b>Sen</b> — w oknie snu postać śpi w sypialni.</li>
              <li><b>Plan dnia</b> — krótszy blok wygrywa z dłuższym, więc lunch przebija pracę.</li>
              <li><b>Miejsce</b> — najbliższe zapisane miejsce w jego promieniu.</li>
              <li><b>Domyślnie</b> — park.</li>
            </ol>
            <p className="note">Pora dnia jest niezależna: w kuchni o 22:00 zobaczysz tę samą kuchnię, tylko z zapalonym światłem.</p>
          </Spec>
          <Spec title="Sprawdź na żywo" note="Zmień godzinę, lokalizację albo wybierz scenę ręcznie." stage="col">
            <label className="fld"><span>Godzina: {fmt(clock)} (środa)</span><input type="range" min={0} max={1435} step={5} value={clock} onChange={(e) => setClock(+e.target.value)} /></label>
            <label className="fld"><span>Lokalizacja</span><select value={pos} onChange={(e) => setPos(e.target.value)}><option value="none">Nieznane miejsce</option>{PLACES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
            <label className="fld"><span>Ręcznie</span><select value={manual} onChange={(e) => setManual(e.target.value)}><option value="">(automatycznie)</option>{LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}</select></label>
            <div className="resolved"><Frame location={r.location} period={r.period.id} scale={0.3} /><div><b>{r.label}</b><div className="note">{getGroup(r.group).label} · {r.period.label}</div><div className="mono">źródło: {r.source}</div></div></div>
          </Spec>
          <Spec title="Karta sceny" note="Miniatura w oknie wyboru sceny." stage="col">
            <div style={{ display: "flex", gap: 10, width: 300 }}><SceneCard location="home.bedroom" period="night" selected /><SceneCard location="recreation.pool" period="afternoon" /></div>
          </Spec>
        </SpecGrid>
      </Section>

      <Section title="Ekrany sceny" lead="Wybór sceny, miejsca, zgoda na lokalizację, plan dnia i pytanie o plan.">
        <Gallery items={[
          { title: "Wybór sceny", note: "Dotknij tytułu lokacji.", node: <ScenePickerScreen name={d.name} energyPercent={d.energyPercent} /> },
          { title: "Miejsca", node: <PlacesScreen energyPercent={d.energyPercent} /> },
          { title: "Zgoda na lokalizację", node: <LocationPermissionScreen name={d.name} /> },
          { title: "Plan dnia", node: <ScheduleScreen energyPercent={d.energyPercent} /> },
          { title: "Pytanie o plan", node: <SchedulePromptScreen name={d.name} energyPercent={d.energyPercent} /> },
        ]} />
      </Section>
    </>
  );
}
export { PhoneThumb };
