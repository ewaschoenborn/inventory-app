# Local Installation Guide

## Prerequisites

- Phone and development computer on **same WiFi network**
- **Safari browser** on iPhone (required for PWA installation)

---

## Step 1: Build Your PWA

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

---

## Step 2: Find Your Local IP Address

**On macOS:**

```bash
ipconfig getifaddr en0
```

**On Linux:**

```bash
hostname -I | awk '{print $1}'
```

**On Windows (PowerShell):**

```powershell
ipconfig
```

Look for "IPv4 Address" under your WiFi adapter (e.g., `192.168.1.100`)

---

## Step 3: Start Preview Server

```bash
npm run preview
```

The server will start on `http://0.0.0.0:4173`

Your app is now accessible at: `http://YOUR_IP:4173`

Example: `http://192.168.1.100:4173`

---

## Step 4: Install PWA on iPhone

### 4.1 Open Safari

- Launch **Safari** on your iPhone (must be Safari, not Chrome)
- Enter your local IP address and port: `http://YOUR_IP:4173`
- Wait for the app to load completely

### 4.2 Add to Home Screen

1. Tap the **Share button** (square icon with arrow pointing up) at the bottom of Safari
2. Scroll down in the share sheet
3. Tap **"Add to Home Screen"**
4. Edit the name if desired (defaults to "THW Inventory")
5. Tap **"Add"** in the top right corner

### 4.3 Launch Your PWA

- Find the app icon on your home screen
- Tap to launch
- The app should open in **fullscreen mode** (no Safari UI bars)

---

## Troubleshooting

### Problem: Can't Connect from iPhone

**Symptoms:** Safari shows "Cannot connect to server" or page won't load

**Solutions:**

1. **Verify same WiFi network**
    - iPhone and computer must be on the exact same network
    - Check WiFi name in iPhone Settings → Wi-Fi
2. **Check firewall settings**

**macOS:**

```bash
# Check if firewall is blocking
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Temporarily disable (for testing only)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

**Linux:**

```bash
# Allow port 4173
sudo ufw allow 4173

# Or temporarily disable
sudo ufw disable
```

**Windows:**

- Open Windows Defender Firewall
- Click "Allow an app through firewall"
- Add Node.js or allow port 4173 3.

alternatively: **Try hostname instead of IP**

```
http://YOUR-COMPUTER-NAME.local:4173
```

4. **Restart preview server**

```bash
# Press Ctrl+C to stop, then restart
npm run preview
```

---

### Problem: "Add to Home Screen" Missing

**Symptoms:** Share menu doesn't show "Add to Home Screen" option

**Solutions:**

1. **Must use Safari browser**
    - Chrome/Firefox on iOS won't show the option
    - Only Safari supports PWA installation on iOS
2. **Clear Safari cache**
    - iPhone Settings / Safari / Clear History and Website Data
    - Reload the page
