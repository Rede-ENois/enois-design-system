import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Pill } from "./pill.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

const meta: Meta = {
  title: "UI/Navigation",
};

export default meta;

export const Pills: StoryObj = {
  render: function PillsStory() {
    const [active, setActive] = useState("todos");

    return (
      <div className="flex gap-2">
        {["todos", "vagas", "mentorias"].map((filter) => (
          <Pill key={filter} active={filter === active} onClick={() => setActive(filter)}>
            {filter}
          </Pill>
        ))}
      </div>
    );
  },
};

export const TabsStory: StoryObj = {
  name: "Tabs",
  render: () => (
    <Tabs defaultValue="posts">
      <TabsList>
        <TabsTrigger value="posts">Posts</TabsTrigger>

        <TabsTrigger value="sobre">Sobre</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">Lista de posts.</TabsContent>

      <TabsContent value="sobre">Sobre a pessoa.</TabsContent>
    </Tabs>
  ),
};
