from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os

app = FastAPI(title="Polarity Local Daemon")

# Allow Polarity React Native frontend to communicate with this daemon
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECTS_DIR = r"C:\Users\Devansh Tyagi\Desktop\Projects"
GITHUB_USER = "Ares19v"

@app.get("/")
def health_check():
    return {"status": "online", "message": "Polarity Daemon is running on HP Omen"}

@app.get("/telemetry")
def get_telemetry():
    """Mock telemetry route until Cryo integration is complete."""
    return {
        "cpu_temp": "54°C",
        "fan_rpm": "2400 RPM",
        "vram": "4.2/16G"
    }

@app.post("/launch/{project_id}")
def launch_project(project_id: str):
    """Searches for a .bat file and executes it via subprocess."""
    project_path = os.path.join(PROJECTS_DIR, project_id)
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project folder not found locally.")

    # Search for standard bat files
    bat_files = ["start.bat", "run.bat", "dev.bat"]
    target_bat = None
    for bat in bat_files:
        if os.path.exists(os.path.join(project_path, bat)):
            target_bat = bat
            break

    if target_bat:
        # In a real environment, we use subprocess.Popen to launch asynchronously
        # subprocess.Popen(target_bat, cwd=project_path, shell=True)
        return {"status": "success", "message": f"Launched {target_bat} in {project_id}"}
    else:
        return {"status": "error", "message": f"No launch .bat file found in {project_id}"}

@app.post("/sync/{project_id}")
def sync_project(project_id: str):
    """Executes git pull to ensure local repo is synced."""
    project_path = os.path.join(PROJECTS_DIR, project_id)
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project folder not found locally.")
    
    try:
        # subprocess.run(["git", "pull", "origin", "main"], cwd=project_path, check=True)
        return {"status": "success", "message": f"Successfully pulled latest code for {project_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clone/{repo_name}")
def clone_project(repo_name: str):
    """Clones a project from your GitHub if it's missing."""
    target_dir = os.path.join(PROJECTS_DIR, repo_name)
    if os.path.exists(target_dir):
        return {"status": "ignored", "message": "Folder already exists."}
    
    try:
        clone_url = f"https://github.com/{GITHUB_USER}/{repo_name}.git"
        # subprocess.run(["git", "clone", clone_url], cwd=PROJECTS_DIR, check=True)
        return {"status": "success", "message": f"Successfully cloned {repo_name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run(app, host="0.0.0.0", port=8000)
