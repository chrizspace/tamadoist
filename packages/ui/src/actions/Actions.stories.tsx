import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ACTIONS, GLASS_ML, applyWater } from "@tamadoist/core";
import { ActionBar } from "./ActionBar";
import { ActionButton } from "./ActionButton";
import { RoundButton } from "./RoundButton";
import { WaterCounter } from "./WaterCounter";

const meta: Meta = { title: "Actions/Overview", parameters: { layout: "centered" } };
export default meta;
type Story = StoryObj;

const onHill = (node: React.ReactNode) => <div style={{ background: "var(--color-hill)", padding: 24, borderRadius: 20, position: "relative", width: 340, height: 140 }}>{node}</div>;

export const Registry: Story = {
  name: "Rejestr akcji",
  render: () => <pre style={{ background: "#fff", padding: 16, borderRadius: 12, fontSize: 13 }}>{JSON.stringify(ACTIONS, null, 2)}</pre>,
};

export const Button: Story = {
  name: "Przycisk akcji",
  render: () => (
    <div style={{ display: "flex", gap: 28, background: "var(--color-hill)", padding: 24, borderRadius: 20 }}>
      <ActionButton /><ActionButton active /><ActionButton disabled />
    </div>
  ),
};

export const Bar: Story = {
  name: "Pasek akcji z rejestru",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {([["zwykły", false, false], ["zmęczony (podświetlona)", false, true], ["śpi (dostępna)", true, false]] as const).map(([label, sleeping, tired]) => (
        <div key={label}>
          <code style={{ fontSize: 12 }}>{label}</code>
          {onHill(<div style={{ position: "absolute", left: 0, right: 0, bottom: 28, display: "flex", justifyContent: "center" }}><ActionBar context={{ sleeping, tired }} /></div>)}
        </div>
      ))}
    </div>
  ),
};

export const WaterFlow: Story = {
  name: "Woda (interaktywna)",
  render: () => {
    const [ml, setMl] = useState(1700);
    const goal = 2450;
    return (
      <div style={{ width: 340, background: "var(--color-hill)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 16, alignItems: "center", position: "relative" }}>
        <div className="td-static" style={{ position: "relative", height: 76, width: "100%" }}><WaterCounter drunkMl={ml} goalMl={goal} /></div>
        <div style={{ display: "flex", gap: 60 }}>
          <RoundButton kind="minus" onClick={() => setMl((v) => applyWater(v, -GLASS_ML))} />
          <RoundButton kind="plus" onClick={() => setMl((v) => applyWater(v, GLASS_ML))} />
        </div>
      </div>
    );
  },
};
