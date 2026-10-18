import type { Meta, StoryObj } from "@storybook/react";
import { LOCATIONS, type LocationId } from "@tamadoist/core";
import { PetStage } from "./PetStage";
import { Scene } from "../scene/Scene";
import { PET_STATES } from "@tamadoist/core";

const meta: Meta<typeof PetStage> = {
  title: "Character/Postać w scenie",
  component: PetStage,
  parameters: { layout: "centered" },
  argTypes: {
    location: { control: "select", options: LOCATIONS.map((l) => l.id) },
    state: { control: "select", options: PET_STATES },
  },
  args: { location: "recreation.park", state: "awake", name: "Kiwi", top: 226 },
  render: (args) => (
    <div className="td-phone">
      <Scene location={args.location as LocationId} period="noon" />
      <div className="td-layer"><PetStage {...args} /></div>
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof PetStage>;

export const Park: Story = {};
export const Basen: Story = { args: { location: "recreation.pool" } };
export const Siłownia: Story = { args: { location: "recreation.gym" } };
export const Rower: Story = { args: { location: "recreation.bike" } };
export const Biuro: Story = { args: { location: "home.office" } };
export const Sypialnia: Story = { args: { location: "home.bedroom", state: "sleeping" } };
