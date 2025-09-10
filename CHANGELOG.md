# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Placeholder for future changes.

## [0.1.0] - 2025-09-10

### Added

- **Initial Project Scaffolding:** Created the `cx-studio` project using Next.js 15 with TypeScript and Tailwind CSS.
- **Core UI Layout:** Implemented the foundational three-pane, resizable IDE layout using Mantine UI and `react-resizable-panels`.
- **WebSocket Backend Integration:** Established a robust, real-time WebSocket connection to the `cx-server` engine, managed by a dedicated `WebSocketProvider`.
- **Dynamic Workspace Sidebar:** Built a sidebar component that displays the user's workspace assets (Connections, Variables, Flows, Queries) and updates in real-time based on server events.
- **Interactive Notebook Interface:** Created the core "notebook" UI, allowing users to execute `cx` commands in cells and view the output.
- **Rich Output Rendering:** Implemented a modular `OutputViewer` with specialized renderers for:
  - Hierarchical tree views (`TreeOutput`) for `list` commands.
  - Interactive data grids (`TableOutput`) for tabular data.
  - Syntax-highlighted JSON (`JsonOutput`) for all other structured data.
- **Client-Side State Management:** Integrated `zustand` to create a central store (`useSessionStore`) for managing the UI's session state, ensuring a consistent and predictable data flow.
- **Type Safety:** Established initial TypeScript types for server communication (`server.ts`) and client-side models (`commands.ts`) to ensure code quality and robustness.
