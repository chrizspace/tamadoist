import {
  Button, Card, Dialog, HeaderBar, Icon, Input, MenuPanel, ProgressDots, Sheet, TimeCard, Toast, ListCard, AddCard, SettingRow, Switch, MapArt, LocationPill, ICON_PATHS, type IconName,
} from "@tamadoist/ui";
import { Section, Spec, SpecGrid } from "../chrome";

export function ComponentsTab() {
  return (
    <>
      <Section title="Podstawowe" lead="Wspólne klocki używane przez wszystkie trzy moduły.">
        <SpecGrid>
          <Spec title="Button" note="Cztery warianty, wciskany efekt 3D."><div style={{ display: "flex", flexDirection: "column", gap: 12, width: 260 }}><Button>Dalej</Button><Button variant="secondary">Kontynuuj z Google</Button><Button variant="water">+ 250 ml wody</Button><Button disabled>Wyłączony</Button></div></Spec>
          <Spec title="Input" note="Domyślny, wypełniony, z błędem."><div style={{ display: "flex", flexDirection: "column", gap: 12, width: 260 }}><Input label="Imię postaci" placeholder="np. Tama" /><Input label="Imię postaci" defaultValue="Tama" /><Input label="Imię postaci" error="Imię musi mieć 1–20 znaków" /></div></Spec>
          <Spec title="Card"><div style={{ width: 280 }}><Card title="Woda: 1700 / 2450 ml">Wypij jeszcze 3 szklanki, by naładować energię do 100%.</Card></div></Spec>
          <Spec title="ProgressDots" note="Postęp onboardingu."><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[1, 3, 5].map((c) => <ProgressDots key={c} total={5} current={c} />)}</div></Spec>
          <Spec title="TimeCard"><div style={{ width: 260 }}><TimeCard start="22:00" end="06:00" /></div></Spec>
          <Spec title="Toast"><Toast inline>+250 ml wody</Toast></Spec>
          <Spec title="Dialog"><Dialog inline title="Zmień imię" description="Jak ma się teraz nazywać Twoja postać?" actions={<><Button variant="secondary">Anuluj</Button><Button>Zapisz</Button></>}><Input label="Imię postaci" defaultValue="Tama" /></Dialog></Spec>
          <Spec title="Ikony" note="24 px, kreska 2,4 px, kolor z currentColor."><div className="icons">{(Object.keys(ICON_PATHS) as IconName[]).map((n) => <div key={n}><Icon name={n} /><span>{n}</span></div>)}</div></Spec>
        </SpecGrid>
      </Section>

      <Section title="Nawigacja" lead="Po lewej zawsze jeden przycisk: hamburger, wstecz (w tym samym miejscu) albo zamknij. Tytuł pośrodku, energia po prawej. Dotknięcie tytułu lokacji otwiera wybór sceny.">
        <SpecGrid>
          <Spec title="HeaderBar" stage="sky col">
            {(["menu", "back", "close"] as const).map((left) => (
              <div key={left} className="hdrwrap"><div style={{ position: "absolute", inset: 0, top: -48 }}><HeaderBar left={left} title={left === "close" ? "Menu" : left === "menu" ? "Kuchnia" : "Woda"} percent={62} rail={false} onTitle={left === "menu" ? () => undefined : undefined} /></div></div>
            ))}
          </Spec>
          <Spec title="MenuPanel" note="Miejsca, Plan dnia, Ustawienia i Wyloguj." stage="sky"><div style={{ position: "relative", width: 310, height: 250 }}><div style={{ position: "absolute", left: 8, top: -112 }}><MenuPanel /></div></div></Spec>
        </SpecGrid>
      </Section>

      <Section title="Listy i ustawienia">
        <SpecGrid>
          <Spec title="ListCard" note="Miejsca i bloki planu dnia." stage="sky col"><ListCard icon="pin" title="Dom" sub="52.2297, 21.0122 · promień 100 m" right={<LocationPill location="home.office" />} /><ListCard icon="clock" title="Lunch" sub="12:30 – 13:00 · pon–pt" right={<LocationPill location="work.kitchen" />} /><AddCard label="Dodaj miejsce" /></Spec>
          <Spec title="SettingRow" note="Z ikoną edycji po prawej, gdy wartość można zmienić." stage="sky col"><SettingRow label="Imię postaci" value="Tama" onEdit={() => undefined} /><SettingRow label="Waga" value="70 kg" /></Spec>
          <Spec title="Switch" stage="col"><Switch label="Automatycznie (miejsce i plan dnia)" checked onChange={() => undefined} /><Switch label="Wyłączony" checked={false} onChange={() => undefined} /></Spec>
          <Spec title="MapArt" stage="sky col"><div style={{ width: 280 }}><MapArt /></div></Spec>
          <Spec title="Sheet" note="Dolny arkusz onboardingu." stage="sky"><div style={{ position: "relative", width: 300, height: 120, overflow: "hidden" }}><div style={{ position: "relative" }}><Sheet><b>Arkusz</b></Sheet></div></div></Spec>
        </SpecGrid>
      </Section>
    </>
  );
}
