import subprocess
import os
import shutil
import time

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    raise RuntimeError(f"Edge executable not found at: {edge_path}")

targets = [
    {
        "name": "01_portfolio_homepage.png",
        "url": "http://localhost:8080/",
        "window": "1440,960"
    },
    {
        "name": "02_portfolio_admin_login.png",
        "url": "http://localhost:8080/?view=admin",
        "window": "1440,960"
    },
    {
        "name": "03_prometheus_targets.png",
        "url": "http://localhost:9090/targets",
        "window": "1440,960"
    },
    {
        "name": "04_prometheus_graph.png",
        "url": "http://localhost:9090/graph?g0.expr=up&g0.tab=1",
        "window": "1440,960"
    },
    {
        "name": "05_grafana_overview.png",
        "url": "http://localhost:3000/d/dtc245200250-overview?orgId=1&kiosk",
        "window": "1440,960"
    },
    {
        "name": "06_phpmyadmin.png",
        "url": "http://localhost:8088/",
        "window": "1440,960"
    }
]

docs_dir = r"c:\All\Triển khai_Thi\docs\screenshots"
root_dir = r"c:\All\Triển khai_Thi\screenshots"
os.makedirs(docs_dir, exist_ok=True)
os.makedirs(root_dir, exist_ok=True)

print("Starting automated screenshot capture using Edge headless...")

for t in targets:
    name = t["name"]
    url = t["url"]
    window = t["window"]
    dest_path = os.path.join(docs_dir, name)
    
    cmd = [
        edge_path,
        "--headless=new",
        "--disable-gpu",
        "--virtual-time-budget=3500",
        f"--window-size={window}",
        f"--screenshot={dest_path}",
        url
    ]
    
    print(f"Capturing: {name} from {url}...")
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        time.sleep(1)
        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
            size_kb = os.path.getsize(dest_path) // 1024
            print(f" -> SUCCESS: {name} ({size_kb} KB)")
            shutil.copy2(dest_path, os.path.join(root_dir, name))
        else:
            print(f" -> FAILED: {name} not created or empty. Stderr: {res.stderr[:200]}")
    except Exception as e:
        print(f" -> ERROR: {name} exception: {e}")

print("Screenshot capture completed!")
