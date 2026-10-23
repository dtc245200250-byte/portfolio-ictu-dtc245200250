import urllib.request
import urllib.parse
import json
import sys

LOKI_URL = "http://localhost:3100"

queries = [
    '{job="portfolio_nginx"}',
    '{job="portfolio_nginx"} |~ "(GET|POST)"',
    '{job="portfolio_backend"}'
]

print("=== TESTING LOKI LOGQL QUERIES ===")

for q in queries:
    params = urllib.parse.urlencode({'query': q, 'limit': 5})
    url = f"{LOKI_URL}/loki/api/v1/query_range?{params}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            status = data.get('status', 'unknown')
            result_type = data.get('data', {}).get('resultType', '')
            results = data.get('data', {}).get('result', [])
            total_entries = sum(len(r.get('values', [])) for r in results)
            print(f"\n[QUERY] {q}")
            print(f"Status: {status} | Type: {result_type} | Stream count: {len(results)} | Total log lines: {total_entries}")
            if results:
                for stream in results[:2]:
                    stream_labels = stream.get('stream', {})
                    values = stream.get('values', [])
                    print(f"  Stream labels: {stream_labels}")
                    for ts, line in values[:3]:
                        print(f"    - [{ts}] {line[:120]}")
            else:
                print("  (No logs returned yet for current time window - generating traffic or checking labels...)")
    except Exception as e:
        print(f"[ERROR] Query '{q}' failed: {e}")

print("\n=== LOKI QUERY TEST COMPLETE ===")
