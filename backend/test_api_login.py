
import urllib.request
import urllib.parse
import json

def test_login():
    url = "http://localhost:8000/api/v1/auth/login/access-token"
    data = urllib.parse.urlencode({
        "username": "vihaan@example.com",
        "password": "password123"
    }).encode()
    
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    
    try:
        print(f"Sending POST request to {url}...")
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode()
            
            print(f"Status Code: {status}")
            print(f"Response Body: {body}")
            
            if status == 200:
                print("Login SUCCESS!")
            else:
                print("Login FAILED!")
                
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} {e.reason}")
        print(f"Body: {e.read().decode()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
