import type { Meta, StoryObj } from "@storybook/react";
import { LOCATIONS, LOCATION_GROUPS, PERIODS, getGroup, locationsOf, type LocationId, type PeriodId } from "@tamadoist/core";
import { Scene } from "./Scene";
import { SceneCard } from "./SceneCard";

const meta: Meta = { title: "Scene/Overview", parameters: { layout: "padded" } };
export default meta;
type Story = StoryObj<{ location: LocationId; period: PeriodId }>;

const frame = (location: LocationId, period: PeriodId, scale = 0.5) => (
  <div style={{ position: "relative", width: 390 * scale, height: 844 * scale, borderRadius: 20, overflow: "hidden", flex: "none", boxShadow: "0 4px 14px rgba(0,0,0,.18)" }}>
    <div style={{ width: 390, height: 844, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative" }}><Scene location={location} period={period} /></div>
  </div>
);

export const Single: Story = {
  name: "Jedna scena",
  args: { location: "home.kitchen", period: "noon" },
  argTypes: {
    location: { control: "select", options: LOCATIONS.map((l) => l.id) },
    period: { control: "select", options: PERIODS.map((p) => p.id) },
  },
  render: ({ location, period }) => frame(location, period, 0.8),
};

export const TimeOfDay: Story = {
  name: "Pory dnia",
  args: { location: "home.office" },
  argTypes: { location: { control: "select", options: LOCATIONS.map((l) => l.id) } },
  render: ({ location }) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {PERIODS.map((p) => (
        <div key={p.id} style={{ textAlign: "center" }}>
          {frame(location, p.id, 0.42)}
          <b style={{ display: "block", marginTop: 8 }}>{p.label}</b>
          <code style={{ fontSize: 12 }}>{p.start}–{p.end}{p.artificialLight ? " · światło włączone" : ""}</code>
        </div>
      ))}
    </div>
  ),
};

export const Locations: Story = {
  name: "Lokalizacje",
  args: { period: "noon" },
  argTypes: { period: { control: "select", options: PERIODS.map((p) => p.id) } },
  render: ({ period }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {LOCATION_GROUPS.map((g) => (
        <section key={g.id}>
          <h3 style={{ margin: "0 0 10px" }}>{getGroup(g.id).label}</h3>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {locationsOf(g.id).map((l) => (
              <div key={l.id} style={{ textAlign: "center" }}>{frame(l.id, period, 0.4)}<b style={{ display: "block", marginTop: 6 }}>{l.label}</b><span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{l.hint}</span></div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

export const Card: Story = {
  name: "Karta sceny (picker)",
  render: () => (
    <div style={{ display: "flex", gap: 12, width: 380 }}>
      <SceneCard location="home.bedroom" period="night" selected />
      <SceneCard location="recreation.pool" period="afternoon" />
    </div>
  ),
};
