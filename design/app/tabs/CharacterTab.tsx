import { useState } from "react";
import { BASE_ENERGY_SHARE, DEFAULT_PROFILE, PET_STATES, computeEnergy, derivePetState, sleepWindow, waterGoalMl, type PetState } from "@tamadoist/core";
import {
  EnergyIndicator, TasksIndicator, StreakIndicator, IndicatorsProvider, IndicatorRail, IndicatorBar, IndicatorDial, Egg, EnergyExplainScreen, EnergyIndicatorScreen, LoginScreen, NameScreen, NameTag, Pet, PetScale, RenameDialogScreen,
  SAMPLE, SettingsScreen, SleepScreen, WeightScreen, energyRange, TimePicker,
} from "@tamadoist/ui";
import { Gallery, Section, Spec, SpecGrid } from "../chrome";
import { dateAt, fmt } from "../world";

const RULES: Record<PetState, string> = {
  sleeping: "W oknie snu. Ma najwyższy priorytet, ale wodę można pić także we śnie.",
  tired: "Energia spadła do 0%. Akcja Zadbaj jest podświetlona.",
  drinking: "Krótko po dodaniu szklanki wody.",
  happy: "Dzieje się coś dobrego, np. lunch w kuchni.",
  awake: "Stan domyślny, gdy nic z powyższych nie zachodzi.",
};

export function CharacterTab() {
  const [weight, setWeight] = useState(70);
  const [bed, setBed] = useState(DEFAULT_PROFILE.sleepStart);
  const [pct, setPct] = useState(62);
  const [drunk, setDrunk] = useState(0);
  const [clock, setClock] = useState(480);
  const goal = waterGoalMl(weight);
  const sw = sleepWindow(bed);
  const e = computeEnergy({ now: dateAt(clock), sleepStart: bed, drunkMl: drunk, goalMl: goal });
  const d = SAMPLE;
  return (
    <>
      <Section title="Profil postaci" lead="To, co użytkownik mówi o swojej postaci. Każda cecha to pole w CharacterProfile.">
        <SpecGrid>
          <Spec title="Imię" note="1–20 znaków, wyświetlane nad postacią. Zmiana: Ustawienia, wiersz z ikoną edycji."><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><NameTag name="Tama" /><Pet size={120} /></div></Spec>
          <Spec title="Godziny snu" note="Sen zawsze trwa 8 godzin. Wybierasz tylko porę zaśnięcia, domyślnie 22:00 → 06:00.">
            <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12 }}>
              <TimePicker label="Godzina zaśnięcia" value={bed} onChange={setBed} />
              <div className="readout"><b>{sw.start} → {sw.end}</b><span>8 godzin snu</span></div>
            </div>
          </Spec>
          <Spec title="Waga i cel wody" note="Cel dzienny to waga × 35 ml, zaokrąglony do 50 ml, w zakresie 1500–4000 ml. To praktyczny szacunek, nie zalecenie medyczne.">
            <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12 }}>
              <label className="fld"><span>Waga (kg)</span><input type="number" value={weight} onChange={(ev) => setWeight(Number(ev.target.value) || 0)} /></label>
              <div className="readout"><b>{goal} ml</b><span>cel dzienny</span></div>
            </div>
          </Spec>
        </SpecGrid>
      </Section>

      <Section title="Energia i stany" lead="Energia zależy od snu i wody. Stan postaci wynika z energii i z tego, co się właśnie wydarzyło.">
        <SpecGrid>
          <Spec title="Kalkulator energii" note={`Bez wody energia starcza na ${BASE_ENERGY_SHARE * 100}% dnia aktywnego (16 h). Pełny cel wody daje 100%. Sen ładuje pasek stopniowo: od poziomu z chwili zaśnięcia (zwykle 0%) do 100% w chwili pobudki.`}>
            <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 12 }}>
              <label className="fld"><span>Godzina: {fmt(clock)}</span><input type="range" min={0} max={1435} step={5} value={clock} onChange={(ev) => setClock(+ev.target.value)} /></label>
              <label className="fld"><span>Wypita woda: {drunk} / {goal} ml</span><input type="range" min={0} max={goal} step={250} value={drunk} onChange={(ev) => setDrunk(+ev.target.value)} /></label>
              <div className="readout"><b>{e.percent}%</b><span>{e.state === "sleeping" ? "śpi, energia się ładuje" : `energii starczy do ${e.energyUntil}`}</span></div>
              <div style={{ alignSelf: "center" }}><EnergyIndicator percent={e.percent} /></div>
            </div>
          </Spec>
          <Spec title="Stany postaci" note="Priorytet od góry: sleeping, tired, drinking, happy, awake." stage="sky">
            <div className="states">{PET_STATES.map((s) => <div key={s}><Pet state={s} size={96} /><b>{s}</b><span>{RULES[s]}</span></div>)}</div>
          </Spec>
          <Spec title="Wskaźnik energii" note="Okrągły pierścień z piorunem. Pierścień wypełnia się proporcjonalnie, a kolor zmienia się: 1–24% czerwony, 25–49% żółty, od 50% zielony. Liczba w rogu to procent." stage="sky">
            <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
              <EnergyIndicator percent={pct} onClick={() => undefined} />
              <input type="range" min={0} max={100} value={pct} onChange={(ev) => setPct(+ev.target.value)} aria-label="Energia" style={{ width: "100%" }} />
              <code className="mono">zakres {energyRange(pct)}</code>
            </div>
          </Spec>
          <Spec title="Reguła stanu" note="derivePetState w packages/core/src/character/state.ts.">
            <table className="tbl"><tbody>
              <tr><th>śpi (nawet po wodzie)</th><td>→ {derivePetState({ energy: { state: "sleeping" }, justDrank: true })}</td></tr>
              <tr><th>zmęczony (nawet po wodzie)</th><td>→ {derivePetState({ energy: { state: "tired" }, justDrank: true })}</td></tr>
              <tr><th>aktywny + świeżo po wodzie</th><td>→ {derivePetState({ energy: { state: "awake" }, justDrank: true })}</td></tr>
              <tr><th>aktywny + radość</th><td>→ {derivePetState({ energy: { state: "awake" }, celebrating: true })}</td></tr>
              <tr><th>aktywny</th><td>→ {derivePetState({ energy: { state: "awake" } })}</td></tr>
            </tbody></table>
          </Spec>
          <Spec title="Jajko" note="Postać zaczyna jako jajko, zanim nadasz jej imię." stage="sky"><div className="float"><Egg size={190} /></div></Spec>
          <Spec title="Waga na wadze" note="Podczas wpisywania wagi postać stoi na wadze." stage="sky"><PetScale weightKg={weight} /></Spec>
        </SpecGrid>
      </Section>

      <Section title="Wskaźniki (HUD)" lead="Okrągłe wskaźniki stoją w pionie przy prawej krawędzi, pod paskiem tytułu: biała obwódka z szarą krawędzią 3D, pierścień postępu i symbol w środku. Na razie działa energia, a zadania i seria są zaproponowane na później.">
        <SpecGrid>
          <Spec title="Na razie: sama energia" stage="sky">
            <div className="railwrap"><IndicatorRail energyPercent={62} onEnergy={() => undefined} /></div>
          </Spec>
          <Spec title="Docelowo: trzy wskaźniki" note="Trzy w pionie zajmują ok. 170 px przy krawędzi i nie dotykają środka sceny." stage="sky">
            <IndicatorsProvider value={{ tasks: { done: 6, total: 10 }, streak: { days: 12, progress: 0.7 } }}>
              <div className="railwrap" style={{ height: 210 }}><IndicatorRail energyPercent={62} onEnergy={() => undefined} /></div>
            </IndicatorsProvider>
          </Spec>
          <Spec title="Wariant okrągły: jeden chip, trzy kropki" note="Kropki w pionie po prawej stronie chipa przełączają energię / zadania / serię; kolor aktywnej kropki = kolor wskaźnika. Dotknięcie chipa też przełącza na następny wskaźnik." stage="sky">
            <div style={{ padding: "18px 40px 24px" }}><IndicatorDial energyPercent={62} /></div>
          </Spec>
          <Spec title="Wariant poziomy: jedna kapsuła" note="Wszystkie trzy w jednym komponencie na linii hamburgera; liczba obok pierścienia zamiast plakietki." stage="sky">
            <IndicatorBar energyPercent={62} onEnergy={() => undefined} />
          </Spec>
          <Spec title="Propozycje na kolejne dwa" note="Każdy wskaźnik ma pierścień (postęp), symbol i liczbę w rogu." stage="sky col">
            <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
              <EnergyIndicator percent={62} /><TasksIndicator done={6} total={10} /><StreakIndicator days={12} progress={0.7} />
            </div>
            <table className="tbl"><tbody>
              <tr><th>⚡ Energia</th><td>pierścień = energia teraz, liczba = procent</td></tr>
              <tr><th>✓ Zadania</th><td>pierścień = odsetek zrobionych zadań na dziś, liczba = zrobione/wszystkie (np. 3/10)</td></tr>
              <tr><th>🔥 Seria</th><td>pierścień = dzisiejszy postęp celów dnia, liczba = dni z rzędu. Zachęca do codziennego powrotu</td></tr>
            </tbody></table>
            <p className="note">Inne pomysły na trzeci wskaźnik: monety do wydania w sklepie (ubranka, nowe sceny) albo nastrój postaci.</p>
          </Spec>
        </SpecGrid>
      </Section>

      <Section title="Ekrany postaci" lead="Onboarding w pięciu krokach i ustawienia.">
        <Gallery items={[
          { title: "Login", note: "Jajko w krajobrazie, wejście przez Google.", node: <LoginScreen /> },
          { title: "Imię", node: <NameScreen name={d.name} /> },
          { title: "Energia", node: <EnergyExplainScreen name={d.name} /> },
          { title: "Wskaźnik", node: <EnergyIndicatorScreen name={d.name} energyPercent={d.energyPercent} /> },
          { title: "Sen", node: <SleepScreen name={d.name} sleepStart={d.sleepStart} sleepEnd={d.sleepEnd} /> },
          { title: "Waga", node: <WeightScreen name={d.name} weightKg={d.weightKg} goalMl={d.goalMl} /> },
          { title: "Ustawienia", note: "Imię z ikoną edycji po prawej.", node: <SettingsScreen {...d} /> },
          { title: "Zmiana imienia", node: <RenameDialogScreen {...d} /> },
        ]} />
      </Section>
    </>
  );
}
