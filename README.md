# 🌌 Polarity

> **A centralized developer Mission Control suite featuring a dual-theme UI, real-time GitHub CI/CD tracking, and a local Python daemon for orchestrating AI/ML edge nodes.**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

Polarity acts as the ultimate operations center for local software development. It bridges the gap between your physical machine and your development environment by utilizing a lightweight Python `FastAPI` daemon that allows a beautiful React Native (Expo) dashboard to execute local terminal commands, launch `.bat` scripts, clone repositories, and synchronize with GitHub CI/CD.

---

## ✨ Key Features

1. **Dual-Theme Aesthetic Engine**
   - **Minimalist Mode (Matte & Mint):** An ultra-clean, data-dense interface utilizing matte obsidian backgrounds, thin vector borders, and sophisticated mint-teal accents.
   - **Cyberpunk Mode (Neon & Violet):** A highly ambient, visually stunning tactical interface leveraging deep purple glassmorphism, hot-pink/cyan HSL glows, and high-radius shadows.
2. **Local Python Daemon (`daemon/`)**
   - A lightweight `FastAPI` server that acts as a bridge. It allows the Polarity mobile/web UI to execute local `git pull` commands, launch local `.bat` scripts, and clone new repositories from GitHub directly to your disk.
3. **Logistics & Pipeline Health**
   - Integrates directly with the GitHub API to fetch real-time CI/CD workflow runs.
   - Securely stores your Personal Access Token (PAT) locally on your device via Expo `SecureStore`.
4. **Operations Center Dashboard**
   - Features a mock hardware telemetry readout (CPU, FAN, VRAM) and a live market sentiment NLP ticker tape.
   - Quick-launch grid for instant access to flagship AI/ML edge nodes.

---

## 🏗️ Architecture

Polarity is split into two interconnected layers:
1. **Frontend (Expo/React Native):** The UI dashboard. It runs in the browser or on an Android/iOS emulator.
2. **Backend Daemon (Python/FastAPI):** A local system server (`daemon/main.py`) that runs on `localhost:8000`. It listens for commands from the frontend to trigger local subprocesses.

---

## 🚀 Quick Start (Local Execution)

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Android Studio (optional, for emulator testing)

### Installation
You can instantly install all dependencies by running the provided batch script:
```bash
INSTALL.bat
```

### Launching Mission Control
To boot both the Python Daemon and the Expo React Native UI simultaneously, run:
```bash
Run_Project.bat
```
This will automatically start the FastAPI server on port `8000` and launch the Expo Metro bundler on port `8081`.

---

## 🐳 Docker Deployment (Daemon)

To run the Python Daemon in an isolated container:
```bash
docker-compose up --build -d
```
The daemon will be accessible at `http://localhost:8000`.

---

## 🧹 Maintenance

To completely clean the project cache (removes `node_modules`, `__pycache__`, and flushes Expo):
```bash
UNINSTALL.bat
```

---

## 📷 Vision Edge & Mobile Camera HUD
- **Universal Live Camera HUD (`src/components/CameraViewport.js`):** Stream your mobile device's camera into local computer vision inference models.
- **Dynamic Tactical Viewfinder:** Real-time targeting brackets, center reticle crosshair, animated laser sweep, and latency monitors ($28\text{ms} - 45\text{ms}$).
- **Built-in Model Support:** Live HUD overlays for Industrial PCB defect scanning (`YOLOv11s-PCB`), tactical flight identification (`WingID`), and eye fatigue monitoring (`Blink`).

---

## 🛡️ Security
Your GitHub Personal Access Token (PAT) is never transmitted to any third-party servers. It is stored securely on your local device using Expo's secure storage mechanisms and is only used to directly query the `api.github.com` endpoints.

---

*Engineered for high-performance development and edge vision environments.*