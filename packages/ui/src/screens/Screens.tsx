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
import { Scene, type SceneProps } from "../scene/Scene";
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

/** Controlled when a change handler is given (prototype), otherwise a static default value (stories). */
const bindValue = <T extends string | number>(value: T, onChange?: (v: string) => void) =>
  onChange ? { value, onChange: (e: { target: { value: string } }) => onChange(e.target.value) } : { defaultValue: value };

const LOC_PARK: SceneProps = { location: "recreation.park", period: "noon" };

/* ---------------- Character: onboarding ---------------- */

export function LoginScreen({ onGoogle }: { onGoogle?: () => void }) {
  return (
    <Phone {...LOC_PARK}>
      <div className="td-title-lg" style={{ top: 92 }}>Tamadoist</div>
      <div className="td-sub" style={{ top: 150 }}>Wykluj postać z jajka! Dbaj o nawyki, a ona będzie rosła.</div>
      <div className="td-hero td-float" style={{ top: 300 }}><Egg size={260} /></div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 96, zIndex: 3 }}><Button variant="secondary" onClick={onGoogle}>Kontynuuj z Google</Button></div>
      <div className="td-caption" style={{ bottom: 56, fontSize: 13 }}>Logując się akceptujesz regulamin</div>
    </Phone>
  );
}

export function NameScreen({ name = "Tama", onName, onNext, error }: Pick<ScreenData, "name"> & { onName?: (v: string) => void; onNext?: () => void; error?: string }) {
  return (
    <Phone {...LOC_PARK}>
      <Hero top={120} name={name}><Egg size={250} /></Hero>
      <Sheet>
        <ProgressDots total={5} current={1} />
        <h3>Jak masz na imię?</h3>
        <p>Nadaj imię swojej postaci. Możesz je później zmienić w ustawieniach.</p>
        <Input label="Imię postaci" placeholder="np. Tama" error={error} {...bindValue(name, onName)} />
        <Button onClick={onNext} disabled={!!onNext && !name.trim()}>Dalej</Button>
      </Sheet>
    </Phone>
  );
}

export function EnergyExplainScreen({ name, onNext }: Pick<ScreenData, "name"> & { onNext?: () => void }) {
  return (
    <Phone {...LOC_PARK}>
      <Hero top={150} name={name}><Pet size={230} /></Hero>
      <Sheet>
        <ProgressDots total={5} current={2} />
        <h3>Energia = sen + woda</h3>
        <p>Bazowo energii starcza na 30% dnia. Każda szklanka wody wydłuża pasek, aż do 100% przy wypiciu całego celu.</p>
        <EnergyBar percent={30} />
        <Button onClick={onNext}>Rozumiem</Button>
      </Sheet>
    </Phone>
  );
}

export function EnergyIndicatorScreen({ name, energyPercent, onNext }: Pick<ScreenData, "name" | "energyPercent"> & { onNext?: () => void }) {
  return (
    <Phone {...LOC_PARK}>
      <HeaderBar left="none" percent={energyPercent} />
      <div className="td-ring" style={{ right: 6, top: 52, width: 158, height: 56 }} />
      <Hero top={150} name={name}><Pet size={230} /></Hero>
      <Sheet>
        <ProgressDots total={5} current={2} />
        <h3>To Twoja energia</h3>
        <p>Wskaźnik w prawym górnym rogu pokazuje, ile energii ma Twoja postać. Pije wodę i śpi, a pasek się ładuje.</p>
        <Button onClick={onNext}>Dalej</Button>
      </Sheet>
    </Phone>
  );
}

export function SleepScreen({ name, sleepStart, sleepEnd, onSleepStart, onNext }: Pick<ScreenData, "name" | "sleepStart" | "sleepEnd"> & { onSleepStart?: (v: string) => void; onNext?: () => void }) {
  return (
    <Phone location="home.bedroom" period="night">
      <Hero top={110} name={name}><Pet state="sleeping" size={220} /></Hero>
      <Sheet>
        <ProgressDots total={5} current={3} />
        <h3>Kiedy chodzisz spać?</h3>
        <p>Sen zawsze trwa 8 godzin. Wybierz godzinę zaśnięcia.</p>
        <TimeCard start={sleepStart} end={sleepEnd} />
        <TimePicker label="Godzina zaśnięcia" value={sleepStart} onChange={onSleepStart ?? (() => undefined)} />
        <Button onClick={onNext}>Dalej</Button>
      </Sheet>
    </Phone>
  );
}

export function WeightScreen({ name, weightKg, goalMl, onWeight, onNext }: Pick<ScreenData, "name" | "weightKg" | "goalMl"> & { onWeight?: (v: string) => void; onNext?: () => void }) {
  return (
    <Phone {...LOC_PARK}>
      <div className="td-hero" style={{ top: 70 }}><NameTag name={name} /></div>
      <div style={{ position: "absolute", left: 75, top: 130, zIndex: 2 }}><PetScale weightKg={weightKg} /></div>
      <Sheet>
        <ProgressDots total={5} current={4} />
        <h3>Ile ważysz?</h3>
        <p>Postać stanęła na wadze! Cel wody to waga × 35 ml.</p>
        <Input label="Waga (kg)" type="number" {...bindValue(weightKg, onWeight)} />
        <div style={{ textAlign: "center", font: "800 18px var(--font)", color: "var(--color-water-dark)" }}>Twój cel: {goalMl} ml wody dziennie</div>
        <Button onClick={onNext}>Zaczynamy!</Button>
      </Sheet>
    </Phone>
  );
}

/* ---------------- Home ---------------- */

export interface HomeProps extends SceneProps, Pick<ScreenData, "name" | "energyPercent" | "energyUntil" | "sleepEnd"> {
  state?: PetState;
  toast?: string;
  onMenu?: () => void;
  onTitle?: () => void;
  onEnergy?: () => void;
  onAction?: (id: string) => void;
}

export function HomeScreen({ name, energyPercent, energyUntil, sleepEnd, state = "awake", toast, location = "recreation.park", period = "noon", onMenu, onTitle, onEnergy, onAction }: HomeProps) {
  const sleeping = state === "sleeping";
  const tired = state === "tired";
  const caption = sleeping ? `${name} śpi do ${sleepEnd}. Dobranoc!` : tired ? "Brak energii – napij się wody!" : `Energii starczy do ${energyUntil}`;
  return (
    <Phone location={location} period={period}>
      <HeaderBar left="menu" title={getLocation(location).label} percent={energyPercent} onMenu={onMenu} onTitle={onTitle ?? (() => undefined)} onEnergy={onEnergy} />
      <Hero top={165} name={name}><Pet state={state} size={270} /></Hero>
      <div className="td-caption" style={{ top: 600 }}>{caption}</div>
      <ActionBar context={{ sleeping, tired }} onAction={onAction} />
      {toast && <Toast>{toast}</Toast>}
    </Phone>
  );
}

export interface MenuHandlers { onClose?: () => void; onSettings?: () => void; onPlaces?: () => void; onSchedule?: () => void; onLogout?: () => void }

export function MenuScreen({ name, energyPercent, onClose, onSettings, onPlaces, onSchedule, onLogout }: Pick<ScreenData, "name" | "energyPercent"> & MenuHandlers) {
  return (
    <Phone {...LOC_PARK}>
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <ActionBar context={{ sleeping: false, tired: false }} />
      <div className="td-scrim" />
      <HeaderBar left="close" title="Menu" percent={energyPercent} onClose={onClose} />
      <MenuPanel onSettings={onSettings} onPlaces={onPlaces} onSchedule={onSchedule} onLogout={onLogout} />
    </Phone>
  );
}

/* ---------------- Actions: water ---------------- */

export function WaterScreen({ name, drunkMl, goalMl, energyPercent, drinking, location = "recreation.park", period = "noon", onBack, onPlus, onMinus, toast }: Pick<ScreenData, "name" | "drunkMl" | "goalMl" | "energyPercent"> & SceneProps & { drinking?: boolean; onBack?: () => void; onPlus?: () => void; onMinus?: () => void; toast?: string }) {
  return (
    <Phone location={location} period={period}>
      <HeaderBar left="back" title="Woda" percent={energyPercent} onBack={onBack} />
      <Hero top={130} name={name} float={false}><Pet state={drinking ? "drinking" : "awake"} size={230} /></Hero>
      <WaterCounter drunkMl={drunkMl} goalMl={goalMl} />
      <div className="td-actionbar" style={{ bottom: 56, gap: 70 }}>
        <RoundButton kind="minus" onClick={onMinus} /><RoundButton kind="plus" onClick={onPlus} />
      </div>
      {toast && <Toast top={408}>{toast}</Toast>}
    </Phone>
  );
}

/* ---------------- Character: settings ---------------- */

function SettingsRows({ name, sleepStart, sleepEnd, weightKg, goalMl, onEditName }: ScreenData & { onEditName?: () => void }) {
  return (
    <div className="td-page">
      <SettingRow label="Imię postaci" value={name} onEdit={onEditName ?? (() => undefined)} />
      <SettingRow label="Godzina snu" value={`${sleepStart} → ${sleepEnd}`} />
      <SettingRow label="Waga" value={`${weightKg} kg`} />
      <SettingRow label="Cel wody" value={`${goalMl} ml`} />
    </div>
  );
}

export function SettingsScreen({ onBack, onEditName, ...d }: ScreenData & { onBack?: () => void; onEditName?: () => void }) {
  return (
    <Phone {...LOC_PARK}>
      <HeaderBar left="back" title="Ustawienia" percent={d.energyPercent} onBack={onBack} />
      <SettingsRows {...d} onEditName={onEditName} />
    </Phone>
  );
}

export function RenameDialogScreen({ draft, onDraft, onCancel, onSave, ...d }: ScreenData & { draft?: string; onDraft?: (v: string) => void; onCancel?: () => void; onSave?: () => void }) {
  return (
    <Phone {...LOC_PARK}>
      <HeaderBar left="back" title="Ustawienia" percent={d.energyPercent} />
      <SettingsRows {...d} />
      <div className="td-scrim" />
      <Dialog title="Zmień imię" description="Jak ma się teraz nazywać Twoja postać?" actions={<><Button variant="secondary" onClick={onCancel}>Anuluj</Button><Button onClick={onSave}>Zapisz</Button></>}>
        <Input label="Imię postaci" {...bindValue(draft ?? d.name, onDraft)} />
      </Dialog>
    </Phone>
  );
}

/* ---------------- Scene: picker, places, schedule ---------------- */

export function ScenePickerScreen({ name, energyPercent, location = "work.openspace", period = "noon", auto = false, onPick, onAuto, onClose }: Pick<ScreenData, "name" | "energyPercent"> & SceneProps & { auto?: boolean; onPick?: (l: LocationId) => void; onAuto?: (v: boolean) => void; onClose?: () => void }) {
  return (
    <Phone location={location} period={period}>
      <HeaderBar left="menu" title={getLocation(location).label} percent={energyPercent} onTitle={() => undefined} />
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <div className="td-scrim" onClick={onClose} />
      <Sheet>
        <h3>Wybierz scenę</h3>
        <Switch label="Automatycznie (miejsce i plan dnia)" checked={auto} onChange={onAuto} />
        {LOCATION_GROUPS.map((g) => (
          <div key={g.id}>
            <div className="td-grouphead">{g.label}</div>
            <div className="td-scenegrid3">
              {locationsOf(g.id).map((l) => <SceneCard key={l.id} location={l.id} period={period} compact selected={l.id === location} onSelect={() => onPick?.(l.id)} />)}
            </div>
          </div>
        ))}
      </Sheet>
    </Phone>
  );
}

export function PlacesScreen({ energyPercent, onBack, onUseLocation }: Pick<ScreenData, "energyPercent"> & { onBack?: () => void; onUseLocation?: () => void }) {
  return (
    <Phone {...LOC_PARK}>
      <HeaderBar left="back" title="Miejsca" percent={energyPercent} onBack={onBack} />
      <div className="td-page">
        <MapArt />
        <ListCard icon="pin" title="Dom" sub="52.2297, 21.0122 · promień 100 m" onClick={() => undefined} right={<LocationPill location="home.office" />} />
        <ListCard icon="pin" title="Praca" sub="52.2400, 21.0300 · promień 150 m" onClick={() => undefined} right={<LocationPill location="work.openspace" />} />
        <AddCard label="Dodaj miejsce" />
        <Button variant="water" onClick={onUseLocation}>Użyj bieżącej lokalizacji</Button>
        <p className="td-note">Lokalizację porównujemy z Twoimi miejscami na urządzeniu. Nie zapisujemy trasy.</p>
      </div>
    </Phone>
  );
}

export function LocationPermissionScreen({ name, onAllow, onLater }: Pick<ScreenData, "name"> & { onAllow?: () => void; onLater?: () => void }) {
  return (
    <Phone {...LOC_PARK}>
      <Hero top={100} name={name}><Pet state="happy" size={200} /></Hero>
      <Sheet>
        <h3>Gdzie jesteś?</h3>
        <p>Dzięki lokalizacji pokażę scenę domu, pracy lub miejsca rekreacji, które zapiszesz.</p>
        <MapArt />
        <p className="td-note">Używamy tylko ostatniej pozycji, żeby rozpoznać Twoje miejsca. Możesz to wyłączyć w każdej chwili i zmieniać sceny ręcznie.</p>
        <Button onClick={onAllow}>Zezwól na lokalizację</Button>
        <Button variant="ghost" onClick={onLater}>Nie teraz</Button>
      </Sheet>
    </Phone>
  );
}

export function ScheduleScreen({ energyPercent, onBack }: Pick<ScreenData, "energyPercent"> & { onBack?: () => void }) {
  return (
    <Phone {...LOC_PARK}>
      <HeaderBar left="back" title="Plan dnia" percent={energyPercent} onBack={onBack} />
      <div className="td-page">
        <h2>Bloki dnia</h2>
        <ListCard icon="clock" title="Praca" sub="09:00 – 17:00 · pon–pt" onClick={() => undefined} right={<LocationPill location="work.openspace" />} />
        <ListCard icon="clock" title="Lunch" sub="12:30 – 13:00 · pon–pt" onClick={() => undefined} right={<LocationPill location="work.kitchen" />} />
        <AddCard label="Dodaj blok" />
        <p className="td-note">Krótszy blok wygrywa z dłuższym, więc w czasie lunchu zobaczysz kuchnię, a nie open space. Poza blokami scenę wybiera Twoja lokalizacja.</p>
      </div>
    </Phone>
  );
}

export function SchedulePromptScreen({ name, energyPercent, onYes, onChange }: Pick<ScreenData, "name" | "energyPercent"> & { onYes?: () => void; onChange?: () => void }) {
  return (
    <Phone location="work.openspace" period="noon">
      <HeaderBar left="menu" title={getLocation("work.openspace").label} percent={energyPercent} onTitle={() => undefined} />
      <Hero top={165} name={name} float={false}><Pet size={270} /></Hero>
      <div className="td-scrim" />
      <Dialog title="Zaczynasz pracę o 9:00?" description="Kończysz o 17:00? Pokażę wtedy open space, a w czasie lunchu kuchnię w pracy." actions={<><Button variant="secondary" onClick={onChange}>Zmień</Button><Button onClick={onYes}>Tak, ustaw</Button></>} />
    </Phone>
  );
}

export { getGroup };
