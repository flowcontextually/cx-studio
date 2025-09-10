"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
} from "react";
import useReactWebSocket, { ReadyState } from "react-use-websocket";
import { notifications } from "@mantine/notifications";
import { useSessionStore } from "@/shared/store/useSessionStore";
import { InboundMessage } from "@/shared/types/server";

type OutboundMessage = {
  type: string;
  command_id: string;
  payload: Record<string, unknown>;
};

interface WebSocketContextType {
  sendJsonMessage: (jsonMessage: OutboundMessage) => void;
  readyState: ReadyState;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);
const logger = (...args: unknown[]) =>
  console.log("%c[WS Provider]", "color: purple; font-weight: bold;", ...args);
const CX_SERVER_URL = "ws://127.0.0.1:8888/ws";

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { setLastJsonMessage } = useSessionStore();

  const { sendJsonMessage: sendBaseMessage, readyState } =
    useReactWebSocket<InboundMessage>(CX_SERVER_URL, {
      onOpen: () => logger("✅ WebSocket connection established."),
      onClose: () => logger("❌ WebSocket connection closed."),
      onMessage: (event) => {
        logger("🚀 MESSAGE RECEIVED FROM SERVER:", event.data);
        try {
          const parsedData: InboundMessage = JSON.parse(event.data);
          setLastJsonMessage(parsedData);
        } catch (e) {
          logger("🔥 Error parsing WS message:", e);
        }
      },
      shouldReconnect: () => true,
      reconnectInterval: 3000,
    });

  const sendMessage = useCallback(
    (message: OutboundMessage) => {
      logger("📤 SENDING MESSAGE TO SERVER:", message);
      if (readyState === ReadyState.OPEN) {
        sendBaseMessage(message);
      } else {
        notifications.show({
          title: "Connection Error",
          message: "Cannot send message.",
          color: "red",
        });
      }
    },
    [readyState, sendBaseMessage]
  );

  const contextValue: WebSocketContextType = {
    sendJsonMessage: sendMessage,
    readyState,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
