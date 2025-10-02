// /home/dpwanjala/repositories/cx-studio/src/widgets/Notebook/index.tsx
"use client";

import React from "react";
import { Box, ScrollArea, Center, Text } from "@mantine/core";
import { useSessionStore } from "@/shared/store/useSessionStore";
import BlockComponent from "./BlockComponent"; // <-- IMPORT THE NEW COMPONENT

export default function Notebook() {
  const currentPage = useSessionStore((state) => state.currentPage);

  return (
    <Box className="h-full flex flex-col bg-white dark:bg-black">
      <ScrollArea className="flex-grow">
        <Box p="xl">
          {currentPage ? (
            // --- REPLACE THE TEXT COMPONENT WITH THIS MAPPING LOGIC ---
            <>
              <Box mb="xl">
                <Text size="xl" fw={700}>
                  {currentPage.name}
                </Text>
                {currentPage.description && (
                  <Text c="dimmed">{currentPage.description}</Text>
                )}
              </Box>
              {currentPage.blocks.map((block) => (
                <BlockComponent key={block.id} block={block} />
              ))}
            </>
          ) : (
            <Center h="100%">
              <Text c="dimmed">
                No page selected. Please choose a notebook from the Workspace
                navigator.
              </Text>
            </Center>
          )}
        </Box>
      </ScrollArea>
    </Box>
  );
}
