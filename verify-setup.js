#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if all required files are present and properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Cash Health Tracker - Setup Verification\n');

const checks = [
  {
    name: 'Package.json',
    file: 'package.json',
    check: (content) => {
      const pkg = JSON.parse(content);
      return pkg.main === 'electron-main.js' &&
             pkg.name === 'cash-health-tracker';
    }
  },
  {
    name: 'Electron Main Process',
    file: 'electron-main.js',
    check: (content) => content.includes('BrowserWindow') && content.includes('cash-health-server')
  },
  {
    name: 'Backend Server',
    file: 'cash-health-server.js',
    check: (content) => content.includes('express') && content.includes('sqlite3')
  },
  {
    name: 'Frontend HTML',
    file: 'cash-health.html',
    check: (content) => content.includes('Cash Health Tracker') && content.includes('API_BASE')
  },
  {
    name: 'Preload Script',
    file: 'preload.js',
    check: (content) => content.includes('contextBridge')
  },
  {
    name: 'Main README',
    file: 'CASH-HEALTH-README.md',
    check: (content) => content.includes('Cash Health Tracker')
  },
  {
    name: 'Setup Guide',
    file: 'SETUP-GUIDE.md',
    check: (content) => content.includes('Quick Start')
  },
  {
    name: 'Assets Directory',
    file: 'assets',
    check: () => true,
    isDirectory: true
  },
  {
    name: 'Gitignore',
    file: '.gitignore',
    check: (content) => content.includes('node_modules') && content.includes('dist')
  }
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  try {
    const filePath = path.join(__dirname, check.file);

    if (check.isDirectory) {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name} - Directory not found`);
        failed++;
      }
    } else {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (check.check(content)) {
          console.log(`✅ ${check.name}`);
          passed++;
        } else {
          console.log(`⚠️  ${check.name} - File exists but content check failed`);
          failed++;
        }
      } else {
        console.log(`❌ ${check.name} - File not found: ${check.file}`);
        failed++;
      }
    }
  } catch (error) {
    console.log(`❌ ${check.name} - Error: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! Your setup looks good.\n');
  console.log('📝 Next steps:');
  console.log('   1. Run: npm install');
  console.log('   2. Run: npm start');
  console.log('   3. Start tracking your cash health!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Please review the errors above.\n');
  process.exit(1);
}
