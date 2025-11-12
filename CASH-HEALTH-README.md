# 💰 Cash Health Tracker - Electron Desktop App

A comprehensive desktop application for tracking business cash flow and financial health metrics. Built with Electron, Express, and SQLite.

## 🌟 Features

- **Real-time Cash Health Monitoring**: Track your business's financial health with visual indicators
- **Daily Entry Tracking**: Record daily sales and expense percentages
- **Cash Runway Calculator**: Know how many days your business can operate with current cash
- **KPI Dashboard**: Monitor key performance indicators including:
  - Sales Pace vs Target
  - Labor & COGS percentages
  - EBITDA margins
  - Cash runway status
- **Dark Mode**: Built-in dark/light theme toggle
- **Persistent Storage**: All data stored locally in SQLite database
- **Cross-platform**: Works on Windows, macOS, and Linux

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cash-health-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

## 🚀 Usage

### Running in Development Mode

```bash
npm run dev
```

This runs the app with developer tools enabled.

### Running Server Only

If you want to run just the backend server for testing:

```bash
npm run server
```

Then open `cash-health.html` in a web browser.

## 📊 How to Use the App

### 1. Configure Weekly Target

- Click the **"⚙️ Weekly Target Settings"** button
- Set your weekly sales target (e.g., $204,213.29)
- Click **"💾 Save Target"**

### 2. Add Daily Entries

Fill out the daily form with:
- **Date**: Select the date for this entry
- **Daily Sales**: Total sales for the day
- **Top-line Skims**: Percentages for Taxes, Royalty, Rent, Advertising
- **Operational Expenses**: COGS, Labor, R&M, Utilities, etc.
- **Cash Balance**: Your current cash on hand

Click **"💾 Save Entry"** to record.

### 3. Monitor Dashboard

The dashboard automatically updates to show:
- **This Week's Performance**: Weekly sales vs target
- **Cash Position**: Days of runway remaining
- **KPI Status**: Traffic light indicators for key metrics

### 4. Understanding the Traffic Lights

- 🟢 **Green**: Healthy metrics, on track
- 🟡 **Yellow**: Caution, needs attention
- 🔴 **Red**: Critical, immediate action needed

## 🏗️ Building for Distribution

### Build for All Platforms

```bash
npm run dist
```

This creates installers for Windows, macOS, and Linux in the `dist/` directory.

### Build for Specific Platforms

**Windows:**
```bash
npm run build:win
```
Creates `.exe` installer and portable version.

**macOS:**
```bash
npm run build:mac
```
Creates `.dmg` disk image and `.zip` archive.

**Linux:**
```bash
npm run build:linux
```
Creates AppImage and `.deb` package.

## 📁 Project Structure

```
cash-health-tracker/
├── electron-main.js          # Electron main process
├── preload.js                # Preload script for security
├── cash-health-server.js     # Backend API server
├── cash-health.html          # Frontend application
├── package.json              # Project dependencies and scripts
├── cash-health.db            # SQLite database (created at runtime)
└── dist/                     # Build output directory
```

## 🗄️ Database Schema

### Settings Table
- `key`: Setting name (e.g., 'weekly_target', 'dark_mode')
- `value`: Setting value (TEXT)

### Entries Table
- `id`: Auto-increment primary key
- `entry_date`: Date of the entry
- `daily_sales`: Daily sales amount
- `taxes_percent`, `royalty_percent`, `rent_percent`, etc.: Various percentage metrics
- `cash_balance`: Current cash balance
- `created_at`: Timestamp of creation

## 🔧 Configuration

### Changing API Port

By default, the backend server runs on port 3000. To change this:

1. Edit `cash-health-server.js`:
   ```javascript
   const PORT = 3000; // Change this
   ```

2. Edit `cash-health.html`:
   ```javascript
   const API_BASE = 'http://localhost:3000/api'; // Change port here
   ```

### Database Location

The database is stored in:
- **Windows**: `%APPDATA%/cash-health-tracker/cash-health.db`
- **macOS**: `~/Library/Application Support/cash-health-tracker/cash-health.db`
- **Linux**: `~/.config/cash-health-tracker/cash-health.db`

## 🛠️ Development

### Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Desktop Framework**: Electron
- **Build Tool**: electron-builder

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all settings |
| GET | `/api/settings/:key` | Get specific setting |
| PUT | `/api/settings/:key` | Update/create setting |
| GET | `/api/entries` | Get all entries |
| POST | `/api/entries` | Create new entry |
| GET | `/api/entries/:id` | Get specific entry |
| PUT | `/api/entries/:id` | Update entry |
| DELETE | `/api/entries/:id` | Delete entry |
| GET | `/api/health` | Health check |

### Adding Custom Features

The application is modular and easy to extend:

1. **Add new API endpoints**: Edit `cash-health-server.js`
2. **Modify UI**: Edit `cash-health.html`
3. **Add Electron features**: Edit `electron-main.js`

## 🐛 Troubleshooting

### App won't start

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Check if port 3000 is already in use:
   ```bash
   # On Windows
   netstat -ano | findstr :3000

   # On macOS/Linux
   lsof -i :3000
   ```

### Database errors

If you get database errors, try deleting the database file and restarting the app. It will create a fresh database.

### Build errors

Make sure you have the required build tools:

**Windows:**
- Install Windows Build Tools: `npm install --global windows-build-tools`

**macOS:**
- Install Xcode Command Line Tools: `xcode-select --install`

**Linux:**
- Install build essentials: `sudo apt-get install build-essential`

## 📝 License

MIT License - feel free to use this for your business!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Built with ❤️ for business owners who want to keep their cash healthy!**
