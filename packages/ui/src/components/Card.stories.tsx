import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = { args: { title: "Woda: 1700 / 2450 ml", children: "Wypij jeszcze 3 szklanki, by naładować energię." } };
export const TitleOnly: Story = { args: { title: "Cel wody: 2450 ml" } };
