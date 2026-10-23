import subprocess
import os
import shutil
from PIL import Image, ImageDraw, ImageFont

def render_terminal(title, text_content, output_path, width=1280, height=720):
    bg_color = (24, 24, 27)        # zinc-900
    card_bg = (15, 23, 42)         # slate-900
    header_bg = (30, 41, 59)       # slate-800
    text_color = (226, 232, 240)    # slate-200
    cyan_color = (56, 189, 248)    # sky-400
    green_color = (74, 222, 128)   # green-400
    dim_color = (148, 163, 184)    # slate-400

    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Card background
    draw.rounded_rectangle([(30, 30), (width - 30, height - 30)], radius=12, fill=card_bg, outline=(51, 65, 85), width=2)

    # Header bar
    draw.rounded_rectangle([(30, 30), (width - 30, 80)], radius=12, fill=header_bg)
    draw.rectangle([(30, 65), (width - 30, 80)], fill=header_bg) # flatten bottom corners

    # Window controls (macOS style dots)
    draw.ellipse([(50, 48), (64, 62)], fill=(239, 68, 68))
    draw.ellipse([(72, 48), (86, 62)], fill=(245, 158, 11))
    draw.ellipse([(94, 48), (108, 62)], fill=(34, 197, 94))

    # Font setup
    try:
        font = ImageFont.truetype("consola.ttf", 15)
        title_font = ImageFont.truetype("arial.ttf", 14)
    except:
        font = ImageFont.load_default()
        title_font = font

    # Title
    draw.text((130, 46), title, font=title_font, fill=(203, 213, 225))

    # Text lines
    lines = text_content.strip().split('\n')
    y = 100
    for line in lines:
        if y > height - 60:
            break
        # Color coding
        line_color = text_color
        if "portfolio_" in line or "Up " in line or "Healthy" in line or "SUCCESS" in line:
            line_color = green_color
        elif "====" in line or "[QUERY]" in line:
            line_color = cyan_color
        elif line.startswith("CONTAINER ID") or line.startswith("NAME"):
            line_color = (253, 224, 71) # yellow
        elif "info:" in line or "GET " in line:
            line_color = dim_color

        draw.text((50, y), line, font=font, fill=line_color)
        y += 24

    img.save(output_path, "PNG")
    print(f"Generated terminal screenshot: {output_path}")

# 1. Capture docker compose ps
try:
    ps_output = subprocess.check_output(["docker", "compose", "ps"], text=True, cwd=r"c:\All\Triển khai_Thi")
except Exception as e:
    ps_output = f"Error running docker compose ps: {e}"

docs_dir = r"c:\All\Triển khai_Thi\docs\screenshots"
root_dir = r"c:\All\Triển khai_Thi\screenshots"

t1_path = os.path.join(docs_dir, "07_docker_compose_ps.png")
render_terminal(
    "PowerShell - Đề tài 13: Trạng thái 13 Containers Docker (Phan Quang Tùng - DTC245200250)",
    ps_output,
    t1_path,
    width=1380,
    height=580
)
shutil.copy2(t1_path, os.path.join(root_dir, "07_docker_compose_ps.png"))

# 2. Capture Loki LogQL validated queries
try:
    logql_output = subprocess.check_output(["python", "scripts/test-logql.py"], text=True, cwd=r"c:\All\Triển khai_Thi")
except Exception as e:
    logql_output = f"Error running test-logql.py: {e}"

t2_path = os.path.join(docs_dir, "08_loki_logql_validated.png")
render_terminal(
    "Loki LogQL Engine - Xác thực 3 truy vấn Log tập trung (Promtail -> Loki -> Grafana)",
    logql_output,
    t2_path,
    width=1380,
    height=640
)
shutil.copy2(t2_path, os.path.join(root_dir, "08_loki_logql_validated.png"))

print("All terminal evidence screenshots successfully created!")
