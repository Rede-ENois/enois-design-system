import type { Preview } from "@storybook/react-vite";

import { ToastProvider } from "../src/ui/toast.js";

import "./storybook.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: { icon: "mirror", items: ["light", "dark"], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => (
      <div className={context.globals.theme === "dark" ? "dark" : undefined}>
        <div className="min-h-screen bg-background p-6 text-foreground">
          <ToastProvider>
            <Story />
          </ToastProvider>
        </div>
      </div>
    ),
  ],
};

export default preview;
