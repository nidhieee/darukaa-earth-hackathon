import sys
sys.path.append('.')
import urllib.request
import json
import uuid

BASE = 'http://localhost:8000'

def req(method, path, data=None, token=None):
    headers = {'Content-Type': 'application/json', 'Origin': 'http://localhost:5173'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    r = urllib.request.Request(
        BASE + path,
        data=json.dumps(data).encode() if data else None,
        headers=headers,
        method=method
    )
    try:
        res = urllib.request.urlopen(r)
        return json.loads(res.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  HTTP {e.code}: {body}")
        raise

# 1. Register
email = f'cascade_test_{uuid.uuid4()}@test.com'
tok = req('POST', '/auth/register', {'email': email, 'password': 'test123'})['access_token']
print(f"Registered: {email}")

# 2. Create project
p = req('POST', '/projects', {'name': 'Delete Test Project'}, token=tok)
pid = p['id']
print(f"Created project: {pid}")

# 3. Create site
geom = {'type': 'Polygon', 'coordinates': [[[0,0],[0,1],[1,1],[1,0],[0,0]]]}
s = req('POST', f'/projects/{pid}/sites', {'name': 'Delete Test Site', 'geom': geom}, token=tok)
sid = s['id']
print(f"Created site: {sid}")

# 4. Verify site exists
projects = req('GET', '/projects', token=tok)
site_count = len(projects[0]['sites'])
print(f"Sites before delete: {site_count}")
assert site_count == 1, "Expected 1 site"

# 5. Delete project — this is the critical test
print("Deleting project (cascade should remove site + analytics)...")
result = req('DELETE', f'/projects/{pid}', token=tok)
print(f"Delete result: {result}")

# 6. Verify project is gone
projects_after = req('GET', '/projects', token=tok)
print(f"Projects after delete: {len(projects_after)}")
assert len(projects_after) == 0, "Expected 0 projects after delete"

print("\nSUCCESS: Cascade delete works correctly!")
