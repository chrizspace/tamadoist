import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Dalej", variant: "primary" },
  argTypes: { variant: { control: "inline-radio", options: ["primary", "secondary", "water"] } },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "Kontynuuj z Google" } };
export const Water: Story = { args: { variant: "water", children: "+ 250 ml wody" } };
export const Disabled: Story = { args: { disabled: true } };
