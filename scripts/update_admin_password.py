import subprocess
import bcrypt

password = "AdminSecurePassword2026!"
salt = bcrypt.gensalt(10)
hashed = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

print("Generated bcrypt hash:", hashed)
print("Verifying python check:", bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8')))

# Update database
sql = f"UPDATE admins SET password_hash = '{hashed}' WHERE username = 'admin';"
cmd = [
    "docker", "exec", "-i", "portfolio_mysql",
    "mysql",
    "-uportfolio_user",
    "-pPortfolioSecurePass2026!",
    "portfolio_db"
]

proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
stdout, stderr = proc.communicate(sql.encode('utf-8'))
print("Update return code:", proc.returncode)

# Test via backend node script
test_node_cmd = [
    "docker", "exec", "portfolio_backend",
    "node", "-e",
    f"""
    const bcrypt = require('bcryptjs');
    const mysql = require('mysql2/promise');
    (async () => {{
        const p = mysql.createPool({{
            host: 'mysql',
            user: 'portfolio_user',
            password: 'PortfolioSecurePass2026!',
            database: 'portfolio_db'
        }});
        const [rows] = await p.query('SELECT password_hash FROM admins WHERE username = "admin"');
        const dbHash = rows[0].password_hash;
        console.log('Database Hash:', dbHash);
        const match = await bcrypt.compare('{password}', dbHash);
        console.log('Node.js bcrypt.compare result:', match);
        process.exit(0);
    }})();
    """
]

res = subprocess.run(test_node_cmd, capture_output=True, text=True)
print("Node test output:")
print(res.stdout)
print("Node test stderr:", res.stderr)
