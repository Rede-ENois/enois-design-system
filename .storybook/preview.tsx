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
    (Story, context) => {
      // The app puts `.dark` on <html>: the @theme color tokens resolve there, and portaled
      // overlays (menus, dialogs) live outside any wrapper. Mirror it so stories match the app.
      document.documentElement.classList.toggle("dark", context.globals.theme === "dark");

      return (
        <div className="min-h-screen bg-background p-6 text-foreground">
          <ToastProvider>
            <Story />
          </ToastProvider>
        </div>
      );
    },
  ],
};

export default preview;
