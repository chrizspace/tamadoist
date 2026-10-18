import type { Meta, StoryObj } from "@storybook/react";
import { ElevationGuide } from "./ElevationGuide";

const meta: Meta = { title: "Foundations/Elevation", parameters: { layout: "padded" } };
export default meta;

export const WhenToUse3D: StoryObj = { name: "Kiedy 3D, a kiedy płasko", render: () => <ElevationGuide /> };
