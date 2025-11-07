import requests

# Test login endpoint directly
url = "http://localhost:8000/api/v1/auth/login/access-token"

data = {
    'username': 'vihaan.kulkarni@fitnessdemo.com',
    'password': 'trainee123'
}

print(f"Testing login to: {url}")
print(f"Email: {data['username']}")
print(f"Password: {data['password']}")
print()

try:
    response = requests.post(url, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
