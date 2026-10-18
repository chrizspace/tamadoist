import type { Meta, StoryObj } from "@storybook/react";
import { Pet } from "./Pet";

const meta: Meta<typeof Pet> = {
  title: "Primitives/Pet",
  component: Pet,
  args: { state: "awake", size: 160 },
  argTypes: { state: { control: "inline-radio", options: ["awake", "tired", "sleeping"] } },
};
export default meta;
type Story = StoryObj<typeof Pet>;

export const Awake: Story = {};
export const Tired: Story = { args: { state: "tired" } };
export const Sleeping: Story = { args: { state: "sleeping" } };
