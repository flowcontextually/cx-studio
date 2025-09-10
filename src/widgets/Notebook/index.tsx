"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { nanoid } from "nanoid";
import { Box, ScrollArea } from "@mantine/core";
import { useWebSocket } from "@/shared/providers/WebSocketProvider";
import { useSessionStore } from "@/shared/store/useSessionStore";
import { Command } from "@/shared/types/commands";
import { InboundMessage } from "@/shared/types/server";

import TerminalInput from "@/widgets/Terminal/TerminalInput";
import OutputViewer from "@/widgets/OutputViewer";

/**
 * Represents a single input/output pair in the notebook interface.
 */
interface Cell {
  id: string; // A unique ID for this execution instance
  command: string; // The raw command text submitted by the user
  result: InboundMessage | null; // The full, raw message object from the server
  status: "running" | "success" | "error";
  executable: Command | null; // The client's parsed representation of the command
  options: Record<string, unknown> | null; // Client-parsed formatter options
}

export default function Notebook() {
  const [cells, setCells] = useState<Cell[]>([]);

  const { sendJsonMessage } = useWebSocket();
  const lastJsonMessage = useSessionStore((state) => state.lastJsonMessage);
  const { setConnections, setVariables } = useSessionStore();

  const scrollViewport = useRef<HTMLDivElement>(null);

  // Automatically scroll to the newest cell
  useEffect(() => {
    if (scrollViewport.current) {
      setTimeout(() => {
        if (scrollViewport.current) {
          scrollViewport.current.scrollTo({
            top: scrollViewport.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [cells.length]);

  const handleCommandSubmit = useCallback(
    (commandText: string) => {
      let executable: Command | null = null;
      const parts = commandText.trim().split(/\s+/);
      if (
        parts.length > 1 &&
        [
          "connection",
          "flow",
          "query",
          "script",
          "session",
          "var",
          "app",
          "process",
        ].includes(parts[0])
      ) {
        executable = { command: parts[0], subcommand: parts[1] };
      } else if (
        parts.length === 1 &&
        ["connections", "help"].includes(parts[0])
      ) {
        executable = { command: parts[0] };
      }

      const newCell: Cell = {
        id: nanoid(),
        command: commandText,
        result: null,
        status: "running",
        executable,
        options: {
          output_mode: commandText.includes("--cx-output")
            ? "table"
            : "default",
        },
      };

      setCells((prev) => [...prev, newCell]);
      sendJsonMessage({
        type: "EXECUTE_COMMAND",
        command_id: newCell.id,
        payload: { command_text: commandText },
      });
    },
    [sendJsonMessage]
  );

  useEffect(() => {
    if (!lastJsonMessage) return;

    const { type, command_id, payload } = lastJsonMessage;

    if (type === "RESULT_SUCCESS" || type === "RESULT_ERROR") {
      setCells((prevCells) =>
        prevCells.map((cell) => {
          if (cell.id === command_id) {
            const newStatus: "success" | "error" =
              type === "RESULT_ERROR" ? "error" : "success";
            return { ...cell, status: newStatus, result: lastJsonMessage };
          }
          return cell;
        })
      );
    }

    if (
      (type === "RESULT_SUCCESS" || type === "SESSION_LOADED") &&
      payload &&
      typeof payload === "object" &&
      "new_session_state" in payload
    ) {
      const sessionState = (
        payload as { new_session_state?: { connections?: []; variables?: [] } }
      ).new_session_state;
      if (sessionState) {
        setConnections(sessionState.connections || []);
        setVariables(sessionState.variables || []);
      }
    }
  }, [lastJsonMessage, setConnections, setVariables]);

  return (
    <Box className="h-full flex flex-col bg-white dark:bg-black">
      <ScrollArea className="flex-grow" viewportRef={scrollViewport}>
        <Box p="md">
          {cells.map((cell, index) => (
            <Box key={cell.id} mb="xl">
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md mb-2 text-sm font-mono text-gray-800 dark:text-gray-200">
                <span className="text-blue-500 dark:text-blue-400 mr-2 font-bold select-none">
                  In [{index + 1}]:
                </span>
                {cell.command}
              </pre>
              <Box className="flex items-start">
                <span className="text-red-500 dark:text-red-400 mr-2 font-bold select-none">
                  Out[{index + 1}]:
                </span>
                <Box className="flex-1">
                  <OutputViewer
                    result={cell.result}
                    status={cell.status}
                    executable={cell.executable}
                    options={cell.options}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </ScrollArea>
      <Box className="flex-shrink-0 p-2 border-t border-gray-200 dark:border-gray-800">
        <TerminalInput onCommandSubmit={handleCommandSubmit} />
      </Box>
    </Box>
  );
}
