# 🚀 Cash Health Tracker - Setup Guide

## Quick Start for Users

### Option 1: Download Pre-built Application (Recommended)

1. Go to the Releases page
2. Download the installer for your operating system:
   - **Windows**: `.exe` or `portable.exe`
   - **macOS**: `.dmg` or `.zip`
   - **Linux**: `.AppImage` or `.deb`
3. Install and run the application
4. Start tracking your cash health!

### Option 2: Build from Source

If you want to build the application yourself:

#### Prerequisites

- Node.js v16 or higher
- npm v7 or higher
- Git

#### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nevre.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm start
   ```

4. **Build for distribution**
   ```bash
   # Build for your current platform
   npm run build

   # Or build for all platforms
   npm run dist
   ```

## 📁 File Structure

Here's what each file does:

| File | Purpose |
|------|---------|
| `electron-main.js` | Electron main process - creates the app window |
| `preload.js` | Security layer between main and renderer processes |
| `cash-health-server.js` | Backend API server with Express + SQLite |
| `cash-health.html` | Frontend application (the user interface) |
| `package.json` | Project configuration and dependencies |
| `CASH-HEALTH-README.md` | Main documentation |
| `SETUP-GUIDE.md` | This file - setup instructions |

## 🔧 Configuration

### First Time Setup

1. Launch the application
2. Click **"⚙️ Weekly Target Settings"**
3. Enter your weekly sales target
4. Click **"💾 Save Target"**

### Adding Your First Entry

1. Fill in today's date (auto-populated)
2. Enter your daily sales
3. Fill in your expense percentages:
   - **Top-line Skims**: Taxes, Royalty, Rent, Advertising
   - **Operational Expenses**: COGS, Labor, R&M, Utilities, etc.
4. Enter your current cash balance
5. Click **"💾 Save Entry"**

## 🎯 Understanding the Metrics

### Cash Runway
**Formula**: `Cash Balance ÷ Daily Burn Rate`

This tells you how many days your business can operate with current cash before running out.

- 🟢 **Green** (30+ days): Healthy, you have good runway
- 🟡 **Yellow** (15-29 days): Caution, monitor closely
- 🔴 **Red** (<15 days): Critical, immediate action needed

### Sales Pace
**Formula**: `(Weekly Sales ÷ Weekly Target) × 100`

Shows if you're on track to hit your weekly sales goal.

- 🟢 **Green** (95%+): On track or ahead
- 🟡 **Yellow** (85-94%): Slightly behind
- 🔴 **Red** (<85%): Significantly behind

### Labor %
**Formula**: `Labor Costs ÷ Sales × 100`

Your labor cost as a percentage of sales.

- 🟢 **Green** (≤19%): Good, efficient staffing
- 🟡 **Yellow** (19-21%): Slightly high
- 🔴 **Red** (>21%): Too high, need to optimize

### COGS %
**Formula**: `Cost of Goods Sold ÷ Sales × 100`

Your product costs as a percentage of sales.

- 🟢 **Green** (≤37%): Good margins
- 🟡 **Yellow** (37-39%): Acceptable
- 🔴 **Red** (>39%): Margins too thin

### EBITDA %
**Formula**: `100 - (Total Skims % + Total Ops %)`

Your earnings before interest, taxes, depreciation, and amortization.

- 🟢 **Green** (≥15%): Strong profitability
- 🟡 **Yellow** (12-14%): Weak margins
- 🔴 **Red** (<12%): Not profitable enough

## 🐛 Troubleshooting

### "Cannot connect to database"

**Solution**:
1. Make sure the app is fully started (wait 3-5 seconds after launch)
2. Restart the application
3. If issue persists, delete the database file and restart:
   - Windows: `%APPDATA%/cash-health-tracker/cash-health.db`
   - macOS: `~/Library/Application Support/cash-health-tracker/cash-health.db`
   - Linux: `~/.config/cash-health-tracker/cash-health.db`

### "Port 3000 is already in use"

**Solution**:
1. Close any other applications using port 3000
2. Or change the port in both `cash-health-server.js` and `cash-health.html`

### Build fails on Windows

**Solution**:
```bash
npm install --global windows-build-tools
```

### Build fails on macOS

**Solution**:
```bash
xcode-select --install
```

### Build fails on Linux

**Solution**:
```bash
sudo apt-get install build-essential
```

## 📊 Data Management

### Backup Your Data

Your data is stored in a SQLite database file. To backup:

1. Close the application
2. Copy the database file from:
   - Windows: `%APPDATA%/cash-health-tracker/cash-health.db`
   - macOS: `~/Library/Application Support/cash-health-tracker/cash-health.db`
   - Linux: `~/.config/cash-health-tracker/cash-health.db`
3. Store the copy in a safe location

### Restore from Backup

1. Close the application
2. Replace the database file with your backup
3. Restart the application

### Export Data (Future Feature)

We plan to add CSV/JSON export functionality in a future version.

## 🔐 Security & Privacy

- **Local Only**: All data is stored locally on your computer
- **No Cloud**: No data is sent to external servers
- **No Tracking**: No analytics or tracking
- **Offline First**: Works completely offline

## 💡 Tips & Best Practices

1. **Daily Entries**: Make entries every day for accurate tracking
2. **Consistent Time**: Enter data at the same time each day
3. **Review Weekly**: Check your dashboard every Monday morning
4. **Adjust Targets**: Update your weekly target as your business grows
5. **Monitor Trends**: Watch for patterns in your KPIs

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Review the main README.md
3. Open an issue on GitHub
4. Include:
   - Your operating system and version
   - Steps to reproduce the issue
   - Error messages (if any)
   - Screenshots (if relevant)

## 📈 Future Features

Coming soon:
- [ ] Data export (CSV, JSON, PDF)
- [ ] Charts and graphs
- [ ] Multiple business tracking
- [ ] Budget forecasting
- [ ] Custom KPI thresholds
- [ ] Email/SMS alerts
- [ ] Mobile app companion

## 🤝 Contributing

Want to add features? See `CONTRIBUTING.md` (coming soon).

---

**Happy tracking! Keep your cash healthy!** 💰✨
