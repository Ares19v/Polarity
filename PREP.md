# 🌌 Polarity Study Guide (From-Scratch)

Welcome to the beginner's learning guide for **Polarity**, a developer Mission Control suite. This guide will walk you through how mobile/web dashboards, local system daemons, subprocess command execution, and local credential security work together.

---

## 🗺️ Architectural Map

Polarity is split into two distinct tiers: a portable dashboard UI and a local computer backend daemon.

```
┌────────────────────────────────────────────────────────┐
│               Polarity React Native UI                 │
│               (Expo App / Metro 8081)                  │
├────────────────────────────────────────────────────────┤
│ 1. Telemetry Displays & Quick-Launch grid              │
│ 2. Expo SecureStore (PAT cached securely in browser)    │
│ 3. Fetches real-time CI/CD metrics from GitHub API     │
└───────────┬────────────────────────────────▲───────────┘
            │ API commands                   │ Telemetry & status
┌───────────▼────────────────────────────────┴───────────┐
│                 Polarity Local Daemon                  │
│                (FastAPI App / Port 8000)               │
├────────────────────────────────────────────────────────┤
│ 1. python main.py listening to local HTTP triggers     │
│ 2. Uses python `subprocess` to launch local .bat files │
│ 3. Triggers native `git pull`/`git clone` commands     │
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ Core Technical Concepts

### 1. What is a Local Daemon?
A **daemon** is a background process that runs on your local machine, waiting to perform tasks. In Polarity, the daemon is a lightweight **FastAPI** webserver (`daemon/main.py`).
Because your browser or phone UI is restricted from executing files on your computer's disk directly (for security reasons), it sends a web request to the daemon (e.g., `POST /launch/Agent-Smith`). The daemon receives this request, runs the commands on your disk, and reports the results back to the UI!

### 2. Subprocess Command Execution
To run terminal programs (like Git or batch files) from Python, we use the `subprocess` module:
*   **`subprocess.run()`**: Runs a command, waits for it to finish, and returns the result (used for quick, synchronous actions like `git pull`).
*   **`subprocess.Popen()`**: Launches a program in the background without waiting for it to finish (used to launch long-running servers or editors, preventing the backend from freezing).

### 3. Local Credentials Security
To show GitHub actions progress, Polarity needs a **Personal Access Token (PAT)**.
*   **How it stays safe**: The application does not send your PAT to a remote server. Instead, it saves it directly inside your mobile or emulator environment using Expo **SecureStore** (which interfaces with iOS Keychain or Android KeyStore). The UI queries GitHub directly, keeping your tokens safe!

---

## 🛠️ Step-by-Step Local Deployment

### 1. Windows One-Click Launch
*   **Install**: Double-click `INSTALL.bat`. This builds the Node modules for the Expo app and sets up the local Python virtual environment.
*   **Run**: Double-click `Run_Project.bat`. This boots both the FastAPI daemon (port 8000) and the Expo Metro Bundler (port 8081).
*   **Cleanup**: Run `UNINSTALL.bat` to clear the caches and folders.

### 2. Manual Commands Setup
If you want to run both layers individually:

**Daemon Setup:**
```bash
cd daemon
python -m venv venv
# Activate the venv
.\venv\Scripts\activate
# Install requirements
pip install -r ../requirements.txt
# Launch daemon
uvicorn main:app --host 127.0.0.1 --port 8000
```

**Expo UI Setup:**
```bash
# Install modules
npm install
# Start Metro bundler
npx expo start
```
Press **W** in the Metro CLI to open the dashboard in your web browser!
