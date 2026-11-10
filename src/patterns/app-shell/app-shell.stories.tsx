import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Compass, Home, MessageCircle, Plus, Users } from "lucide-react";

import { AppHeaderLayout } from "./app-header-layout.js";
import { AppLayout } from "./app-layout.js";
import { AppSidebar } from "./app-sidebar.js";
import { MobileDock } from "./mobile-dock.js";
import { NavigationDrawer } from "./navigation-drawer.js";
import { ThemeSwitch } from "./theme-switch.js";
import { ThemeToggle } from "./theme-toggle.js";

const meta: Meta = {
  title: "Patterns/App shell",
};

export default meta;

const links = (
  <nav className="flex flex-col gap-1 p-3 text-sm">
    <a href="#" className="flex items-center gap-3 px-3 py-2">
      <Home className="h-4 w-4" />
      Início
    </a>

    <a href="#" className="flex items-center gap-3 px-3 py-2">
      <Users className="h-4 w-4" />
      Rede
    </a>
  </nav>
);

export const Layout: StoryObj = {
  render: function LayoutStory() {
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    return (
      <AppLayout>
        <AppLayout.Header>
          <AppHeaderLayout>
            <strong>Énóis</strong>

            <div className="ml-auto">
              <ThemeToggle
                theme={theme}
                onToggle={() => setTheme(theme === "light" ? "dark" : "light")}
              />
            </div>
          </AppHeaderLayout>
        </AppLayout.Header>

        <AppLayout.Content>
          <AppLayout.Sidebar>
            <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)}>
              {links}
            </AppSidebar>
          </AppLayout.Sidebar>

          <AppLayout.Main>
            <div className="surface-card p-6">Conteúdo da página</div>
          </AppLayout.Main>
        </AppLayout.Content>
      </AppLayout>
    );
  },
};

export const Drawer: StoryObj = {
  render: function DrawerStory() {
    const [open, setOpen] = useState(true);

    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          Abrir menu
        </button>

        <NavigationDrawer open={open} onClose={() => setOpen(false)} brand={<strong>Énóis</strong>}>
          {links}
        </NavigationDrawer>
      </>
    );
  },
};

/** The phone's floating dock: two destinations, the publish action, two more, with their signals. */
export const Dock: StoryObj = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => (
    <div className="h-40">
      <MobileDock
        items={[
          { href: "#feed", label: "Início", icon: Home, active: true },
          { href: "#explorar", label: "Explorar", icon: Compass, active: false },
          {
            href: "#mensagens",
            label: "Mensagens",
            icon: MessageCircle,
            active: false,
            signal: { kind: "messages", count: 2 },
          },
          {
            href: "#avisos",
            label: "Avisos",
            icon: Bell,
            active: false,
            signal: { kind: "count", count: 5 },
          },
        ]}
        action={{ label: "Publicar", icon: Plus, onClick: () => {} }}
      />
    </div>
  ),
};

export const ThemeSwitcher: StoryObj = {
  render: function ThemeSwitcherStory() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    return <ThemeSwitch theme={theme} onChange={setTheme} />;
  },
};
