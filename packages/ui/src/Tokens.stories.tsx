import type { Meta, StoryObj } from "@storybook/react";
import { colors, radius, space, typography } from "./tokens";

const meta: Meta = { title: "Foundations/Tokens", parameters: { layout: "padded" } };
export default meta;
type Story = StoryObj;

export const Colors: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 140px)", gap: 16 }}>
      {Object.entries(colors).map(([name, value]) => (
        <div key={name}>
          <div style={{ background: value, height: 64, borderRadius: 16, border: "2px solid #E2E8E6" }} />
          <div style={{ fontWeight: 700 }}>{name}</div>
          <div style={{ color: "#6B7C77", fontSize: 13 }}>{value}</div>
        </div>
      ))}
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Object.entries(typography).filter(([k]) => k !== "fontFamily").map(([name, t]) => {
        const { size, weight } = t as { size: number; weight: number };
        return <div key={name} style={{ fontSize: size, fontWeight: weight }}>{name} — {size}px / {weight} — Tamadoist</div>;
      })}
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Object.values(space).map((s) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: s, height: 16, background: colors.primary, borderRadius: 4 }} />{s}px</div>)}
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      {Object.entries(radius).map(([n, r]) => <div key={n} style={{ width: 72, height: 72, background: colors.primarySoft, border: `2px solid ${colors.primary}`, borderRadius: r, display: "grid", placeItems: "center", fontWeight: 700 }}>{n}</div>)}
    </div>
  ),
};
