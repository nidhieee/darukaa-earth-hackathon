import urllib.request
import json
import uuid

# 1. Register
req = urllib.request.Request('http://localhost:8000/auth/register', data=json.dumps({'email': f'test_{uuid.uuid4()}@a.com', 'password': '123'}).encode('utf-8'), headers={'Content-Type': 'application/json', 'Origin': 'http://localhost:5173'})
res = urllib.request.urlopen(req)
token = json.loads(res.read())['access_token']
headers = {'Authorization': f'Bearer {token}', 'Origin': 'http://localhost:5173', 'Content-Type': 'application/json'}

# 2. GET projects (empty)
req = urllib.request.Request('http://localhost:8000/projects', headers=headers)
print('GET /projects:', json.loads(urllib.request.urlopen(req).read()))

# 3. Create project
req = urllib.request.Request('http://localhost:8000/projects', data=json.dumps({'name': 'Test Proj'}).encode('utf-8'), headers=headers)
p = json.loads(urllib.request.urlopen(req).read())
print('Created Project:', p['name'])

# 4. Create site
geom = {'type': 'Polygon', 'coordinates': [[[0,0], [0,1], [1,1], [1,0], [0,0]]]}
req = urllib.request.Request(f'http://localhost:8000/projects/{p["id"]}/sites', data=json.dumps({'name': 'Test Site', 'geom': geom}).encode('utf-8'), headers=headers)
s = json.loads(urllib.request.urlopen(req).read())
print('Created Site:', s['name'], 'Area:', s['area_hectares'])

# 5. GET projects (with data)
req = urllib.request.Request('http://localhost:8000/projects', headers=headers)
print('GET /projects AGAIN:', len(json.loads(urllib.request.urlopen(req).read())[0]['sites']), 'sites')
print('SUCCESS!')
