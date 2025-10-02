import { create } from "zustand";
import { InboundMessage } from "@/shared/types/server";
import { BlockResult, BlockResults, ContextualPage } from "../types/notebook";

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
  currentPage: ContextualPage | null;
  blockResults: BlockResults;
  selectedBlockId: string | null;
  isNavigatorVisible: boolean;
  isInspectorVisible: boolean;
  isTerminalVisible: boolean;
  setConnections: (connections: ActiveConnection[]) => void;
  setVariables: (variables: SessionVariable[]) => void;
  setFlows: (flows: Flow[]) => void;
  setQueries: (queries: Query[]) => void;
  setLastJsonMessage: (message: InboundMessage | null) => void;
  setCurrentPage: (page: ContextualPage | null) => void;
  setBlockResult: (blockId: string, result: BlockResult) => void;
  setSelectedBlockId: (blockId: string | null) => void;
  toggleNavigator: () => void;
  toggleInspector: () => void;
  toggleTerminal: () => void;
  updateBlockContent: (blockId: string, newContent: string) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  connections: [],
  variables: [],
  flows: [],
  queries: [],
  lastJsonMessage: null,
  currentPage: null, // Initialize new state
  blockResults: {}, // Initialize new state
  selectedBlockId: null, // Initialize new state
  isNavigatorVisible: true,
  isInspectorVisible: true,
  isTerminalVisible: true,
  setConnections: (connections) => set({ connections }),
  setVariables: (variables) => set({ variables }),
  setFlows: (flows) => set({ flows }),
  setQueries: (queries) => set({ queries }),
  setLastJsonMessage: (message) => set({ lastJsonMessage: message }),
  setCurrentPage: (page) => set({ currentPage: page, blockResults: {} }), // Reset results on new page
  setBlockResult: (blockId, result) =>
    set((state) => ({
      blockResults: { ...state.blockResults, [blockId]: result },
    })),
  setSelectedBlockId: (blockId) => set({ selectedBlockId: blockId }),
  toggleNavigator: () =>
    set((state) => ({ isNavigatorVisible: !state.isNavigatorVisible })),
  toggleInspector: () =>
    set((state) => ({ isInspectorVisible: !state.isInspectorVisible })),
  toggleTerminal: () =>
    set((state) => ({ isTerminalVisible: !state.isTerminalVisible })),
  updateBlockContent: (blockId, newContent) =>
    set((state) => {
      if (!state.currentPage) return {};
      const newBlocks = state.currentPage.blocks.map((block) =>
        block.id === blockId ? { ...block, content: newContent } : block
      );
      return {
        currentPage: { ...state.currentPage, blocks: newBlocks },
      };
    }),
}));
