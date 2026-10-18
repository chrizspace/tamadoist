import type { Meta, StoryObj } from "@storybook/react";
import { EnergyBar } from "./EnergyBar";

const meta: Meta<typeof EnergyBar> = {
  title: "Character/EnergyBar",
  component: EnergyBar,
  args: { percent: 70 },
  argTypes: { percent: { control: { type: "range", min: 0, max: 100 } } },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof EnergyBar>;

export const Empty: Story = { args: { percent: 0 } };
export const Low: Story = { args: { percent: 30 } };
export const High: Story = { args: { percent: 70 } };
export const Full: Story = { args: { percent: 100 } };
