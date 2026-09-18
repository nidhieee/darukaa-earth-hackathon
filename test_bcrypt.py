import sys
sys.path.append('.')
from api.auth.utils import verify_password, hash_password

# Test 1: hash + verify round trip
h = hash_password('testpassword')
assert verify_password('testpassword', h), "FAIL: round trip failed"
assert not verify_password('wrongpassword', h), "FAIL: wrong password should not verify"
print("PASS: round trip hash/verify works")

# Test 2: verify existing demo user password against DB hash
import urllib.request, json

req = urllib.request.Request(
    'http://localhost:8000/auth/login',
    data=json.dumps({'email': 'demo@darukaa.earth', 'password': 'demo1234'}).encode('utf-8'),
    headers={'Content-Type': 'application/json', 'Origin': 'http://localhost:5173'}
)
try:
    res = urllib.request.urlopen(req)
    data = json.loads(res.read())
    assert 'access_token' in data, f"FAIL: no access_token in response: {data}"
    print("PASS: demo@darukaa.earth login succeeded with existing passlib-created hash")
    print(f"  token starts with: {data['access_token'][:20]}...")
except Exception as e:
    print(f"FAIL: login request failed: {e}")
    try:
        print(e.read().decode())
    except Exception:
        pass
