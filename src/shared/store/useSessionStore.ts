import { create } from "zustand";
import { InboundMessage } from "@/shared/types/server";

export interface ActiveConnection {
  alias: string;
  source: string;
}
export interface SessionVariable {
  name: string;
  type: string;
  preview: string;
}
export interface Flow {
  Name: string;
  Description: string;
}
export interface Query {
  Name: string;
}

interface SessionStore {
  connections: ActiveConnection[];
  variables: SessionVariable[];
  flows: Flow[];
  queries: Query[];
  lastJsonMessage: InboundMessage | null;
  setConnections: (connections: ActiveConnection[]) => void;
  setVariables: (variables: SessionVariable[]) => void;
  setFlows: (flows: Flow[]) => void;
  setQueries: (queries: Query[]) => void;
  setLastJsonMessage: (message: InboundMessage | null) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  connections: [],
  variables: [],
  flows: [],
  queries: [],
  lastJsonMessage: null,
  setConnections: (connections) => set({ connections }),
  setVariables: (variables) => set({ variables }),
  setFlows: (flows) => set({ flows }),
  setQueries: (queries) => set({ queries }),
  setLastJsonMessage: (message) => set({ lastJsonMessage: message }),
}));
