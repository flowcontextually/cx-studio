"use client";

import { Box, Title, Text, Paper, Loader, Center } from "@mantine/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidebarWidget from "@/widgets/SidebarWidget";
import Notebook from "@/widgets/Notebook";
import { useIsClient } from "@/shared/hooks/useIsClient"; // Import our new hook

export default function StudioPage() {
  const isClient = useIsClient();

  // --- THIS IS THE FIX ---
  // If we are not on the client yet (i.e., during server render or initial hydration),
  // render a simple placeholder or a loader.
  if (!isClient) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }
  // --- END FIX ---

  // Once isClient is true, we can safely render our full, client-dependent UI.
  return (
    <main className="h-screen w-screen bg-white dark:bg-black text-black dark:text-white">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} maxSize={40}>
          <SidebarWidget />
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 transition-colors" />
        <Panel>
          <Notebook />
        </Panel>
      </PanelGroup>
    </main>
  );
}
