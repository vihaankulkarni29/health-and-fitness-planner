# 🌐 Getting Your App Online - Quick Guide

## Option 1: LocalTunnel (Fastest - 2 minutes)

### Step 1: Install LocalTunnel
```powershell
npm install -g localtunnel
```

### Step 2: Start Your Servers
```powershell
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Step 3: Create Tunnels
```powershell
# Terminal 3 - Frontend Tunnel
lt --port 3000

# Terminal 4 - Backend Tunnel
lt --port 8000
```

You'll get URLs like:
- Frontend: `https://random-words-here.loca.lt`
- Backend: `https://other-words-here.loca.lt`

### Step 4: Update CORS (Backend)

Edit `backend/.env`:
```
CORS_ORIGINS_STR=http://localhost:3000,https://YOUR_FRONTEND_TUNNEL.loca.lt,https://YOUR_BACKEND_TUNNEL.loca.lt
```

### Step 5: Update API URL (Frontend)

Create `frontend/.env`:
```
REACT_APP_API_URL=https://YOUR_BACKEND_TUNNEL.loca.lt/api/v1
```

### Step 6: Restart Servers
Restart both backend and frontend to pick up new environment variables.

### Step 7: Access Your App
Open the frontend tunnel URL in your browser!

**⚠️ Note:** LocalTunnel URLs change each time you restart. For persistent URLs, use Option 2.

---

## Option 2: ngrok (Better - Persistent URLs with Account)

### Step 1: Install ngrok
1. Download from https://ngrok.com/download
2. Sign up for free account
3. Run: `ngrok config add-authtoken YOUR_TOKEN`

### Step 2: Create Tunnels
```powershell
# Terminal 1 - Backend tunnel
ngrok http 8000

# Terminal 2 - Frontend tunnel  
ngrok http 3000
```

You'll get stable URLs (that persist across restarts with paid plan):
- Frontend: `https://abc123.ngrok-free.app`
- Backend: `https://def456.ngrok-free.app`

### Step 3: Update Configuration
Same as LocalTunnel steps 4-6.

---

## Option 3: Deploy to Cloud (Production - 30 minutes)

### Vercel (Frontend Only - FREE)
```powershell
cd frontend
npm install -g vercel
vercel --prod
```

### Railway/Render (Full Stack - FREE tier available)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Deploy both frontend and backend

---

## Option 4: Network Access (Same WiFi - Instant!)

### Find Your Local IP
```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., `192.168.1.100`)

### Update Frontend API URL
Create `frontend/.env`:
```
REACT_APP_API_URL=http://YOUR_IP:8000/api/v1
```

### Update Backend CORS
Edit `backend/.env`:
```
CORS_ORIGINS_STR=http://YOUR_IP:3000,http://localhost:3000
```

### Access From Any Device on Same Network
- Frontend: `http://YOUR_IP:3000`
- Backend: `http://YOUR_IP:8000`

**Perfect for:** Testing on mobile, showing to investors in same room

---

## 🎯 Recommended for Investor Demo

**Quick Demo (Today):** Use Option 4 (Network Access) if meeting in person

**Remote Demo:** Use Option 2 (ngrok) for stable URLs

**Production Demo:** Use Option 3 (Vercel + Railway)

---

## Current Setup (Already Running!)

Based on your current tunnels:

### Frontend
🌐 **Public URL:** `https://old-ducks-brush.loca.lt`
📱 **Local:** `http://localhost:3000`

### Backend  
🌐 **Public URL:** `https://clean-bars-sip.loca.lt`
📱 **Local:** `http://localhost:8000`

### To Make It Work:

1. **Update `backend/.env`:**
```
CORS_ORIGINS_STR=http://localhost:3000,https://old-ducks-brush.loca.lt,https://clean-bars-sip.loca.lt
```

2. **Create `frontend/.env`:**
```
REACT_APP_API_URL=https://clean-bars-sip.loca.lt/api/v1
```

3. **Restart both servers** (Ctrl+C then restart)

4. **Open:** https://old-ducks-brush.loca.lt

5. **Login with:**
   - Email: `vihaan.kulkarni@fitnessdemo.com`
   - Password: `trainee123`

---

## Troubleshooting

### "This site can't be reached"
- Check if both tunnels are running (`lt --port 3000` and `lt --port 8000`)
- Verify servers are running (backend on :8000, frontend on :3000)

### CORS Errors
- Update `backend/.env` with tunnel URLs
- Restart backend server

### "Network Error" on Login
- Check `frontend/.env` has correct backend tunnel URL
- Restart frontend server (npm start)
- Clear browser cache (Ctrl+Shift+R)

### LocalTunnel "Too many requests"
- Wait a few minutes or switch to ngrok

---

**Ready to go live? Just follow the steps above! 🚀**
