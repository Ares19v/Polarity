<div align="center">

# ?? Polarity
### Centralized Developer Mission Control & Local AI Edge Daemon Orchestrator

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51+-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>A unified cross-platform command center (iOS / Android / Web) with dual-theme HUD, real-time GitHub CI/CD build status tracking, and a background Python edge daemon for managing local AI nodes and machine telemetry.</b>
</p>

</div>

---

## ?? Overview

**Polarity** combines an ultra-slick React Native / Expo mobile & desktop interface with a local FastAPI system daemon. Designed for developers managing multiple AI/ML repositories, training runs, and containerized services, Polarity gives you an instant birds-eye view of your development infrastructure from your workstation or mobile device.

---

## ? Key Features

- **Cross-Platform HUD (Mobile, Tablet, Desktop Web)**: Built with React Native and Expo for fluid native 60fps animations, customizable widget grids, and haptic feedback.
- **Dual-Theme High-Contrast System**: Instant toggle between high-tech Cyberpunk Dark and Clean Minimalist Light interfaces.
- **Local AI Daemon (`daemon/main.py`)**: Lightweight background service monitoring local GPU thermals, VRAM consumption, Ollama/llama.cpp inference nodes, and Docker containers.
- **Live GitHub CI/CD & Repository Tracker**: Embedded GitHub API polling for commit histories, workflow run statuses, and automated build alerts.
- **Automated Windows Service Scripts**: One-click installation and background execution via `INSTALL.bat` and `Run_Project.bat`.

---

## ??? Architecture & Tech Stack

```
Polarity/
??? daemon/                 # Python FastAPI background orchestration daemon
?   ??? main.py             # System telemetry & local AI node monitoring API
??? src/                    # React Native Expo frontend application
?   ??? components/         # Mission control cards, HUD gauges, telemetry charts
?   ??? navigation/         # Tab & stack navigation handlers
?   ??? services/           # GitHub API & daemon socket clients
??? assets/                 # Adaptive icons, splash screens, and HUD graphics
??? App.js                  # Application entry point
??? app.json                # Expo configuration and permissions
??? requirements.txt        # Daemon Python dependencies
??? INSTALL.bat             # Quick environment setup script
??? Run_Project.bat         # Automated daemon + UI launcher
??? package.json            # Expo dependencies
```

---

## ?? Quick Start

### 1. Start the Local Python Telemetry Daemon

```bash
# In the project root
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python daemon/main.py
```
*The daemon starts on `http://127.0.0.1:8000`.*

### 2. Start the Expo Frontend Application

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start
```
- Press `w` to launch the **Web interface** in your browser.
- Scan the QR code with the **Expo Go app** on iOS or Android for native mobile testing.

---

## ?? License

Distributed under the MIT License. See `LICENSE` for details.
