import type { Meta, StoryObj } from "@storybook/react";
import { ProgressDots } from "./ProgressDots";

const meta: Meta<typeof ProgressDots> = { title: "Primitives/ProgressDots", component: ProgressDots, args: { total: 5, current: 2 } };
export default meta;
type Story = StoryObj<typeof ProgressDots>;

export const Default: Story = {};
export const Last: Story = { args: { current: 5 } };
