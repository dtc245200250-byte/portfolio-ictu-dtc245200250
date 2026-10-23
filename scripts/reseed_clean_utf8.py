import subprocess
import os

print("=== RESEEDING MYSQL WITH PRISTINE UTF-8 ENCODING ===")

# Read init.sql
sql_path = r"c:\All\Triển khai_Thi\database\init.sql"
with open(sql_path, "r", encoding="utf-8") as f:
    sql_content = f.read()

# Add DROP DATABASE IF EXISTS to ensure completely fresh tables
full_script = """
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
DROP DATABASE IF EXISTS `portfolio_db`;
CREATE DATABASE `portfolio_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `portfolio_db`;
""" + sql_content

cmd = [
    "docker", "exec", "-i", "portfolio_mysql",
    "mysql",
    "-uportfolio_user",
    "-pPortfolioSecurePass2026!",
    "--default-character-set=utf8mb4"
]

print("Executing SQL script via docker exec...")
proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
stdout, stderr = proc.communicate(full_script.encode("utf-8"))

print("Return code:", proc.returncode)
if stderr:
    print("Stderr:", stderr.decode("utf-8", errors="ignore")[:300])

# Verify data in database
check_cmd = [
    "docker", "exec", "portfolio_mysql",
    "mysql",
    "-uportfolio_user",
    "-pPortfolioSecurePass2026!",
    "--default-character-set=utf8mb4",
    "portfolio_db",
    "-e", "SELECT full_name, HEX(full_name), bio FROM profile;"
]
verify_proc = subprocess.run(check_cmd, capture_output=True, text=True, encoding="utf-8")
print("\n=== VERIFICATION RESULT IN MYSQL ===")
print(verify_proc.stdout)
