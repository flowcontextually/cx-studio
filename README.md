# Contextually Studio (`cx-studio`)

Welcome to **Contextually Studio**, the official web and desktop UI for the **Contextually** platform. This repository contains the source code for a modern, interactive notebook-style interface for the `cx-shell` engine. It enables visual workflow creation, data exploration, and agent-driven automation.

This application is built with **Next.js**, **React**, **TypeScript**, **Mantine UI**, and is packaged as a cross-platform desktop application using **Electron**.

---

## 🏛️ Architecture

Contextually Studio is the "head" for the headless `cx-shell` engine. It follows a robust, decoupled architecture:

1.  **The Engine (`cx-server`):** A powerful, stateful Python backend that executes all commands and manages the user's workspace. It is a dependency of this project.
2.  **The UI (`cx-studio`):** This React/Next.js single-page application, which provides the rich, interactive user experience.
3.  **The Communication Layer:** The UI communicates with the engine in real-time over a secure, local WebSocket connection.
4.  **The Desktop Shell (Electron):** An Electron wrapper packages the UI and the engine together into a single, easy-to-install desktop application, eliminating the need for any manual setup by the end-user.

---

## 🚀 Getting Started (Development)

To run the application in a local development environment, you will need two separate terminal sessions.

### Prerequisites

- **Node.js** (v20 or later) and **npm**.
- A complete, working setup of the `cx-shell` repository.

### 1. Run the Backend Server

In your first terminal, start the `cx-server`:

```bash
# Navigate to your cx-shell repository
cd /path/to/your/cx-shell

# Run the local server
cx serve
```

The server will be running at http://127.0.0.1:8888.

### 2. Run the Frontend UI

In your second terminal, start the Next.js development server:

```bash
# Navigate to this repository (cx-studio)
cd /path/to/your/cx-studio

# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at **http://localhost:3000**. Open this URL in your web browser. The UI should connect to the cx-server automatically.

---

## 📦 Building the Production Application

To build the final, distributable desktop application, use the provided electron:build script.

**Important:** This process requires that you have already built a production version of the cx executable in the cx-shell repository.

```bash
# 1. First, ensure the backend executable is up-to-date
cd /path/to/your/cx-shell
./build.sh

# 2. Then, build the Electron application
cd /path/to/your/cx-studio
npm run electron:build
```

The final installers (.AppImage, .deb, etc.) will be located in the `cx-studio/dist/` directory.
