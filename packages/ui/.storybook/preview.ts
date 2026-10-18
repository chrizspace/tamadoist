import type { Preview } from "@storybook/react";
import "../src/styles.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: { layout: "centered", controls: { expanded: true } },
};
export default preview;
