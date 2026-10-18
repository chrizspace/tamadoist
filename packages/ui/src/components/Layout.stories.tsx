import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { HeaderBar } from "./HeaderBar";
import { MenuPanel } from "./MenuPanel";
import { Toast } from "./Toast";
import { TimeCard } from "./TimeCard";

const meta: Meta = { title: "Layout/Navigation", parameters: { layout: "centered" } };
export default meta;
type Story = StoryObj;

export const Header: Story = {
  name: "Pasek nagłówka",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {(["menu", "back", "close"] as const).map((left) => (
        <div key={left} style={{ position: "relative", width: 390, height: 64, background: "var(--color-sky)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, top: -48 }}>
            <HeaderBar left={left} title={left === "close" ? "Menu" : left === "menu" ? "Kuchnia" : "Woda"} percent={62} onTitle={left === "menu" ? () => undefined : undefined} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Menu: Story = {
  name: "Menu",
  render: () => <div style={{ position: "relative", width: 330, height: 280, background: "var(--color-sky)", borderRadius: 16 }}><div style={{ position: "absolute", left: 16, top: -108 }}><MenuPanel /></div></div>,
};

export const SleepWindow: Story = { name: "Okno snu", render: () => <div style={{ width: 280 }}><TimeCard start="22:00" end="06:00" /></div> };
export const ToastStory: Story = { name: "Toast", render: () => <Toast inline>+250 ml wody</Toast> };
export const DialogStory: Story = {
  name: "Dialog",
  render: () => <Dialog inline title="Zmień imię" description="Jak ma się teraz nazywać Twoja postać?" actions={<><Button variant="secondary">Anuluj</Button><Button>Zapisz</Button></>} />,
};
