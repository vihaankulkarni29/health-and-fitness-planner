import urllib.request
import urllib.parse
import json
import sys

url = "http://127.0.0.1:8000/api/v1/auth/login/access-token"
data = urllib.parse.urlencode({
    "username": "vihaan@example.com",
    "password": "TestPassword123!"
}).encode()

req = urllib.request.Request(url, data=data, method="POST")
req.add_header("Content-Type", "application/x-www-form-urlencoded")

print(f"Testing login at: {url}")
try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response Body: {response.read().decode()}")
        print("✅ Login Successful!")
except urllib.error.HTTPError as e:
    print(f"❌ HTTP Error: {e.code}")
    print(f"Response Body: {e.read().decode()}")
except urllib.error.URLError as e:
    print(f"❌ Connection Error: {e.reason}")
except Exception as e:
    print(f"❌ Error: {e}")
