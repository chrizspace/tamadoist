import type { ReactNode } from "react";
import { getGroup, getLocation, LOCATION_GROUPS, locationsOf, type LocationId, type PeriodId } from "@tamadoist/core";
import type { PetState } from "../character/Pet";
import { ActionBar } from "../actions/ActionBar";
import { RoundButton } from "../actions/RoundButton";
import { WaterCounter } from "../actions/WaterCounter";
import { Egg } from "../character/Egg";
import { EnergyBar } from "../character/EnergyBar";
import { NameTag } from "../character/NameTag";
import { Pet } from "../character/Pet";
import { PetScale } from "../character/PetScale";
import { Button } from "../components/Button";
import { Dialog } from "../components/Dialog";
import { HeaderBar } from "../components/HeaderBar";
import { Input } from "../components/Input";
import { MenuPanel } from "../components/MenuPanel";
import { AddCard, ListCard, MapArt, SettingRow, Switch } from "../components/Places";
import { ProgressDots } from "../components/ProgressDots";
import { Sheet } from "../components/Sheet";
import { TimeCard } from "../components/TimeCard";
import { TimePicker } from "../components/TimePicker";
import { Toast } from "../components/Toast";
import { Scene } from "../scene/Scene";
import { LocationPill, SceneCard } from "../scene/SceneCard";

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

export interface SceneProps { location?: LocationId; period?: PeriodId }

/** 390x844 phone canvas: scene behind, content layer on top. */
export function Phone({ location, period, children }: SceneProps & { children: ReactNode }) {
  return (
    <div className="td-phone">
      <Scene location={location} period={period} />
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

const LOC_PARK: SceneProps = { location: "recreation.park", period: "noon" };

/* ---------------- Character: onboarding ---------------- */

export function LoginScreen() {
  return (
    <Phone {...LOC_PARK}>
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
    <Phone {...LOC_PARK}>
      <Hero top={120} name={name}><Egg size={250} /></Hero>
      <Sheet>
        <ProgressDots total={5} current={1} />
        <h3>Jak masz na imię?</h3>
        <p>Nadaj imię swojej postaci. Możesz je później zmienić w ustawieniach.</p>
        <Input label="Imię postaci" placeholder="np. Tama" defaultValue={name} />
        <Button>Dalej</Button>
      </Sheet>
    </Phone>
  );
}

export function EnergyExplainScreen({ name }: Pick<ScreenData, "name">) {
  return (
    <Phone {...LOC_PARK}>
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
    <Phone {...LOC_PARK}>
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
    <Phone location="home.bedroom" period="night">
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
    <Phone {...LOC_PARK}>
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

/* ---------------- Home ---------------- */

export interface HomeProps extends SceneProps, Pick<ScreenData, "name" | "energyPercent" | "energyUntil" | "sleepEnd"> {
  state?: PetState;
  toast?: string;
}

export function HomeScreen({ name, energyPercent, energyUntil, sleepEnd, state = "awake", toast, location = "recreation.park", period = "noon" }: HomeProps) {
  const sleeping = state === "sleeping";
  const tired = state === "tired";
  const caption = sleeping ? `${name} śpi do ${sleepEnd}. Dobranoc!` : tired ? "Brak energii – napij się wody!" : `Energii starczy do ${energyUntil}`;
  return (
    <Phone location={location} period={period}>
      <HeaderBar left="menu" title={getLocation(location).label} percent={energyPercent} onTitle={() => undefined} />
      <Hero top={165} name={name}><Pet state={state} size={270} /></Hero>
      <div className="td-caption" style={{ top: 600 }}>{caption}</div>
      <ActionBar context={{ sleeping, tired }} />
      {toast && <Toast>{toast}</Toast>}
    </Phone>
  );
}

export function MenuScreen({ name, energyPercent }: Pick<ScreenData, "name" | "energyPercent">) {
  return (
    <Phone {...LOC_PARK}>
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <ActionBar context={{ sleeping: false, tired: false }} />
      <div className="td-scrim" />
      <HeaderBar left="close" title="Menu" percent={energyPercent} />
      <MenuPanel />
    </Phone>
  );
}

/* ---------------- Actions: water ---------------- */

export function WaterScreen({ name, drunkMl, goalMl, energyPercent, drinking, location = "recreation.park", period = "noon" }: Pick<ScreenData, "name" | "drunkMl" | "goalMl" | "energyPercent"> & SceneProps & { drinking?: boolean }) {
  const pct = Math.round(Math.min(1, drunkMl / goalMl) * 100);
  return (
    <Phone location={location} period={period}>
      <HeaderBar left="back" title="Woda" percent={energyPercent} />
      <Hero top={130} name={name} float={false}><Pet state={drinking ? "drinking" : "awake"} size={230} /></Hero>
      <WaterCounter drunkMl={drunkMl} goalMl={goalMl} />
      <div className="td-panelw" style={{ top: 560 }}><EnergyBar percent={pct} label="Woda" /></div>
      <div className="td-actionbar" style={{ bottom: 56, gap: 70 }}>
        <RoundButton kind="minus" /><RoundButton kind="plus" />
      </div>
    </Phone>
  );
}

/* ---------------- Character: settings ---------------- */

function SettingsRows({ name, sleepStart, sleepEnd, weightKg, goalMl }: ScreenData) {
  return (
    <div className="td-page">
      <SettingRow label="Imię postaci" value={name} onEdit={() => undefined} />
      <SettingRow label="Godzina snu" value={`${sleepStart} → ${sleepEnd}`} />
      <SettingRow label="Waga" value={`${weightKg} kg`} />
      <SettingRow label="Cel wody" value={`${goalMl} ml`} />
    </div>
  );
}

export function SettingsScreen(d: ScreenData) {
  return (
    <Phone {...LOC_PARK}>
      <HeaderBar left="back" title="Ustawienia" percent={d.energyPercent} />
      <SettingsRows {...d} />
    </Phone>
  );
}

export function RenameDialogScreen(d: ScreenData) {
  return (
    <Phone {...LOC_PARK}>
      <HeaderBar left="back" title="Ustawienia" percent={d.energyPercent} />
      <SettingsRows {...d} />
      <div className="td-scrim" />
      <Dialog title="Zmień imię" description="Jak ma się teraz nazywać Twoja postać?" actions={<><Button variant="secondary">Anuluj</Button><Button>Zapisz</Button></>}>
        <Input label="Imię postaci" defaultValue={d.name} />
      </Dialog>
    </Phone>
  );
}

/* ---------------- Scene: picker, places, schedule ---------------- */

export function ScenePickerScreen({ name, energyPercent, location = "work.openspace", period = "noon", auto = false }: Pick<ScreenData, "name" | "energyPercent"> & SceneProps & { auto?: boolean }) {
  return (
    <Phone location={location} period={period}>
      <HeaderBar left="menu" title={getLocation(location).label} percent={energyPercent} onTitle={() => undefined} />
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <div className="td-scrim" />
      <Sheet>
        <h3>Wybierz scenę</h3>
        <Switch label="Automatycznie (miejsce i plan dnia)" checked={auto} />
        {LOCATION_GROUPS.map((g) => (
          <div key={g.id}>
            <div className="td-grouphead">{g.label}</div>
            <div className="td-scenegrid3">
              {locationsOf(g.id).map((l) => <SceneCard key={l.id} location={l.id} period={period} compact selected={l.id === location} />)}
            </div>
          </div>
        ))}
      </Sheet>
    </Phone>
  );
}

export function PlacesScreen({ energyPercent }: Pick<ScreenData, "energyPercent">) {
  return (
    <Phone {...LOC_PARK}>
      <HeaderBar left="back" title="Miejsca" percent={energyPercent} />
      <div className="td-page">
        <MapArt />
        <ListCard icon="pin" title="Dom" sub="52.2297, 21.0122 · promień 100 m" right={<LocationPill location="home.office" />} />
        <ListCard icon="pin" title="Praca" sub="52.2400, 21.0300 · promień 150 m" right={<LocationPill location="work.openspace" />} />
        <AddCard label="Dodaj miejsce" />
        <Button variant="water">Użyj bieżącej lokalizacji</Button>
        <p className="td-note">Lokalizację porównujemy z Twoimi miejscami na urządzeniu. Nie zapisujemy trasy.</p>
      </div>
    </Phone>
  );
}

export function LocationPermissionScreen({ name }: Pick<ScreenData, "name">) {
  return (
    <Phone {...LOC_PARK}>
      <Hero top={100} name={name}><Pet state="happy" size={200} /></Hero>
      <Sheet>
        <h3>Gdzie jesteś?</h3>
        <p>Dzięki lokalizacji pokażę scenę domu, pracy lub miejsca rekreacji, które zapiszesz.</p>
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
    <Phone {...LOC_PARK}>
      <HeaderBar left="back" title="Plan dnia" percent={energyPercent} />
      <div className="td-page">
        <h2>Bloki dnia</h2>
        <ListCard icon="clock" title="Praca" sub="09:00 – 17:00 · pon–pt" right={<LocationPill location="work.openspace" />} />
        <ListCard icon="clock" title="Lunch" sub="12:30 – 13:00 · pon–pt" right={<LocationPill location="work.kitchen" />} />
        <AddCard label="Dodaj blok" />
        <p className="td-note">Krótszy blok wygrywa z dłuższym, więc w czasie lunchu zobaczysz kuchnię, a nie open space. Poza blokami scenę wybiera Twoja lokalizacja.</p>
      </div>
    </Phone>
  );
}

export function SchedulePromptScreen({ name, energyPercent }: Pick<ScreenData, "name" | "energyPercent">) {
  return (
    <Phone location="work.openspace" period="noon">
      <HeaderBar left="menu" title={getLocation("work.openspace").label} percent={energyPercent} onTitle={() => undefined} />
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <div className="td-scrim" />
      <Dialog title="Zaczynasz pracę o 9:00?" description="Kończysz o 17:00? Pokażę wtedy open space, a w czasie lunchu kuchnię w pracy." actions={<><Button variant="secondary">Zmień</Button><Button>Tak, ustaw</Button></>} />
    </Phone>
  );
}

export { getGroup };
