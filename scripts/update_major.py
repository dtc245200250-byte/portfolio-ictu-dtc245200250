import subprocess

sql = """SET NAMES 'utf8mb4';
UPDATE education 
SET major = 'Công nghệ Thông tin',
    description = 'Đào tạo toàn diện về kiến trúc hệ thống, phát triển ứng dụng Web, quản trị hạ tầng phần mềm với Docker, cơ sở dữ liệu quan hệ và an toàn thông tin.'
WHERE id = 1;
"""

cmd = [
    "docker", "exec", "-i", "portfolio_mysql",
    "mysql",
    "-uportfolio_user",
    "-pPortfolioSecurePass2026!",
    "--default-character-set=utf8mb4",
    "portfolio_db"
]

p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
out, err = p.communicate(sql.encode('utf-8'))
print("Return code:", p.returncode)
if err:
    print("Stderr:", err.decode('utf-8', errors='ignore'))

# Verify
verify_cmd = [
    "docker", "exec", "portfolio_mysql",
    "mysql",
    "-uportfolio_user",
    "-pPortfolioSecurePass2026!",
    "--default-character-set=utf8mb4",
    "portfolio_db",
    "-e", "SELECT id, institution, degree, major FROM education;"
]
res = subprocess.run(verify_cmd, capture_output=True, text=True, encoding='utf-8')
print("Verification:\n", res.stdout)
