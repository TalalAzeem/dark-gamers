# 🎮 Game Cheat Bot – Botpress Import Guide

A fully conversational Botpress chatbot that helps gamers find cheats and cheat codes for popular games.

---

## 📦 How to Import Into Botpress

### Option A – Import the `.tgz` bundle (Botpress v12 / self-hosted)
1. Open your Botpress admin panel
2. Go to **Bots** → **Import Bot**
3. Select the `.tgz` file and upload it

### Option B – Botpress Cloud (v3)
1. In Botpress Studio, click the **Botpress icon** (top-left)
2. Select **Import / Export** → **Import**
3. Upload the `.bpz` file

### Option C – Manual Setup (if importing flows individually)
1. Create a new bot in Botpress Studio
2. In the **Flows** section, import each `.flow.json` file from the `/flows` folder
3. Set `main.flow.json` as the **Main Flow**
4. Upload the intent files from `/intents`

---

## 🤖 What the Bot Does

1. **Greets the user** and asks which game they want cheats for
2. **Recognizes the game** (no need for exact spelling)
3. **Asks what cheat they want**, or offers to show ALL cheats
4. **Returns the specific cheat** with full button combinations / console commands
5. **Loops back** to let users search more cheats or switch games
6. **Handles unknown games** by pointing to trusted cheat websites

---

## 🎮 Supported Games (Built-In)

| Game | Platform |
|------|----------|
| GTA V | PC, PS4/5, Xbox |
| GTA San Andreas | PC |
| Red Dead Redemption 2 | PS4/5, Xbox, PC |
| The Sims 4 | PC |
| Minecraft | PC (Java & Bedrock) |
| Cyberpunk 2077 | PC (via CET mod) |
| ARK: Survival Evolved | PC |
| Payday 2 | PC |
| Any other game | Redirects to cheat sites |

---

## 💬 Example Conversations

**User:** GTA V  
**Bot:** What cheat do you want? (health, weapons, cars, all cheats...)  
**User:** infinite health  
**Bot:** 💊 GTA V – Invincibility: PC: TURTLE | PS4: Circle, LB...

**User:** Minecraft  
**Bot:** What cheat do you want?  
**User:** all cheats  
**Bot:** ⛏️ Minecraft – ALL COMMANDS/CHEATS: [full list]

---

## 📁 File Structure

```
botpress-cheats-bot/
├── bot.config.json              # Bot configuration
├── flows/
│   ├── main.flow.json           # Main conversation flow
│   ├── give-all-cheats.flow.json    # Shows all cheats for a game
│   └── give-specific-cheat.flow.json  # Targeted cheat lookup
├── intents/
│   ├── ask-for-cheats.json      # Training data for cheat requests
│   └── all-cheats.json          # Training data for 'all cheats'
└── README.md
```

---

## ➕ Adding More Games

To add a new game, open `give-all-cheats.flow.json` and `give-specific-cheat.flow.json` and:
1. Add a new condition node checking `user.gameName.toLowerCase().includes('your game')`
2. Create a new node with the cheat list in `onEnter` → `say()`
3. Point it to `#exit` when done

---

*Built for Botpress v12+ and Botpress Cloud v3*
