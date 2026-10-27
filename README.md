# 🌪️ Storm Survival — Tamil Nadu Disaster Preparedness & Coastal Defense

An interactive 2D disaster education simulation and superhero survival game designed to run seamlessly on **both Laptops (PC/Mac/Linux)** and **Mobile Devices (Android/iOS)**.

---

## 🚀 Key Features

- **Dual-Device Ergonomics**:
  - **💻 Laptop / Desktop Mode**: Full keyboard hotkeys (`WASD` / `Arrow Keys` for movement, `Shift` for sprint, `1-5` for hotbar items, `E`/`Space` to interact, `Q` for hero ability, `B` for Rebuild Home, `H` for Home Appliances, `C` to switch heroes, `Tab` for controls guide, `J` to toggle on-screen joystick, `M` to mute, `F11` for fullscreen). Smooth mouse click-to-move across the island.
  - **📱 Mobile / Tablet Mode**: Touch Virtual Joystick with directional arrows, on-screen Action & Claim Keys (`○ □ △ ×`), quick-use item buttons, and responsive landscape & portrait layouts.
- **50-Level Academy Curriculum**: Comprehensive Tamil Nadu disaster science, meteorological cyclone tracking, flood safety, survival mathematics, and emergency circuits.
- **Home Reconstruction Workshop**: Gather Wood, Rope, Lights, Electronics, and Bricks through challenges to rebuild your ruined coastal home across 5 stages up to a fortified Storm Sanctuary.
- **Interactive Home Living Room & Smart Appliances**: Operate the TV (weather broadcasts & education channels), refrigerator (cold water & snacks), lights, and sofa to recharge energy.
- **Dynamic 5-Level Cyclones**: Real-time atmospheric gale wind physics, flying storm debris with superhero shield deflections, and evacuation rescue sequences.
- **Complete Student Cadet Profile**:
  - Customizable username, grade level, subject specialty, and gender.
  - Hero defender selection (Spider-Man, Captain America, Iron Man, Thor, Hulk, Batman, etc.).
  - Custom avatar upload support (PNG/JPG/WebP up to 2MB) and avatar emoji presets.
  - Complete stat progression: XP, Coins, Diamonds, Rank tiers (Bronze → Earth Legend), and Unlocked Badges.
  - Local & server-side save state persistence.

---

## 🕹️ Controls Guide

| Action | Laptop / Desktop Keys | Mobile Touch |
| :--- | :--- | :--- |
| **Move Up / Down / Left / Right** | `W`/`S`/`A`/`D` or `Arrow Keys` | Virtual Joystick (Bottom Left) |
| **Click to Move** | Click anywhere on Canvas | Tap on Canvas |
| **Sprint** | Hold `Shift` | Joystick Outer Ring Drag |
| **Interact / Start Quiz / Claim** | `E` or `Space` or `Enter` | `○` Claim Button (Bottom Right) |
| **Use Super Power** | `Q` | `△` Action Button or `⚡` |
| **Eat Food** | `1` | `🍗` Hotbar Slot |
| **Drink Water** | `2` | `💧` Hotbar Slot |
| **Recharge Battery** | `3` | `🔋` Hotbar Slot |
| **First Aid Medkit** | `4` | `🩹` Hotbar Slot |
| **Reinforce Shelter** | `5` or `R` (inside shelter) | `□` Action Button |
| **Rebuild Home Workshop** | `B` or Header Button | Header `Rebuild Home` Button |
| **Home Living Room & TV** | `H` or Header Button | Header `Appliances` Button |
| **Switch Superhero** | `C` or Header Button | Header Hero Badge |
| **Toggle Joystick Overlay** | `J` or Header Button | Top Header `🎮` Toggle |
| **Toggle Fullscreen** | `F11` or Fullscreen Icon | Top Fullscreen Button |
| **Mute / Unmute Audio** | `M` or Speaker Icon | Top Audio Icon |
| **Controls Guide Modal** | `Tab` or Slider Icon | Top Guide Button |

---

## 💻 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Frontend Dev Server** (runs on port 3000):
   ```bash
   npm run dev
   ```

3. **Start Backend Server** (optional Gemini AI tutor & server save on port 5000):
   ```bash
   npm run server
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended & Easiest)
1. Push your repository to GitHub (see instructions below).
2. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New Project"** -> **"Import Git Repository"**.
4. Select your **Storm-Survival** repository.
5. Vercel will automatically detect `Vite` framework settings (Build command: `npm run build`, Output directory: `dist`).
6. *(Optional)* In **Environment Variables**, add `GEMINI_API_KEY` if you want AI hint generation.
7. Click **"Deploy"**! Your game will be live with a free `.vercel.app` HTTPS domain in under 1 minute.

### Option 2: Deploy via Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to link and deploy to your Vercel account.

---

## 🐙 Push to GitHub

To push this project to your GitHub account:

1. Create a new empty repository on [github.com/new](https://github.com/new) named `Storm-Survival` (do not initialize with README, as we already have one).
2. In your terminal, run:
   ```bash
   git add .
   git commit -m "feat: optimize for laptop and mobile, add vercel deployment config"
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/Storm-Survival.git
   git branch -M main
   git push -u origin main
   ```
*(Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username).*
