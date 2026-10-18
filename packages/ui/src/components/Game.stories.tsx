import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ActionButton } from "./ActionButton";
import { Battery, batteryRange } from "./Battery";
import { Dialog } from "./Dialog";
import { Egg } from "./Egg";
import { HeaderBar } from "./HeaderBar";
import { IconButton } from "./IconButton";
import { MenuPanel } from "./MenuPanel";
import { NameTag } from "./NameTag";
import { PetScale } from "./PetScale";
import { RoundButton } from "./RoundButton";
import { Scene } from "./Scene";
import { TimeCard } from "./TimeCard";
import { Toast } from "./Toast";
import { WaterCounter } from "./WaterCounter";
import { Button } from "./Button";

const meta: Meta = { title: "Game UI/Overview", parameters: { layout: "centered" } };
export default meta;
type Story = StoryObj;

const onSky = (node: React.ReactNode, w = 390) => (
  <div style={{ position: "relative", width: w, background: "var(--color-sky)", borderRadius: 16, padding: 0 }}>{node}</div>
);

export const BatteryIndicator: Story = {
  name: "BatteryIndicator (interaktywny)",
  render: () => {
    const [p, setP] = useState(62);
    return (
      <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <div style={{ background: "#fff", padding: "12px 18px", borderRadius: 999, boxShadow: "0 3px 8px rgba(0,0,0,.1)" }}><Battery percent={p} /></div>
        <input type="range" min={0} max={100} value={p} onChange={(e) => setP(+e.target.value)} style={{ width: "100%" }} aria-label="Energia" />
        <code>zakres {batteryRange(p)} · jednostki {(p / 25).toFixed(2)}</code>
      </div>
    );
  },
};

export const BatteryRanges: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#fff", padding: 20, borderRadius: 20 }}>
      {[0, 12, 37, 62, 100].map((p) => (
        <div key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}><Battery percent={p} /><code>{batteryRange(p)}</code></div>
      ))}
    </div>
  ),
};

export const Header: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {(["menu", "menu-back", "close"] as const).map((left) => (
        <div key={left} style={{ position: "relative", width: 390, height: 64, background: "var(--color-sky)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, top: -48 }}>
            <HeaderBar left={left} title={left === "close" ? "Menu" : left === "menu" ? "Zielona Łąka" : "Woda"} percent={62} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const HeaderButtons: Story = {
  render: () => <div style={{ display: "flex", gap: 12 }}><IconButton icon="menu" label="Menu" /><IconButton icon="back" label="Wstecz" /><IconButton icon="close" label="Zamknij" /></div>,
};

export const Menu: Story = {
  render: () => onSky(<div style={{ height: 280, position: "relative" }}><div style={{ position: "absolute", left: 16, top: -108 }}><MenuPanel /></div></div>, 330),
};

export const Actions: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 28, background: "var(--color-hill)", padding: 24, borderRadius: 20 }}>
      <ActionButton /><ActionButton active /><ActionButton disabled />
    </div>
  ),
};

export const WaterButtons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 40, background: "var(--color-hill)", padding: 24, borderRadius: 20 }}>
      <RoundButton kind="minus" /><RoundButton kind="plus" />
    </div>
  ),
};

export const Name: Story = { render: () => <NameTag name="Tama" /> };
export const EggStory: Story = { name: "Egg", render: () => onSky(<div style={{ padding: 24, display: "grid", placeItems: "center" }}><Egg size={220} /></div>, 320) };
export const Scale: Story = { render: () => onSky(<div style={{ padding: 24, display: "grid", placeItems: "center" }}><PetScale weightKg={70} /></div>, 320) };
export const Sleep: Story = { render: () => <div style={{ width: 280 }}><TimeCard start="22:00" end="06:00" /></div> };
export const ToastStory: Story = { name: "Toast", render: () => <Toast inline>+250 ml wody</Toast> };
export const Counter: Story = { render: () => <div style={{ position: "relative", width: 300, height: 100 }}><WaterCounter drunkMl={1700} goalMl={2450} top={8} /></div> };
export const DialogStory: Story = {
  name: "Dialog",
  render: () => <Dialog inline title="Zmień imię" description="Jak ma się teraz nazywać Twoja postać?" actions={<><Button variant="secondary">Anuluj</Button><Button>Zapisz</Button></>} />,
};
export const SceneDayNight: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      {[false, true].map((n) => <div key={String(n)} style={{ position: "relative", width: 195, height: 422, borderRadius: 24, overflow: "hidden" }}><div style={{ transform: "scale(.5)", transformOrigin: "top left", width: 390, height: 844, position: "relative" }}><Scene night={n} /></div></div>)}
    </div>
  ),
};
