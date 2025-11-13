# 🔧 Fixing the Electron Crash Issue

## Problem

The app crashes on macOS because the **sqlite3 native module** isn't properly compiled for Electron. Native Node modules need to be rebuilt specifically for Electron's version of Node.js.

## Quick Fix (Run these commands)

```bash
# 1. Install electron-rebuild if you haven't already
npm install

# 2. Rebuild native modules for Electron
npm run rebuild

# 3. Now build the app
npm run build:mac
```

## What Changed

I've updated `package.json` to:

1. **Added `electron-rebuild`** to devDependencies
2. **Added rebuild scripts**:
   - `postinstall`: Automatically rebuilds after `npm install`
   - `rebuild`: Manual rebuild command
   - `prebuild`: Rebuilds before building the app
3. **Updated build configuration**:
   - Includes `node_modules` in packaged app
   - Unpacks sqlite3 from asar archive (required for native modules)

## Alternative Solution: Use better-sqlite3

If you continue to have issues, consider switching to `better-sqlite3` which is faster and more reliable:

```bash
npm uninstall sqlite3
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

Then update `cash-health-server.js`:

```javascript
// Replace this line:
const sqlite3 = require('sqlite3').verbose();

// With:
const Database = require('better-sqlite3');

// And change from:
const db = new sqlite3.Database(dbPath, (err) => {
  // async callback
});

// To:
const db = new Database(dbPath);
// synchronous, no callback needed
```

## Why This Happens

Electron uses its own version of Node.js with different ABI (Application Binary Interface) than regular Node.js. Native modules (written in C/C++) must be compiled specifically for:

1. The correct Node.js version
2. The correct Electron version
3. The correct architecture (x64, arm64, etc.)

## Testing the Fix

After rebuilding, test the app:

```bash
# Run in development mode first
npm start

# If that works, build for distribution
npm run build:mac
```

## If Problems Persist

1. **Clean rebuild**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run rebuild
   npm run build:mac
   ```

2. **Check Electron and sqlite3 versions**:
   ```bash
   npm list electron sqlite3
   ```

3. **Verify the build**:
   - Open the built app
   - Check Console for errors (Cmd+Option+I)
   - Look for sqlite3-related error messages

## Additional Notes

- **macOS ARM64**: If you're on Apple Silicon (M1/M2/M3/M4), make sure you're building for the correct architecture
- **Rosetta**: Don't run the app under Rosetta - it should run natively on ARM64
- **Node Version**: Make sure your Node.js version matches what Electron expects

## Success Indicators

After applying the fix, you should see:

1. ✅ No crash on app startup
2. ✅ Database file created in: `~/Library/Application Support/cash-health-tracker/cash-health.db`
3. ✅ App window opens successfully
4. ✅ Can add entries and see data

---

**Next Steps**: Run `npm install && npm run rebuild && npm run build:mac` and try launching the app again!
