# Assets Directory

This directory contains application icons for different platforms.

## Required Icons

For building the application, you'll need:

### Windows
- `icon.ico` - 256x256 pixels (ICO format)

### macOS
- `icon.icns` - ICNS format with multiple sizes (16x16 to 512x512)

### Linux
- `icon.png` - 512x512 pixels (PNG format)

## Creating Icons

You can create these icons using tools like:
- **Online**: https://www.icoconverter.com/
- **macOS**: Use `iconutil` command-line tool
- **Cross-platform**: Use `electron-icon-builder` npm package

## Quick Setup

Install electron-icon-builder:
```bash
npm install -g electron-icon-builder
```

Create all icons from a single 1024x1024 PNG:
```bash
electron-icon-builder --input=./icon-source.png --output=./assets --flatten
```

## Temporary Solution

If you don't have custom icons yet, the app will use default Electron icons when building.
