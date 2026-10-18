import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "./TimePicker";

const meta: Meta<typeof TimePicker> = { title: "Primitives/TimePicker", component: TimePicker };
export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  args: { label: "Godzina zaśnięcia", value: "22:00" },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <div style={{ width: 280 }}><TimePicker {...args} value={value} onChange={setValue} /></div>;
  },
};
