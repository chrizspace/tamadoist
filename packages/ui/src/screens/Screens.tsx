import type { ReactNode } from "react";
import { ActionButton } from "../components/ActionButton";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Dialog } from "../components/Dialog";
import { EnergyBar } from "../components/EnergyBar";
import { Egg } from "../components/Egg";
import { HeaderBar } from "../components/HeaderBar";
import { Input } from "../components/Input";
import { MenuPanel } from "../components/MenuPanel";
import { NameTag } from "../components/NameTag";
import { Pet, type PetState } from "../components/Pet";
import { PetScale } from "../components/PetScale";
import { ProgressDots } from "../components/ProgressDots";
import { RoundButton } from "../components/RoundButton";
import { Scene, type SceneKind } from "../components/Scene";
import { AddCard, ListCard, MapArt, SCENE_NAMES, SceneCard, ScenePill, Switch } from "../components/Places";
import { Sheet } from "../components/Sheet";
import { TimeCard } from "../components/TimeCard";
import { Toast } from "../components/Toast";
import { TimePicker } from "../components/TimePicker";
import { WaterCounter } from "../components/WaterCounter";

export interface ScreenData {
  name: string;
  sleepStart: string;
  sleepEnd: string;
  weightKg: number;
  goalMl: number;
  drunkMl: number;
  energyPercent: number;
  energyUntil: string;
}

export const SAMPLE: ScreenData = {
  name: "Tama", sleepStart: "22:00", sleepEnd: "06:00", weightKg: 70, goalMl: 2450, drunkMl: 1700, energyPercent: 84, energyUntil: "18:34",
};

/** 390x844 phone canvas: scene behind, content layer on top. */
export function Phone({ night, scene, children }: { night?: boolean; scene?: SceneKind; children: ReactNode }) {
  return (
    <div className="td-phone">
      <Scene scene={scene} night={night} />
      <div className="td-layer">{children}</div>
    </div>
  );
}

const Hero = ({ top, name, children, float = true }: { top: number; name: string; children: ReactNode; float?: boolean }) => (
  <div className="td-hero" style={{ top }}>
    <NameTag name={name} />
    <div className={float ? "td-float" : undefined}>{children}</div>
  </div>
);

export function LoginScreen() {
  return (
    <Phone>
      <div className="td-title-lg" style={{ top: 92 }}>Tamadoist</div>
      <div className="td-sub" style={{ top: 150 }}>Wykluj postać z jajka! Dbaj o nawyki, a ona będzie rosła.</div>
      <div className="td-hero td-float" style={{ top: 300 }}><Egg size={260} /></div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 96, zIndex: 3 }}><Button variant="secondary">Kontynuuj z Google</Button></div>
      <div className="td-caption" style={{ bottom: 56, fontSize: 13 }}>Logując się akceptujesz regulamin</div>
    </Phone>
  );
}

export function NameScreen({ name = "Tama" }: Pick<ScreenData, "name">) {
  return (
    <Phone>
      <Hero top={120} name={name}><Egg size={250} /></Hero>
      <Sheet>
        <ProgressDots total={5} current={1} />
        <h3>Jak masz na imię?</h3>
        <p>Nadaj imię swojej postaci. Możesz je później zmienić.</p>
        <Input label="Imię postaci" placeholder="np. Tama" defaultValue={name} />
        <Button>Dalej</Button>
      </Sheet>
    </Phone>
  );
}

export function EnergyExplainScreen({ name }: Pick<ScreenData, "name">) {
  return (
    <Phone>
      <Hero top={150} name={name}><Pet size={230} /></Hero>
      <Sheet>
        <ProgressDots total={5} current={2} />
        <h3>Energia = sen + woda</h3>
        <p>Bazowo energii starcza na 30% dnia. Każda szklanka wody wydłuża pasek, aż do 100% przy wypiciu całego celu.</p>
        <EnergyBar percent={30} />
        <Button>Rozumiem</Button>
      </Sheet>
    </Phone>
  );
}

export function EnergyIndicatorScreen({ name, energyPercent }: Pick<ScreenData, "name" | "energyPercent">) {
  return (
    <Phone>
      <HeaderBar left="none" percent={energyPercent} />
      <div className="td-ring" style={{ right: 6, top: 52, width: 158, height: 56 }} />
      <Hero top={150} name={name}><Pet size={230} /></Hero>
      <Sheet>
        <ProgressDots total={5} current={2} />
        <h3>To Twoja energia</h3>
        <p>Wskaźnik w prawym górnym rogu pokazuje, ile energii ma Twoja postać. Pije wodę i śpi, a bateria się ładuje.</p>
        <Button>Dalej</Button>
      </Sheet>
    </Phone>
  );
}

export function SleepScreen({ name, sleepStart, sleepEnd }: Pick<ScreenData, "name" | "sleepStart" | "sleepEnd">) {
  return (
    <Phone night>
      <Hero top={110} name={name}><Pet state="sleeping" size={220} /></Hero>
      <Sheet>
        <ProgressDots total={5} current={3} />
        <h3>Kiedy chodzisz spać?</h3>
        <p>Sen zawsze trwa 8 godzin. Wybierz godzinę zaśnięcia.</p>
        <TimeCard start={sleepStart} end={sleepEnd} />
        <TimePicker label="Godzina zaśnięcia" value={sleepStart} onChange={() => undefined} />
        <Button>Dalej</Button>
      </Sheet>
    </Phone>
  );
}

export function WeightScreen({ name, weightKg, goalMl }: Pick<ScreenData, "name" | "weightKg" | "goalMl">) {
  return (
    <Phone>
      <div className="td-hero" style={{ top: 70 }}><NameTag name={name} /></div>
      <div style={{ position: "absolute", left: 75, top: 130, zIndex: 2 }}><PetScale weightKg={weightKg} /></div>
      <Sheet>
        <ProgressDots total={5} current={4} />
        <h3>Ile ważysz?</h3>
        <p>Postać stanęła na wadze! Cel wody to waga × 35 ml.</p>
        <Input label="Waga (kg)" type="number" defaultValue={weightKg} />
        <div style={{ textAlign: "center", font: "800 18px var(--font)", color: "var(--color-water-dark)" }}>Twój cel: {goalMl} ml wody dziennie</div>
        <Button>Zaczynamy!</Button>
      </Sheet>
    </Phone>
  );
}

export interface HomeProps extends Pick<ScreenData, "name" | "energyPercent" | "energyUntil" | "sleepEnd"> {
  state?: Extract<PetState, "awake" | "tired" | "sleeping" | "happy">;
  toast?: string;
  scene?: SceneKind;
}

export function HomeScreen({ name, energyPercent, energyUntil, sleepEnd, state = "awake", toast, scene = "meadow" }: HomeProps) {
  const night = state === "sleeping";
  const caption = night ? `${name} śpi do ${sleepEnd}. Dobranoc!` : state === "tired" ? "Brak energii – napij się wody!" : `Energii starczy do ${energyUntil}`;
  return (
    <Phone night={night} scene={scene}>
      <HeaderBar left="menu" title={SCENE_NAMES[scene]} percent={energyPercent} onTitle={() => undefined} />
      <Hero top={165} name={name}><Pet state={state} size={270} /></Hero>
      <div className="td-caption" style={{ top: 600 }}>{caption}</div>
      <div className="td-actionbar"><ActionButton active={state === "tired"} disabled={night} /></div>
      {toast && <Toast>{toast}</Toast>}
    </Phone>
  );
}

export function MenuScreen({ name, energyPercent }: Pick<ScreenData, "name" | "energyPercent">) {
  return (
    <Phone>
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <div className="td-actionbar"><ActionButton /></div>
      <div className="td-scrim" />
      <HeaderBar left="close" title="Menu" percent={energyPercent} />
      <MenuPanel />
    </Phone>
  );
}

export function WaterScreen({ name, drunkMl, goalMl, energyPercent, drinking }: Pick<ScreenData, "name" | "drunkMl" | "goalMl" | "energyPercent"> & { drinking?: boolean }) {
  const pct = Math.round(Math.min(1, drunkMl / goalMl) * 100);
  return (
    <Phone>
      <HeaderBar left="menu-back" title="Woda" percent={energyPercent} />
      <Hero top={130} name={name} float={false}><Pet state={drinking ? "drinking" : "awake"} size={230} /></Hero>
      <WaterCounter drunkMl={drunkMl} goalMl={goalMl} />
      <div className="td-panelw" style={{ top: 560 }}><EnergyBar percent={pct} label="Woda" /></div>
      <div className="td-actionbar" style={{ bottom: 56, gap: 70 }}>
        <RoundButton kind="minus" /><RoundButton kind="plus" />
      </div>
    </Phone>
  );
}

export function RenameDialogScreen({ name, energyPercent }: Pick<ScreenData, "name" | "energyPercent">) {
  return (
    <Phone>
      <HeaderBar left="menu" percent={energyPercent} />
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <div className="td-scrim" />
      <Dialog title="Zmień imię" description="Jak ma się teraz nazywać Twoja postać?" actions={<><Button variant="secondary">Anuluj</Button><Button>Zapisz</Button></>}>
        <Input label="Imię postaci" defaultValue={name} />
      </Dialog>
    </Phone>
  );
}

export function SettingsScreen({ name, sleepStart, sleepEnd, weightKg, goalMl, energyPercent }: ScreenData) {
  const rows: [string, string][] = [["Imię postaci", name], ["Godzina snu", `${sleepStart} → ${sleepEnd}`], ["Waga", `${weightKg} kg`], ["Cel wody", `${goalMl} ml`]];
  return (
    <Phone>
      <HeaderBar left="menu-back" title="Ustawienia" percent={energyPercent} />
      <div style={{ position: "absolute", left: 24, right: 24, top: 140, display: "flex", flexDirection: "column", gap: 12, zIndex: 2 }}>
        {rows.map(([a, b]) => <Card key={a} title={b}>{a}</Card>)}
      </div>
    </Phone>
  );
}

export function ScenePickerScreen({ name, energyPercent, scene = "office" }: Pick<ScreenData, "name" | "energyPercent"> & { scene?: SceneKind }) {
  const all: SceneKind[] = ["meadow", "home", "office", "lunch"];
  return (
    <Phone scene={scene}>
      <HeaderBar left="menu" title={SCENE_NAMES[scene]} percent={energyPercent} onTitle={() => undefined} />
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <div className="td-scrim" />
      <Sheet>
        <h3>Wybierz scenę</h3>
        <Switch label="Automatycznie (miejsce i plan dnia)" checked={false} />
        <div className="td-scenegrid">{all.map((k) => <SceneCard key={k} scene={k} selected={k === scene} />)}</div>
        <p className="td-note">Wybrana ręcznie scena zostaje do końca dnia albo do włączenia trybu automatycznego.</p>
      </Sheet>
    </Phone>
  );
}

export function PlacesScreen({ energyPercent }: Pick<ScreenData, "energyPercent">) {
  return (
    <Phone>
      <HeaderBar left="menu-back" title="Miejsca" percent={energyPercent} />
      <div className="td-page">
        <MapArt />
        <ListCard icon="pin" title="Dom" sub="52.2297, 21.0122 · promień 100 m" right={<ScenePill scene="home" />} />
        <ListCard icon="pin" title="Praca" sub="52.2400, 21.0300 · promień 150 m" right={<ScenePill scene="office" />} />
        <AddCard label="Dodaj miejsce" />
        <Button variant="water">Użyj bieżącej lokalizacji</Button>
        <p className="td-note">Lokalizację porównujemy z Twoimi miejscami na urządzeniu. Nie zapisujemy trasy.</p>
      </div>
    </Phone>
  );
}

export function LocationPermissionScreen({ name }: Pick<ScreenData, "name">) {
  return (
    <Phone>
      <Hero top={100} name={name}><Pet state="happy" size={200} /></Hero>
      <Sheet>
        <h3>Gdzie jesteś?</h3>
        <p>Dzięki lokalizacji pokażę scenę domu, biura lub innego miejsca, które zapiszesz.</p>
        <MapArt />
        <p className="td-note">Używamy tylko ostatniej pozycji, żeby rozpoznać Twoje miejsca. Możesz to wyłączyć w każdej chwili i zmieniać sceny ręcznie.</p>
        <Button>Zezwól na lokalizację</Button>
        <Button variant="secondary">Nie teraz</Button>
      </Sheet>
    </Phone>
  );
}

export function ScheduleScreen({ energyPercent }: Pick<ScreenData, "energyPercent">) {
  return (
    <Phone>
      <HeaderBar left="menu-back" title="Plan dnia" percent={energyPercent} />
      <div className="td-page">
        <h2>Bloki dnia</h2>
        <ListCard icon="clock" title="Praca" sub="09:00 – 17:00 · pon–pt" right={<ScenePill scene="office" />} />
        <ListCard icon="clock" title="Lunch" sub="12:30 – 13:00 · pon–pt" right={<ScenePill scene="lunch" />} />
        <AddCard label="Dodaj blok" />
        <p className="td-note">Krótszy blok wygrywa z dłuższym, więc w czasie lunchu zobaczysz kuchnię, a nie biuro. Poza blokami scenę wybiera Twoja lokalizacja.</p>
      </div>
    </Phone>
  );
}

export function SchedulePromptScreen({ name, energyPercent }: Pick<ScreenData, "name" | "energyPercent">) {
  return (
    <Phone scene="office">
      <HeaderBar left="menu" title="Biuro" percent={energyPercent} onTitle={() => undefined} />
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <div className="td-scrim" />
      <Dialog title="Zaczynasz pracę o 9:00?" description="Kończysz o 17:00? Pokażę wtedy scenę biura, a w czasie lunchu scenę z kuchnią." actions={<><Button variant="secondary">Zmień</Button><Button>Tak, ustaw</Button></>} />
    </Phone>
  );
}
