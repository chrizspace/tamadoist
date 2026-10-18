import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PET_STATES } from "@tamadoist/core";
import { EnergyIndicator, TasksIndicator, StreakIndicator, energyRange } from "./Indicators";
import { Egg } from "./Egg";
import { NameTag } from "./NameTag";
import { Pet } from "./Pet";
import { PetScale } from "./PetScale";

const meta: Meta = { title: "Character/Overview", parameters: { layout: "centered" } };
export default meta;
type Story = StoryObj;

const stage = (node: React.ReactNode, w = 340) => (
  <div style={{ width: w, background: "var(--color-sky)", borderRadius: 16, padding: 24, display: "grid", placeItems: "center" }}>{node}</div>
);

export const States: Story = {
  name: "Stany postaci",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 640, background: "var(--color-sky)", padding: 24, borderRadius: 16 }}>
      {PET_STATES.map((s) => <div key={s} style={{ textAlign: "center" }}><Pet state={s} size={110} /><code style={{ display: "block", fontSize: 12 }}>{s}</code></div>)}
    </div>
  ),
};

export const EggStory: Story = { name: "Jajko", render: () => stage(<Egg size={220} />) };
export const Name: Story = { name: "Imię nad postacią", render: () => stage(<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><NameTag name="Tama" /><Pet size={150} /></div>) };
export const Weight: Story = { name: "Waga", render: () => stage(<PetScale weightKg={70} />) };

export const EnergyRing: Story = {
  name: "Wskaźnik energii (interaktywny)",
  render: () => {
    const [p, setP] = useState(62);
    return (
      <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 16, alignItems: "center", background: "var(--color-sky)", padding: 20, borderRadius: 16 }}>
        <EnergyIndicator percent={p} onClick={() => undefined} />
        <input type="range" min={0} max={100} value={p} onChange={(e) => setP(+e.target.value)} style={{ width: "100%" }} aria-label="Energia" />
        <code>zakres {energyRange(p)}</code>
      </div>
    );
  },
};

export const EnergyRanges: Story = {
  name: "Wskaźnik energii – zakresy",
  render: () => (
    <div style={{ display: "flex", gap: 22, background: "var(--color-sky)", padding: 24, borderRadius: 16 }}>
      {[0, 12, 37, 62, 100].map((p) => <div key={p} style={{ textAlign: "center" }}><EnergyIndicator percent={p} /><code style={{ display: "block", marginTop: 10, fontSize: 11 }}>{energyRange(p)}</code></div>)}
    </div>
  ),
};

export const ThreeIndicators: Story = {
  name: "Trzy wskaźniki (energia, zadania, seria)",
  render: () => (
    <div style={{ display: "flex", gap: 12, background: "var(--color-sky)", padding: 24, borderRadius: 16 }}>
      <EnergyIndicator percent={62} onClick={() => undefined} /><TasksIndicator done={6} total={10} onClick={() => undefined} /><StreakIndicator days={12} progress={0.7} onClick={() => undefined} />
    </div>
  ),
};
