import type { ReactNode } from "react";
import { Dialog } from "../components/Dialog";
import { IconButton } from "../components/IconButton";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { SettingRow, Switch } from "../components/Places";
import { Toast } from "../components/Toast";
import { ActionButton } from "../actions/ActionButton";
import { RoundButton } from "../actions/RoundButton";
import { EnergyChip } from "../character/EnergyChip";
import { EnergyBar } from "../character/EnergyBar";
import { NameTag } from "../character/NameTag";
import { LocationPill } from "../scene/SceneCard";

export const ELEVATION_RULES: { kind: string; title: string; text: string }[] = [
  { kind: "3D", title: "3D = można nacisnąć", text: "Twarda, ciemniejsza krawędź 4 px u dołu. Po naciśnięciu element zapada się o 4 px. Przyciski, ikony w nagłówku, +/−, akcje, wskaźnik energii, karty sceny i wiersze, które można edytować." },
  { kind: "Płasko", title: "Płasko = informuje", text: "Ramka 2 px i żadnej krawędzi. Imię, licznik wody, powiadomienia, pastylki, paski postępu, pola tekstowe i przełączniki." },
  { kind: "Powierzchnia", title: "Powierzchnia = miękki cień", text: "Arkusz, dialog i menu leżą nad sceną, więc mają tylko miękki cień, bez krawędzi." },
  { kind: "Ghost", title: "Ghost = sam tekst", text: "Najcichsza akcja, np. „Nie teraz”. Bez tła i krawędzi, wielkie litery." },
  { kind: "Stany", title: "Stany", text: "Wyłączony jest płaski i szary. Wybrany ma krawędź w kolorze marki. Na ekranie tylko jedna główna akcja ma kolor, reszta jest neutralna." },
];

const Group = ({ title, note, children, bg = "var(--color-surface)" }: { title: string; note: string; children: ReactNode; bg?: string }) => (
  <div style={{ background: "#fff", border: "2px solid var(--color-border)", borderRadius: 22, padding: 18, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
    <div><b style={{ fontSize: 17 }}>{title}</b><div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{note}</div></div>
    <div style={{ background: bg, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>{children}</div>
  </div>
);

/** One page that shows which elements are 3D, which are flat and why. Used in Storybook and in the preview. */
export function ElevationGuide() {
  const sky = "linear-gradient(#BFE6FF, #E6FAF6)";
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 18 }}>
        {ELEVATION_RULES.map((r) => (
          <div key={r.kind} style={{ background: "#fff", border: "2px solid var(--color-border)", borderRadius: 18, padding: 14 }}>
            <b>{r.title}</b>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--color-text-muted)" }}>{r.text}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <Group title="3D · można nacisnąć" note="Spróbuj kliknąć: zapadają się." bg={sky}>
          <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12 }}>
            <Button>Dalej</Button><Button variant="secondary">Kontynuuj z Google</Button><Button variant="water">+ 250 ml wody</Button>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <IconButton icon="menu" label="Menu" /><IconButton icon="back" label="Wstecz" /><EnergyChip percent={62} onClick={() => undefined} />
          </div>
          <div style={{ display: "flex", gap: 22, background: "var(--color-hill)", padding: "14px 22px", borderRadius: 18 }}>
            <RoundButton kind="minus" /><RoundButton kind="plus" /><ActionButton />
          </div>
          <div style={{ width: 280 }}><SettingRow label="Imię postaci" value="Tama" onEdit={() => undefined} /></div>
        </Group>
        <Group title="Płasko · informuje" note="Nie reaguje na dotyk, więc nie ma krawędzi." bg={sky}>
          <NameTag name="Tama" />
          <EnergyChip percent={62} />
          <div style={{ width: 260 }}><EnergyBar percent={62} label="Woda" /></div>
          <Toast inline>+250 ml wody</Toast>
          <div style={{ display: "flex", gap: 8 }}><LocationPill location="home.kitchen" /><LocationPill location="work.openspace" /><LocationPill location="recreation.gym" /></div>
          <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 10 }}><Input label="Imię postaci" defaultValue="Tama" /><Switch label="Automatycznie" checked onChange={() => undefined} /></div>
        </Group>
        <Group title="Powierzchnia · miękki cień" note="Leży nad sceną, bez krawędzi.">
          <Dialog inline title="Zmień imię" description="Jak ma się teraz nazywać Twoja postać?" actions={<><Button variant="secondary">Anuluj</Button><Button>Zapisz</Button></>} />
        </Group>
        <Group title="Ghost i stany" note="Najcichsza akcja oraz wyłączony przycisk.">
          <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12 }}>
            <Button variant="ghost">Nie teraz</Button><Button disabled>Wyłączony</Button>
          </div>
        </Group>
      </div>
    </div>
  );
}
